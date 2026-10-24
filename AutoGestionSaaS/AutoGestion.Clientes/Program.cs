
using AutoGestion.Clientes.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options => options.ListenAnyIP(5003));

// CONFIGURACION DE SERVICIOS
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// SWAGGER CON X-TENANT-ID
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("TenantId",
        new OpenApiSecurityScheme
        {
            Name = "X-Tenant-Id",
            Type = SecuritySchemeType.ApiKey,
            In = ParameterLocation.Header,
            Description = "Identificador de autoventa. Ejemplo: 1"
        });

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "TenantId"
                    }
                },
                Array.Empty<string>()
            }
        });
});

// CONTEXTO DEL TENANT
builder.Services.AddScoped<TenantContext>();

// BASE DE DATOS DINAMICA POR TENANT
builder.Services.AddDbContext<ClientesDbContext>((sp, options) =>
{
    var tenant = sp.GetRequiredService<TenantContext>();

    if (tenant.TenantId <= 0)
        throw new InvalidOperationException(
            "No se ha identificado un tenant valido.");

    var catalogo = builder.Configuration
        .GetConnectionString("Catalogo")
        ?? throw new InvalidOperationException(
            "Falta configurar Catalogo.");

    var conexion = new NpgsqlConnectionStringBuilder(catalogo)
    {
        Database = $"autogestion_clientes_{tenant.TenantId}"
    }.ConnectionString;

    options.UseNpgsql(conexion);
});

var app = builder.Build();
app.UseCors();

// SWAGGER
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// MIDDLEWARE DE MULTITENENCIA
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/swagger") ||
        context.Request.Path.StartsWithSegments("/health"))
    {
        await next();
        return;
    }

    if (!long.TryParse(
        context.Request.Headers["X-Tenant-Id"].ToString(),
        out var tenantId) || tenantId <= 0)
    {
        context.Response.StatusCode = 400;
        await context.Response.WriteAsJsonAsync(new
        {
            error = "Debe indicar X-Tenant-Id valido"
        });
        return;
    }

    var catalogo = app.Configuration
        .GetConnectionString("Catalogo")
        ?? throw new InvalidOperationException(
            "Falta configurar Catalogo.");

    await using var conexion = new NpgsqlConnection(catalogo);
    await conexion.OpenAsync(context.RequestAborted);

    await using var comando = new NpgsqlCommand(
        """
        SELECT EXISTS(
            SELECT 1
            FROM public."Tenants"
            WHERE "Id" = @id
              AND "Estado" = 'Activo'
        )
        """,
        conexion);

    comando.Parameters.AddWithValue("id", tenantId);

    var existe = (bool)(
        await comando.ExecuteScalarAsync(context.RequestAborted)
        ?? false);

    if (!existe)
    {
        context.Response.StatusCode = 403;
        await context.Response.WriteAsJsonAsync(new
        {
            error = "Tenant no registrado o inactivo"
        });
        return;
    }

    context.RequestServices
        .GetRequiredService<TenantContext>()
        .TenantId = tenantId;

    await next();
});

// ENDPOINT DE SALUD
app.MapGet("/health", () => Results.Ok(new
{
    status = "ok",
    servicio = "Clientes"
}));

app.MapControllers();
app.Run();

// CONTEXTO DEL TENANT
public sealed class TenantContext
{
    public long TenantId { get; set; }
}
