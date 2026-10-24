var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options => options.ListenAnyIP(5000));

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();

app.MapReverseProxy();

app.MapGet("/", () => "AutoGestión SaaS Gateway - Operativo");

app.Run();
