using AutoGestion.Administrador.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace AutoGestion.Administrador.Controllers;
public record PlanRequest(string Nombre,decimal Precio,int DuracionDias,bool Disponible);
[ApiController][Route("api/planes")]
public sealed class PlanesController:ControllerBase{
 private readonly AdminDbContext _db;public PlanesController(AdminDbContext db)=>_db=db;
 [HttpGet]public async Task<IActionResult> Listar()=>Ok(await _db.Planes.AsNoTracking().ToListAsync());
 [HttpGet("disponibles")]public async Task<IActionResult> Disponibles()=>Ok(await _db.Planes.AsNoTracking().Where(x=>x.Disponible).ToListAsync());
 [HttpGet("{id:long}")]public async Task<IActionResult> Uno(long id){var p=await _db.Planes.FindAsync(id);return p is null?NotFound():Ok(p);}
 [HttpPost]public async Task<IActionResult> Crear(PlanRequest req){if(string.IsNullOrWhiteSpace(req.Nombre)||req.Precio<0||req.DuracionDias<=0)return BadRequest("Precio, duración o nombre inválidos");var p=new Plan{Nombre=req.Nombre,Precio=req.Precio,DuracionDias=req.DuracionDias,Disponible=req.Disponible};_db.Planes.Add(p);await _db.SaveChangesAsync();return CreatedAtAction(nameof(Uno),new{id=p.Id},p);}
 [HttpPut("{id:long}")]public async Task<IActionResult> Editar(long id,PlanRequest req){var p=await _db.Planes.FindAsync(id);if(p is null)return NotFound();if(string.IsNullOrWhiteSpace(req.Nombre)||req.Precio<0||req.DuracionDias<=0)return BadRequest();p.Nombre=req.Nombre;p.Precio=req.Precio;p.DuracionDias=req.DuracionDias;p.Disponible=req.Disponible;await _db.SaveChangesAsync();return Ok(p);}
 [HttpDelete("{id:long}")]public async Task<IActionResult> Eliminar(long id){var p=await _db.Planes.FindAsync(id);if(p is null)return NotFound();_db.Planes.Remove(p);await _db.SaveChangesAsync();return NoContent();}
}
