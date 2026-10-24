
using AutoGestion.Inventario.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options => options.ListenAnyIP(5002));

// ==========================================
// SERVICIOS
// ==========================================

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// Configurar Swagger con X-Tenant-Id
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("TenantId", new OpenApiSecurityScheme
    {
        Name = "X-Tenant-Id",
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Header,
        Description = "Identificador de la autoventa (tenant). Ejemplo: 1"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
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

// Contexto de la autoventa actual
builder.Services.AddScoped<TenantContext>();

// Conexion dinamica por tenant
builder.Services.AddDbContext<InventarioDbContext>((sp, options) =>
{
    var tenant = sp.GetRequiredService<TenantContext>();

    if (tenant.TenantId <= 0)
    {
        throw new InvalidOperationException(
            "No se ha identificado una autoventa valida."
        );
    }

    var catalogo = builder.Configuration
        .GetConnectionString("Catalogo")
        ?? throw new InvalidOperationException(
            "Falta configurar la conexion Catalogo."
        );

    var conexion = new NpgsqlConnectionStringBuilder(catalogo)
    {
        Database = $"autogestion_inventario_{tenant.TenantId}"
    }.ConnectionString;

    options.UseNpgsql(conexion);
});

var app = builder.Build();
app.UseCors();

// ==========================================
// SWAGGER
// ==========================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ==========================================
// MIDDLEWARE DE MULTITENENCIA
// ==========================================

app.Use(async (context, next) =>
{
    var ruta = context.Request.Path;

    // Permitir Swagger y health sin X-Tenant-Id
    if (ruta.StartsWithSegments("/swagger") ||
        ruta.StartsWithSegments("/health"))
    {
        await next();
        return;
    }

    // Validar encabezado del tenant
    if (!long.TryParse(
            context.Request.Headers["X-Tenant-Id"].ToString(),
            out var tenantId
        ) || tenantId <= 0)
    {
        context.Response.StatusCode = 400;

        await context.Response.WriteAsJsonAsync(new
        {
            error = "Debe indicar X-Tenant-Id valido"
        });

        return;
    }

    // Consultar si existe y esta activo
    var catalogo = app.Configuration
        .GetConnectionString("Catalogo")
        ?? throw new InvalidOperationException(
            "Falta configurar Catalogo."
        );

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
        conexion
    );

    comando.Parameters.AddWithValue("id", tenantId);

    var existe = (bool)(
        await comando.ExecuteScalarAsync(context.RequestAborted)
        ?? false
    );

    if (!existe)
    {
        context.Response.StatusCode = 403;

        await context.Response.WriteAsJsonAsync(new
        {
            error = "Tenant no registrado o inactivo"
        });

        return;
    }

    // Asignar tenant a la solicitud actual
    context.RequestServices
        .GetRequiredService<TenantContext>()
        .TenantId = tenantId;

    await next();
});

// ==========================================
// ENDPOINTS
// ==========================================

app.MapGet("/health", () => Results.Ok(new
{
    status = "ok",
    servicio = "Inventario"
}));

app.MapControllers();

app.Run();

// ==========================================
// CONTEXTO TENANT
// ==========================================

public sealed class TenantContext
{
    public long TenantId { get; set; }
}
