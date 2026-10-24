using AutoGestion.Ventas.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AutoGestion.Ventas;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<VentasDbContext>
{
    public VentasDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<VentasDbContext>();
        
        // Usar la conexión de catálogo para migraciones
        var connectionString = "Host=localhost;Port=5432;Username=postgres;Password=postgres;Database=autogestion_catalogo";
        optionsBuilder.UseNpgsql(connectionString);

        return new VentasDbContext(optionsBuilder.Options);
    }
}
