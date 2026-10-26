using AutoGestion.Administrador.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AutoGestion.Administrador.Services;

public class SuscripcionVencidaWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<SuscripcionVencidaWorker> _logger;

    public SuscripcionVencidaWorker(
        IServiceProvider serviceProvider,
        ILogger<SuscripcionVencidaWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Worker de suscripciones vencidas iniciado.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AdminDbContext>();

                var ahora = DateTime.UtcNow;
                var vencidas = await db.Suscripciones
                    .Where(s => s.Estado == "Activo" && s.VencimientoUtc < ahora)
                    .ToListAsync(stoppingToken);

                if (vencidas.Any())
                {
                    foreach (var s in vencidas)
                    {
                        s.Estado = "Vencida";
                    }

                    await db.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation($"Marcadas {vencidas.Count} suscripciones como vencidas.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al procesar suscripciones vencidas.");
            }

            // Ejecutar cada hora
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }

        _logger.LogInformation("Worker de suscripciones vencidas detenido.");
    }
}
