using AutoGestion.Administrador.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace AutoGestion.Administrador.Controllers;

public record UsuarioRequest(long TenantId, string Nombre, string Email, string? Password);

[ApiController]
[Route("api/usuarios")]
public sealed class UsuariosController : ControllerBase
{
    private readonly AdminDbContext _db;
    private readonly PasswordHasher<Usuario> _hasher;

    public UsuariosController(AdminDbContext db)
    {
        _db = db;
        _hasher = new PasswordHasher<Usuario>();
    }

    [HttpGet]
    public async Task<IActionResult> Listar() => Ok(await _db.Usuarios.AsNoTracking().Include(u => u.Tenant).ToListAsync());

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Uno(long id)
    {
        var u = await _db.Usuarios.Include(u => u.Tenant).FirstOrDefaultAsync(u => u.Id == id);
        return u is null ? NotFound() : Ok(new { u.Id, u.TenantId, Tenant = u.Tenant?.Nombre, u.Nombre, u.Email });
    }

    [HttpPost]
    public async Task<IActionResult> Crear(UsuarioRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Nombre) || string.IsNullOrWhiteSpace(req.Email))
            return BadRequest("Nombre y correo requeridos");

        if (req.Password is not null && req.Password.Length < 8)
            return BadRequest("Contraseña debe tener al menos 8 caracteres");

        if (!await _db.Tenants.AnyAsync(t => t.Id == req.TenantId))
            return NotFound("Tenant no existe");

        if (await _db.Usuarios.AnyAsync(u => u.Email == req.Email))
            return Conflict("Correo ya registrado");

        var user = new Usuario
        {
            TenantId = req.TenantId,
            Nombre = req.Nombre,
            Email = req.Email.Trim().ToLowerInvariant()
        };

        if (!string.IsNullOrWhiteSpace(req.Password))
            user.PasswordHash = _hasher.HashPassword(user, req.Password);

        _db.Usuarios.Add(user);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Uno), new { id = user.Id }, new { user.Id, user.TenantId, user.Nombre, user.Email });
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Editar(long id, UsuarioRequest req)
    {
        var u = await _db.Usuarios.FindAsync(id);
        if (u is null) return NotFound();

        if (string.IsNullOrWhiteSpace(req.Nombre) || string.IsNullOrWhiteSpace(req.Email))
            return BadRequest("Nombre y correo requeridos");

        if (await _db.Usuarios.AnyAsync(x => x.Email == req.Email && x.Id != id))
            return Conflict("Correo ya registrado");

        u.Nombre = req.Nombre;
        u.Email = req.Email.Trim().ToLowerInvariant();

        if (!string.IsNullOrWhiteSpace(req.Password))
            u.PasswordHash = _hasher.HashPassword(u, req.Password);

        await _db.SaveChangesAsync();
        return Ok(new { u.Id, u.TenantId, u.Nombre, u.Email });
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Eliminar(long id)
    {
        var u = await _db.Usuarios.FindAsync(id);
        if (u is null) return NotFound();

        if (await _db.Suscripciones.AnyAsync(s => s.UsuarioId == id && s.Estado == "Habilitada"))
            return BadRequest("No se puede eliminar un usuario con suscripción activa");

        _db.Usuarios.Remove(u);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
