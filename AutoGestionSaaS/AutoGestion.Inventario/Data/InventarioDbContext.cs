using Microsoft.EntityFrameworkCore;
namespace AutoGestion.Inventario.Data;
public sealed class Vehiculo {
 public long Id {get;set;}
 public string Marca {get;set;} = "";
public string Modelo {get;set;} = "";
public int Anio {get;set;}
public decimal Precio {get;set;}
public string Estado {get;set;} = "Disponible";
}
public sealed class InventarioDbContext : DbContext {
 public InventarioDbContext(DbContextOptions<InventarioDbContext> options):base(options){}
 public DbSet<Vehiculo> Vehiculos => Set<Vehiculo>();
 protected override void OnModelCreating(ModelBuilder modelBuilder) {
   modelBuilder.Entity<Vehiculo>(entity=> {
     entity.ToTable("vehiculos");entity.HasKey(x=>x.Id);
     entity.Property(x=>x.Marca).HasMaxLength(100).IsRequired();
entity.Property(x=>x.Modelo).HasMaxLength(100).IsRequired();
entity.Property(x=>x.Precio).HasPrecision(14,2);
entity.Property(x=>x.Estado).HasMaxLength(30).IsRequired();
   });
 }
}
