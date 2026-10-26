using AutoGestion.Administrador.Data;
using AutoGestion.Administrador.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
namespace AutoGestion.Administrador.Controllers;
public record RegistroRequest(string TenantNombre,string Nombre,string Email,string Password);
[ApiController][Route("api/registro")]
public sealed class RegistroController:ControllerBase{
 private readonly AdminDbContext _db;private readonly TenantProvisioner _provision;
 public RegistroController(AdminDbContext db,TenantProvisioner provision){_db=db;_provision=provision;}
 [HttpPost]
 public async Task<IActionResult> Registrar(RegistroRequest req,CancellationToken ct){
 if(string.IsNullOrWhiteSpace(req.TenantNombre)||string.IsNullOrWhiteSpace(req.Email)||req.Password.Length<8)return BadRequest(new{error="Tenant, correo y contraseña de 8 caracteres requeridos"});
 string email=req.Email.Trim().ToLowerInvariant();string nombre=req.TenantNombre.Trim();
 if(await _db.Usuarios.AnyAsync(u=>u.Email==email,ct))return Conflict(new{error="Correo ya registrado"});
 var tenant=await _db.Tenants.FirstOrDefaultAsync(t=>t.Nombre==nombre,ct);
 bool nuevo=tenant is null;
 if(nuevo){tenant=new Tenant{Nombre=nombre,Estado="Pendiente"};_db.Tenants.Add(tenant);await _db.SaveChangesAsync(ct);}
 if(tenant!.Estado=="Fallido"||tenant.Estado=="Pendiente"||nuevo){
  try{await _provision.ProvisionAsync(tenant.Id,ct);tenant.Estado="Activo";await _db.SaveChangesAsync(ct);}
  catch(Exception ex){tenant.Estado="Fallido";await _db.SaveChangesAsync(CancellationToken.None);return StatusCode(503,new{error="No fue posible completar todas las bases",tenantId=tenant.Id,detalle=ex.Message});}
 }
 if(tenant.Estado!="Activo")return Conflict(new{error="Tenant no disponible"});
 var user=new Usuario{TenantId=tenant.Id,Nombre=req.Nombre,Email=email};
 user.PasswordHash=new PasswordHasher<Usuario>().HashPassword(user,req.Password);
 _db.Usuarios.Add(user);await _db.SaveChangesAsync(ct);
 // Activar suscripción si existe una en estado Atendida con el mismo correo
 var suscripcion=await _db.Suscripciones.FirstOrDefaultAsync(s=>s.ContactoCorreo==email&&s.Estado=="Atendida",ct);
 string? suscripcionActivada=null;
 if(suscripcion is not null){
 suscripcion.Estado="Activo";
 await _db.SaveChangesAsync(ct);
 suscripcionActivada=$"Suscripción {suscripcion.Id} activada";
 }
 return Created($"/api/usuarios/{user.Id}",new{usuarioId=user.Id,tenantId=tenant.Id,tenant=tenant.Nombre,bases=new[]{ $"autogestion_inventario_{tenant.Id}",$"autogestion_clientes_{tenant.Id}",$"autogestion_ventas_{tenant.Id}"},suscripcionActivada});
 }
 [HttpPost("reintentar-tenant/{tenantId:long}")]
 public async Task<IActionResult> Reintentar(long tenantId,CancellationToken ct){
 var t=await _db.Tenants.FindAsync(new object[]{tenantId},ct);if(t is null)return NotFound();
 try{await _provision.ProvisionAsync(t.Id,ct);t.Estado="Activo";await _db.SaveChangesAsync(ct);return Ok(new{tenantId,estado=t.Estado});}
 catch(Exception ex){t.Estado="Fallido";await _db.SaveChangesAsync(CancellationToken.None);return StatusCode(503,new{error=ex.Message});}
 }
}
