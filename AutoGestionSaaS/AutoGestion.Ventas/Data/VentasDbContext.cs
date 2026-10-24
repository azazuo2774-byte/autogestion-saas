using Microsoft.EntityFrameworkCore;
namespace AutoGestion.Ventas.Data;
public sealed class Venta {
 public long Id {get;set;}
 public long VehiculoId {get;set;}
public long ClienteId {get;set;}
public decimal PrecioFinal {get;set;}
public DateTime FechaUtc {get;set;}=DateTime.UtcNow;
public string Estado {get;set;}="Pendiente";
}
public sealed class Reserva {
 public long Id {get;set;}
 public long VehiculoId {get;set;}
 public long ClienteId {get;set;}
 public DateTime FechaReservaUtc {get;set;}=DateTime.UtcNow;
 public DateTime FechaVencimientoUtc {get;set;}
 public decimal? Senia {get;set;}
 public string? MetodoPago {get;set;}
 public string Estado {get;set;}="Activa";
 public string? Notas {get;set;}
}
public sealed class Pago {
 public long Id {get;set;}
 public long VentaId {get;set;}
 public decimal Monto {get;set;}
 public string Moneda {get;set;}="Bs";
 public string Metodo {get;set;}
 public DateTime FechaUtc {get;set;}=DateTime.UtcNow;
 public string? Referencia {get;set;}
 public string? Nota {get;set;}
}
public sealed class VentasDbContext : DbContext {
 public VentasDbContext(DbContextOptions<VentasDbContext> options):base(options){}
 public DbSet<Venta> Ventas => Set<Venta>();
 public DbSet<Reserva> Reservas => Set<Reserva>();
 public DbSet<Pago> Pagos => Set<Pago>();
 protected override void OnModelCreating(ModelBuilder modelBuilder) {
   modelBuilder.Entity<Venta>(entity=> {
     entity.ToTable("ventas");entity.HasKey(x=>x.Id);
     entity.Property(x=>x.PrecioFinal).HasPrecision(14,2);
entity.Property(x=>x.Estado).HasMaxLength(30).IsRequired();
   });
   modelBuilder.Entity<Reserva>(entity=> {
     entity.ToTable("reservas");entity.HasKey(x=>x.Id);
     entity.Property(x=>x.Senia).HasPrecision(14,2);
     entity.Property(x=>x.Estado).HasMaxLength(30).IsRequired();
   });
   modelBuilder.Entity<Pago>(entity=> {
     entity.ToTable("pagos");entity.HasKey(x=>x.Id);
     entity.Property(x=>x.Monto).HasPrecision(14,2);
     entity.Property(x=>x.Metodo).HasMaxLength(50).IsRequired();
   });
 }
}
