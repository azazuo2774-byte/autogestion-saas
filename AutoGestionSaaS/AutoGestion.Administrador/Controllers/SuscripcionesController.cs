using AutoGestion.Administrador.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace AutoGestion.Administrador.Controllers;
public record SuscripcionRequest(long UsuarioId,long PlanId,DateTime? InicioUtc,string? ContactoCorreo,string? ContactoTelefono);
[ApiController][Route("api/suscripciones")]
public sealed class SuscripcionesController:ControllerBase{
 private readonly AdminDbContext _db;public SuscripcionesController(AdminDbContext db)=>_db=db;
 [HttpPost]public async Task<IActionResult> Suscribir(SuscripcionRequest req){
 var user=await _db.Usuarios.Include(u=>u.Tenant).FirstOrDefaultAsync(u=>u.Id==req.UsuarioId);
 if(user is null)return NotFound(new{error="Usuario inexistente"});
 if(user.Tenant.Estado!="Activo")return BadRequest(new{error="Tenant no activo"});
 var plan=await _db.Planes.FindAsync(req.PlanId);if(plan is null)return NotFound(new{error="Plan inexistente"});
 if(!plan.Disponible)return BadRequest(new{error="Plan no disponible"});
 var now=DateTime.UtcNow;var inicio=req.InicioUtc?.ToUniversalTime()??now;
 if(inicio<now.AddMinutes(-5))return BadRequest(new{error="No se admite inicio anterior a la fecha actual"});
 DateTime fin;try{fin=inicio.AddDays(plan.DuracionDias);}catch(ArgumentOutOfRangeException){return BadRequest(new{error="Duracion fuera de rango"});}
 if(fin<=inicio)return BadRequest("Vencimiento invalido");
 // Evitar múltiples suscripciones habilitadas solapadas para el mismo usuario.
 if(await _db.Suscripciones.AnyAsync(x=>x.UsuarioId==user.Id&&x.Estado=="Habilitada"&&x.VencimientoUtc>inicio&&x.InicioUtc<fin))return Conflict(new{error="Ya existe suscripcion habilitada en el periodo"});
 var s=new Suscripcion{
 UsuarioId=user.Id,
 TenantId=user.TenantId,
 PlanId=plan.Id,
 InicioUtc=inicio,
 VencimientoUtc=fin,
 Estado="Inscrita",
 ContactoCorreo=req.ContactoCorreo?.Trim().ToLowerInvariant(),
 ContactoTelefono=req.ContactoTelefono?.Trim()
 };
 _db.Suscripciones.Add(s);await _db.SaveChangesAsync();return Created($"/api/suscripciones/usuario/{user.Id}",new{s.Id,s.UsuarioId,s.TenantId,s.PlanId,s.InicioUtc,s.VencimientoUtc,s.Estado,s.ContactoCorreo,s.ContactoTelefono});
 }
 [HttpGet("usuario/{id:long}")]public async Task<IActionResult> Historial(long id){if(!await _db.Usuarios.AnyAsync(u=>u.Id==id))return NotFound(new{error="Usuario inexistente"});return Ok(await _db.Suscripciones.Where(s=>s.UsuarioId==id).Include(s=>s.Plan).OrderByDescending(s=>s.InicioUtc).Select(s=>new{s.Id,s.UsuarioId,s.TenantId,Plan=s.Plan.Nombre,s.InicioUtc,s.VencimientoUtc,s.Estado}).ToListAsync());}
 [HttpGet("vigencia/{id:long}")]public async Task<IActionResult> Vigencia(long id){
 var user=await _db.Usuarios.FindAsync(id);if(user is null)return NotFound(new{error="Usuario inexistente"});
 var ahora=DateTime.UtcNow;
 var registros=await _db.Suscripciones.AsNoTracking().Include(s=>s.Plan).Where(s=>s.UsuarioId==id).OrderByDescending(s=>s.InicioUtc).ToListAsync();
 var vigente=registros.FirstOrDefault(s=>s.Estado=="Habilitada"&&s.InicioUtc<=ahora&&ahora<s.VencimientoUtc);
 var s=vigente??registros.FirstOrDefault();
 if(s is null)return Ok(new{usuarioId=id,tenantId=user.TenantId,resultado="Inexistente",fechaConsultaUtc=ahora});
 string resultado=vigente is not null?"Activa":"Vencida";
 return Ok(new{usuarioId=id,tenantId=user.TenantId,plan=s.Plan.Nombre,inicioUtc=s.InicioUtc,vencimientoUtc=s.VencimientoUtc,estado=s.Estado,resultado,fechaConsultaUtc=ahora});
 }
 [HttpPut("{id:long}/cancelar")]public async Task<IActionResult> Cancelar(long id){var s=await _db.Suscripciones.FindAsync(id);if(s is null)return NotFound();s.Estado="Cancelada";await _db.SaveChangesAsync();return Ok(s);}
 [HttpDelete("{id:long}")]public async Task<IActionResult> Eliminar(long id){var s=await _db.Suscripciones.FindAsync(id);if(s is null)return NotFound();_db.Suscripciones.Remove(s);await _db.SaveChangesAsync();return NoContent();}
 // Endpoint para landing page: marcar suscripción como Atendida por correo o teléfono
 [HttpPut("atender")]
 public async Task<IActionResult> Atender([FromBody] AtenderRequest req){
 if(string.IsNullOrWhiteSpace(req.Correo)&&string.IsNullOrWhiteSpace(req.Telefono))
 return BadRequest(new{error="Debe proporcionar correo o teléfono"});
 IQueryable<Suscripcion> query=_db.Suscripciones.Include(s=>s.Usuario).Include(s=>s.Plan);
 if(!string.IsNullOrWhiteSpace(req.Correo)){
 query=query.Where(s=>s.ContactoCorreo==req.Correo.Trim().ToLowerInvariant());
 }
 if(!string.IsNullOrWhiteSpace(req.Telefono)){
 query=query.Where(s=>s.ContactoTelefono==req.Telefono.Trim());
 }
 var suscripciones=await query.Where(s=>s.Estado=="Inscrita").ToListAsync();
 if(suscripciones.Count==0)
 return NotFound(new{error="No se encontró suscripción Inscrita con los datos proporcionados"});
 if(suscripciones.Count>1)
 return Conflict(new{error="Múltiples suscripciones encontradas. Contacte al administrador."});
 var s=suscripciones[0];
 s.Estado="Atendida";
 await _db.SaveChangesAsync();
 return Ok(new{
 id=s.Id,
 usuarioId=s.UsuarioId,
 usuario=s.Usuario.Nombre,
 plan=s.Plan.Nombre,
 estadoAnterior="Inscrita",
 estadoNuevo="Atendida",
 correo=s.ContactoCorreo,
 telefono=s.ContactoTelefono
 });
 }
 // Endpoint para activar suscripción (llamado desde CrearUsuario)
 [HttpPut("{id:long}/activar")]
 public async Task<IActionResult> Activar(long id){
 var s=await _db.Suscripciones.FindAsync(id);
 if(s is null)return NotFound(new{error="Suscripción no encontrada"});
 if(s.Estado!="Atendida")return BadRequest(new{error="Solo se pueden activar suscripciones en estado Atendida"});
 s.Estado="Activo";
 await _db.SaveChangesAsync();
 return Ok(new{
 id=s.Id,
 estadoAnterior="Atendida",
 estadoNuevo="Activo"
 });
 }
}
public record AtenderRequest(string? Correo,string? Telefono);
