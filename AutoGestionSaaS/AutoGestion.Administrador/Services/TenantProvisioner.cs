using Microsoft.EntityFrameworkCore;
using Npgsql;
using AutoGestion.Inventario.Data;
using AutoGestion.Clientes.Data;
using AutoGestion.Ventas.Data;
namespace AutoGestion.Administrador.Services;
public sealed class TenantProvisioner {
 private readonly IConfiguration _cfg;
 private static readonly SemaphoreSlim LocalGate=new(1,1);
 public TenantProvisioner(IConfiguration cfg)=>_cfg=cfg;
 public async Task ProvisionAsync(long tenantId,CancellationToken ct=default){
   if(tenantId<=0)throw new ArgumentOutOfRangeException(nameof(tenantId));
   await LocalGate.WaitAsync(ct);
   try{
     await EnsureAndMigrate(tenantId,"inventario",async cs=>{
       var opts=new DbContextOptionsBuilder<InventarioDbContext>().UseNpgsql(cs).Options;
       await using var db=new InventarioDbContext(opts);await db.Database.MigrateAsync(ct);
     },ct);
     await EnsureAndMigrate(tenantId,"clientes",async cs=>{
       var opts=new DbContextOptionsBuilder<ClientesDbContext>().UseNpgsql(cs).Options;
       await using var db=new ClientesDbContext(opts);await db.Database.MigrateAsync(ct);
     },ct);
     await EnsureAndMigrate(tenantId,"ventas",async cs=>{
       var opts=new DbContextOptionsBuilder<VentasDbContext>().UseNpgsql(cs).Options;
       await using var db=new VentasDbContext(opts);await db.Database.MigrateAsync(ct);
     },ct);
   }finally{LocalGate.Release();}
 }
 private async Task EnsureAndMigrate(long tenantId,string micro,Func<string,Task> migrate,CancellationToken ct){
   string database=$"autogestion_{micro}_{tenantId}";
   string catalog=_cfg.GetConnectionString("Catalogo") ?? throw new InvalidOperationException("Catalogo no configurado");
   var b=new NpgsqlConnectionStringBuilder(catalog){Database="postgres"};
   await using(var con=new NpgsqlConnection(b.ConnectionString)){
     await con.OpenAsync(ct);
     await using var check=new NpgsqlCommand("SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname=@db)",con);
     check.Parameters.AddWithValue("db",database);
     var exists=(bool)(await check.ExecuteScalarAsync(ct)??false);
     if(!exists){
       // DDL CREATE DATABASE no admite parametros, el nombre se construye
       // exclusivamente con constantes del servidor y tenantId numerico.
       await using var create=new NpgsqlCommand($"CREATE DATABASE \"{database}\"",con);
       try{await create.ExecuteNonQueryAsync(ct);}catch(PostgresException ex)when(ex.SqlState=="42P04"){}
     }
   }
   b.Database=database;
   await migrate(b.ConnectionString);
 }
}
