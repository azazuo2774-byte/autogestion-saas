
using Microsoft.EntityFrameworkCore;

namespace AutoGestion.Clientes.Data;

public sealed class Cliente
{
    public long Id { get; set; }

    public string Nombre { get; set; } = "";

    public string Telefono { get; set; } = "";

    public string? Correo { get; set; }
}

public sealed class ClientesDbContext : DbContext
{
    public ClientesDbContext(
        DbContextOptions<ClientesDbContext> options
    ) : base(options)
    {
    }

    public DbSet<Cliente> Clientes => Set<Cliente>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("clientes");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Nombre)
                .HasMaxLength(160)
                .IsRequired();

            entity.Property(x => x.Telefono)
                .HasMaxLength(30);

            entity.Property(x => x.Correo)
                .HasMaxLength(180);
        });
    }
}
