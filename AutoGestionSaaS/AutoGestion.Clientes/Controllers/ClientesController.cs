using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoGestion.Clientes.Data;
namespace AutoGestion.Clientes.Controllers;
[ApiController][Route("api/clientes")]
public sealed class ClientesController:ControllerBase {
 private readonly ClientesDbContext _db;
 public ClientesController(ClientesDbContext db)=>_db=db;
 [HttpGet]public async Task<IActionResult> Get()=>Ok(await _db.Clientes.AsNoTracking().ToListAsync());
 [HttpGet("{id:long}")]public async Task<IActionResult> GetId(long id){var value=await _db.Clientes.FindAsync(id);return value is null?NotFound():Ok(value);}
 [HttpPost]public async Task<IActionResult> Post(Cliente body){
   body.Id=0;
   if(string.IsNullOrWhiteSpace(body.Nombre))return BadRequest("Nombre requerido");
   _db.Clientes.Add(body);await _db.SaveChangesAsync();return CreatedAtAction(nameof(GetId),new{id=body.Id},body);
 }
 [HttpPut("{id:long}")]public async Task<IActionResult> Put(long id,Cliente body){
 var old=await _db.Clientes.FindAsync(id);if(old is null)return NotFound();
 old.Nombre=body.Nombre;old.Telefono=body.Telefono;old.Correo=body.Correo;
 await _db.SaveChangesAsync();return NoContent();
 }
 [HttpDelete("{id:long}")]public async Task<IActionResult> Delete(long id){var c=await _db.Clientes.FindAsync(id);if(c is null)return NotFound();_db.Clientes.Remove(c);await _db.SaveChangesAsync();return NoContent();}
}
