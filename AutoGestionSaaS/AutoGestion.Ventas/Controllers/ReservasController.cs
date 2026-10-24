using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoGestion.Ventas.Data;

namespace AutoGestion.Ventas.Controllers;

public record ReservaRequest(long VehiculoId, long ClienteId, DateTime FechaVencimientoUtc, decimal? Senia, string? MetodoPago, string? Notas);

[ApiController]
[Route("api/reservas")]
public sealed class ReservasController : ControllerBase
{
    private readonly VentasDbContext _db;

    public ReservasController(VentasDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Listar() => Ok(await _db.Reservas.AsNoTracking().ToListAsync());

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Uno(long id)
    {
        var r = await _db.Reservas.FindAsync(id);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPost]
    public async Task<IActionResult> Crear(ReservaRequest req)
    {
        if (req.VehiculoId <= 0 || req.ClienteId <= 0)
            return BadRequest("Vehículo y cliente requeridos");

        if (req.FechaVencimientoUtc <= DateTime.UtcNow)
            return BadRequest("Fecha de vencimiento debe ser futura");

        var r = new Reserva
        {
            VehiculoId = req.VehiculoId,
            ClienteId = req.ClienteId,
            FechaReservaUtc = DateTime.UtcNow,
            FechaVencimientoUtc = req.FechaVencimientoUtc,
            Senia = req.Senia,
            MetodoPago = req.MetodoPago,
            Estado = "Activa",
            Notas = req.Notas
        };

        _db.Reservas.Add(r);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Uno), new { id = r.Id }, r);
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Editar(long id, ReservaRequest req)
    {
        var r = await _db.Reservas.FindAsync(id);
        if (r is null) return NotFound();

        if (req.FechaVencimientoUtc <= DateTime.UtcNow)
            return BadRequest("Fecha de vencimiento debe ser futura");

        r.VehiculoId = req.VehiculoId;
        r.ClienteId = req.ClienteId;
        r.FechaVencimientoUtc = req.FechaVencimientoUtc;
        r.Senia = req.Senia;
        r.MetodoPago = req.MetodoPago;
        r.Notas = req.Notas;
        await _db.SaveChangesAsync();
        return Ok(r);
    }

    [HttpPut("{id:long}/cancelar")]
    public async Task<IActionResult> Cancelar(long id)
    {
        var r = await _db.Reservas.FindAsync(id);
        if (r is null) return NotFound();

        r.Estado = "Cancelada";
        await _db.SaveChangesAsync();
        return Ok(r);
    }

    [HttpPut("{id:long}/convertir")]
    public async Task<IActionResult> Convertir(long id)
    {
        var r = await _db.Reservas.FindAsync(id);
        if (r is null) return NotFound();

        r.Estado = "Convertida";
        await _db.SaveChangesAsync();
        return Ok(r);
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Eliminar(long id)
    {
        var r = await _db.Reservas.FindAsync(id);
        if (r is null) return NotFound();

        _db.Reservas.Remove(r);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
