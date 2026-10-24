using AutoGestion.Administrador.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoGestion.Administrador.Controllers;

public record TenantRequest(string Nombre, string Estado);

[ApiController]
[Route("api/tenants")]
public sealed class TenantsController : ControllerBase
{
    private readonly AdminDbContext _db;

    public TenantsController(AdminDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Listar() => Ok(await _db.Tenants.AsNoTracking().ToListAsync());

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Uno(long id)
    {
        var t = await _db.Tenants.FindAsync(id);
        return t is null ? NotFound() : Ok(t);
    }

    [HttpPost]
    public async Task<IActionResult> Crear(TenantRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Nombre))
            return BadRequest("Nombre requerido");

        if (await _db.Tenants.AnyAsync(t => t.Nombre == req.Nombre))
            return Conflict("Nombre ya existe");

        var t = new Tenant
        {
            Nombre = req.Nombre,
            Estado = req.Estado ?? "Pendiente"
        };

        _db.Tenants.Add(t);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Uno), new { id = t.Id }, t);
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Editar(long id, TenantRequest req)
    {
        var t = await _db.Tenants.FindAsync(id);
        if (t is null) return NotFound();

        if (string.IsNullOrWhiteSpace(req.Nombre))
            return BadRequest("Nombre requerido");

        if (await _db.Tenants.AnyAsync(x => x.Nombre == req.Nombre && x.Id != id))
            return Conflict("Nombre ya existe");

        t.Nombre = req.Nombre;
        t.Estado = req.Estado ?? t.Estado;
        await _db.SaveChangesAsync();
        return Ok(t);
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Eliminar(long id)
    {
        var t = await _db.Tenants.FindAsync(id);
        if (t is null) return NotFound();

        if (await _db.Usuarios.AnyAsync(u => u.TenantId == id))
            return BadRequest("No se puede eliminar un tenant con usuarios");

        _db.Tenants.Remove(t);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
