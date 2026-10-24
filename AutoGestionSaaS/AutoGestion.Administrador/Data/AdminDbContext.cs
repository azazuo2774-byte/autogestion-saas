using Microsoft.EntityFrameworkCore;
namespace AutoGestion.Administrador.Data;
public sealed class Tenant {public long Id{get;set;} public string Nombre{get;set;}="";public string Estado{get;set;}="Pendiente";public List<Usuario> Usuarios{get;set;}=new();}
public sealed class Usuario {public long Id{get;set;} public long TenantId{get;set;} public Tenant Tenant{get;set;}=null!;public string Email{get;set;}="";public string Nombre{get;set;}="";public string PasswordHash{get;set;}="";public List<Suscripcion> Suscripciones{get;set;}=new();}
public sealed class Plan {public long Id{get;set;} public string Nombre{get;set;}="";public decimal Precio{get;set;} public int DuracionDias{get;set;} public bool Disponible{get;set;}=true; public List<Suscripcion> Suscripciones{get;set;}=new();}
public sealed class Suscripcion {public long Id{get;set;} public long UsuarioId{get;set;} public Usuario Usuario{get;set;}=null!;public long TenantId{get;set;} public Tenant Tenant{get;set;}=null!;public long PlanId{get;set;} public Plan Plan{get;set;}=null!;public DateTime InicioUtc{get;set;} public DateTime VencimientoUtc{get;set;} public string Estado{get;set;}="Habilitada";}
public sealed class AdminDbContext:DbContext {
 public AdminDbContext(DbContextOptions<AdminDbContext> options):base(options){}
 public DbSet<Tenant> Tenants=>Set<Tenant>();public DbSet<Usuario> Usuarios=>Set<Usuario>();public DbSet<Plan> Planes=>Set<Plan>();public DbSet<Suscripcion> Suscripciones=>Set<Suscripcion>();
 protected override void OnModelCreating(ModelBuilder b){
 b.Entity<Tenant>().HasIndex(t=>t.Nombre).IsUnique();
 b.Entity<Usuario>().HasIndex(u=>u.Email).IsUnique();
 b.Entity<Usuario>().HasOne(x=>x.Tenant).WithMany(x=>x.Usuarios).HasForeignKey(x=>x.TenantId);
 b.Entity<Usuario>().Property(x=>x.Email).HasMaxLength(200);
 b.Entity<Plan>().Property(x=>x.Precio).HasPrecision(14,2);
 b.Entity<Plan>().HasIndex(x=>x.Nombre).IsUnique();
 b.Entity<Suscripcion>().HasOne(x=>x.Usuario).WithMany(x=>x.Suscripciones).HasForeignKey(x=>x.UsuarioId).OnDelete(DeleteBehavior.Restrict);
 b.Entity<Suscripcion>().HasOne(x=>x.Plan).WithMany(x=>x.Suscripciones).HasForeignKey(x=>x.PlanId).OnDelete(DeleteBehavior.Restrict);
 b.Entity<Suscripcion>().HasOne(x=>x.Tenant).WithMany().HasForeignKey(x=>x.TenantId).OnDelete(DeleteBehavior.Restrict);
 b.Entity<Suscripcion>().HasIndex(x=>new{x.UsuarioId,x.VencimientoUtc});
 }
}
