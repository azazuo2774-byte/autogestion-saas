using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoGestion.Ventas.Data;
namespace AutoGestion.Ventas.Controllers;
[ApiController][Route("api/ventas")]
public sealed class VentasController:ControllerBase {
 private readonly VentasDbContext _db;
 public VentasController(VentasDbContext db)=>_db=db;
 [HttpGet]public async Task<IActionResult> Get()=>Ok(await _db.Ventas.AsNoTracking().ToListAsync());
 [HttpGet("{id:long}")]public async Task<IActionResult> GetId(long id){var value=await _db.Ventas.FindAsync(id);return value is null?NotFound():Ok(value);}
 [HttpPost]public async Task<IActionResult> Post(Venta body){
   body.Id=0;
   if(body.PrecioFinal<=0 || body.ClienteId<=0 || body.VehiculoId<=0)return BadRequest("Datos de venta invalidos");
   _db.Ventas.Add(body);await _db.SaveChangesAsync();return CreatedAtAction(nameof(GetId),new{id=body.Id},body);
 }
 [HttpPut("{id:long}")]public async Task<IActionResult> Put(long id,Venta body){
 var old=await _db.Ventas.FindAsync(id);if(old is null)return NotFound();
 old.VehiculoId=body.VehiculoId;old.ClienteId=body.ClienteId;old.PrecioFinal=body.PrecioFinal;old.Estado=body.Estado;
 await _db.SaveChangesAsync();return NoContent();
 }
 [HttpDelete("{id:long}")]public async Task<IActionResult> Delete(long id){var v=await _db.Ventas.FindAsync(id);if(v is null)return NotFound();_db.Ventas.Remove(v);await _db.SaveChangesAsync();return NoContent();}
}
