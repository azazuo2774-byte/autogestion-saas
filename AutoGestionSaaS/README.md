# AutoGestión SaaS — Tarea de multitenencia Silo

## Alcance y aviso importante
Solución autónoma basada en la consigna del curso. **No se ha integrado con el proyecto de ejemplo del docente**, ya que no fue proporcionado. La ejecución no se ha podido verificar en este entorno (no dispone del SDK .NET). Requiere prueba local antes de entregar.

### Requisitos
.NET SDK 8, PostgreSQL 17 con permiso `CREATEDB`, Visual Studio o VS Code; puerto 5432 y puertos HTTP 5100-5103 libres.

### Preparación
1. Conectar pgAdmin a `postgres`; crear `autogestion_administrador` usando `sql/00_crear_administrador.sql` (si ya existe, omitir).
2. Cambiar credenciales de ejemplo **localmente**, preferiblemente con variables `ConnectionStrings__Catalogo` o `dotnet user-secrets` para cada API. No subir contraseñas reales.
3. En terminal, en este directorio, ejecutar:
```
dotnet restore AutoGestionSaaS.sln
dotnet build AutoGestionSaaS.sln
```
4. Abrir cuatro terminales y ejecutar:
```
dotnet run --project AutoGestion.Administrador --launch-profile http
dotnet run --project AutoGestion.Inventario --launch-profile http
dotnet run --project AutoGestion.Clientes --launch-profile http
dotnet run --project AutoGestion.Ventas --launch-profile http
```
5. Entrar a `/swagger` en 5100, 5101, 5102 y 5103. Ejecutar `scripts/ejemplos_http.http` por pasos y conservar capturas reales.
6. SQL de verificación: `sql/01_comprobar_bases.sql`. Para IDs 1 y 2 espera tres bases por tenant; los IDs reales dependen de PostgreSQL.

### Arquitectura
- Administrador / `autogestion_administrador`: tenants, usuarios, planes, suscripciones.
- Inventario / `autogestion_inventario_<tenantId>`: vehículos.
- Clientes / `autogestion_clientes_<tenantId>`: clientes.
- Ventas / `autogestion_ventas_<tenantId>`: ventas.
- Cada petición a un servicio usa `X-Tenant-Id`; se consulta catálogo y se resuelve base por tenant.
- No existen FK entre bases/microservicios. Ventas almacena `ClienteId` y `VehiculoId` como referencias lógicas.

### Creación sin falsas confirmaciones
Se guarda tenant `Pendiente`, se crean (o reutilizan) las tres bases y se ejecutan sus migraciones. Solo si todas tienen éxito, el tenant pasa a `Activo` y se crea su usuario. Fallos: `Fallido` y HTTP 503; se puede reintentar con `/api/registro/reintentar-tenant/{id}`. No se eliminan bases existentes. Si una base se crea antes de fallar otra, queda disponible para un reintento posterior. El bloqueo del ejemplo es local al proceso; para varios administradores simultáneos se recomienda bloqueo distribuido PostgreSQL.

### Vigencia UTC
`Activa` si Estado `Habilitada`, InicioUtc <= ahora UTC < VencimientoUtc. De lo contrario, si existe registro se muestra `Vencida`; sin registros `Inexistente`. Pendientes futuros y canceladas se muestran como `Vencida` en la salida simplificada de la tarea.

### Limitaciones para producción
No incluye login/JWT ni autorización por usuario, solo comprobación de existencia/estado del tenant por encabezado. No usar en Internet; `X-Tenant-Id` sin autenticar es falsificable. Falta verificación interservicio de que `ClienteId` y `VehiculoId` pertenezcan al mismo tenant, transacciones distribuidas, observabilidad y endurecimiento de concurrencia de suscripciones. La consigna no exige pasarela de pagos.
