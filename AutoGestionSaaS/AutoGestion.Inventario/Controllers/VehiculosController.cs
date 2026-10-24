using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoGestion.Inventario.Data;
namespace AutoGestion.Inventario.Controllers;
[ApiController][Route("api/vehiculos")]
public sealed class VehiculosController:ControllerBase {
 private readonly InventarioDbContext _db;
 public VehiculosController(InventarioDbContext db)=>_db=db;
 [HttpGet]public async Task<IActionResult> Get()=>Ok(await _db.Vehiculos.AsNoTracking().ToListAsync());
 [HttpGet("{id:long}")]public async Task<IActionResult> GetId(long id){var value=await _db.Vehiculos.FindAsync(id);return value is null?NotFound():Ok(value);}
 [HttpPost]public async Task<IActionResult> Post(Vehiculo body){
   body.Id=0;
   if(body.Anio<1900 || body.Precio<=0 || string.IsNullOrWhiteSpace(body.Marca))return BadRequest("Datos del vehiculo invalidos");
   _db.Vehiculos.Add(body);await _db.SaveChangesAsync();return CreatedAtAction(nameof(GetId),new{id=body.Id},body);
 }
 [HttpPut("{id:long}")]public async Task<IActionResult> Put(long id,Vehiculo body){
 var old=await _db.Vehiculos.FindAsync(id);if(old is null)return NotFound();
 old.Marca=body.Marca;old.Modelo=body.Modelo;old.Anio=body.Anio;old.Precio=body.Precio;old.Estado=body.Estado;
 await _db.SaveChangesAsync();return NoContent();
 }
 [HttpDelete("{id:long}")]public async Task<IActionResult> Delete(long id){var v=await _db.Vehiculos.FindAsync(id);if(v is null)return NotFound();_db.Vehiculos.Remove(v);await _db.SaveChangesAsync();return NoContent();}
}
