using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoGestion.Ventas.Data;

namespace AutoGestion.Ventas.Controllers;

public record PagoRequest(long VentaId, decimal Monto, string Moneda, string Metodo, string? Referencia, string? Nota);

[ApiController]
[Route("api/pagos")]
public sealed class PagosController : ControllerBase
{
    private readonly VentasDbContext _db;

    public PagosController(VentasDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Listar() => Ok(await _db.Pagos.AsNoTracking().ToListAsync());

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Uno(long id)
    {
        var p = await _db.Pagos.FindAsync(id);
        return p is null ? NotFound() : Ok(p);
    }

    [HttpGet("venta/{ventaId:long}")]
    public async Task<IActionResult> PorVenta(long ventaId)
    {
        var pagos = await _db.Pagos.AsNoTracking().Where(p => p.VentaId == ventaId).ToListAsync();
        return Ok(pagos);
    }

    [HttpPost]
    public async Task<IActionResult> Crear(PagoRequest req)
    {
        if (req.VentaId <= 0 || req.Monto <= 0)
            return BadRequest("Venta y monto requeridos");

        if (string.IsNullOrWhiteSpace(req.Metodo))
            return BadRequest("Método de pago requerido");

        var p = new Pago
        {
            VentaId = req.VentaId,
            Monto = req.Monto,
            Moneda = req.Moneda ?? "Bs",
            Metodo = req.Metodo,
            FechaUtc = DateTime.UtcNow,
            Referencia = req.Referencia,
            Nota = req.Nota
        };

        _db.Pagos.Add(p);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Uno), new { id = p.Id }, p);
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Editar(long id, PagoRequest req)
    {
        var p = await _db.Pagos.FindAsync(id);
        if (p is null) return NotFound();

        if (req.Monto <= 0)
            return BadRequest("Monto debe ser mayor a 0");

        p.VentaId = req.VentaId;
        p.Monto = req.Monto;
        p.Moneda = req.Moneda ?? p.Moneda;
        p.Metodo = req.Metodo;
        p.Referencia = req.Referencia;
        p.Nota = req.Nota;
        await _db.SaveChangesAsync();
        return Ok(p);
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Eliminar(long id)
    {
        var p = await _db.Pagos.FindAsync(id);
        if (p is null) return NotFound();

        _db.Pagos.Remove(p);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
