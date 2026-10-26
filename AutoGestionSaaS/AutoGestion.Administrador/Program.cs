using AutoGestion.Administrador.Data;
using AutoGestion.Administrador.Services;
using Microsoft.EntityFrameworkCore;
var builder=WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options => options.ListenAnyIP(5001));
var connection=builder.Configuration.GetConnectionString("Catalogo")??throw new InvalidOperationException("Configure ConnectionStrings:Catalogo");
builder.Services.AddDbContext<AdminDbContext>(o=>o.UseNpgsql(connection));
builder.Services.AddScoped<TenantProvisioner>();
builder.Services.AddControllers();builder.Services.AddEndpointsApiExplorer();builder.Services.AddSwaggerGen();
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});
builder.Services.AddHostedService<SuscripcionVencidaWorker>();
var app=builder.Build();
app.UseCors();
// La base 'autogestion_administrador' debe crearse manualmente una sola vez.
using(var scope=app.Services.CreateScope()){
 var db=scope.ServiceProvider.GetRequiredService<AdminDbContext>();
 await db.Database.MigrateAsync();
}
app.UseSwagger();app.UseSwaggerUI();app.MapControllers();app.MapGet("/health",()=>Results.Ok(new{status="ok",servicio="Administrador"}));app.Run();
