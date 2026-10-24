@echo off
chcp 65001 > nul
title AutoGestión SaaS - Iniciador del Sistema Completo

echo ========================================================
echo         INICIANDO AUTOGESTIÓN SAAS (SISTEMA COMPLETO)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/6] Verificando PostgreSQL...
sc query postgresql-x64-17 | find "RUNNING" > nul
if %errorlevel% neq 0 (
    echo [AVISO] Iniciando servicio PostgreSQL...
    net start postgresql-x64-17 > nul 2>&1
)
echo      - PostgreSQL activo.

echo [2/6] Iniciando Microservicio Administrador (Puerto 5001)...
start "AutoGestion.Administrador [5001]" cmd /k "dotnet run --project AutoGestionSaaS\AutoGestion.Administrador\AutoGestion.Administrador.csproj"

timeout /t 3 /nobreak > nul

echo [3/6] Iniciando Microservicios de Negocio (Puertos 5002, 5003, 5004)...
start "AutoGestion.Inventario [5002]" cmd /k "dotnet run --project AutoGestionSaaS\AutoGestion.Inventario\AutoGestion.Inventario.csproj"
start "AutoGestion.Clientes [5003]" cmd /k "dotnet run --project AutoGestionSaaS\AutoGestion.Clientes\AutoGestion.Clientes.csproj"
start "AutoGestion.Ventas [5004]" cmd /k "dotnet run --project AutoGestionSaaS\AutoGestion.Ventas\AutoGestion.Ventas.csproj"

timeout /t 3 /nobreak > nul

echo [4/6] Iniciando Gateway Reverse Proxy (Puerto 5000)...
start "AutoGestion.Gateway [5000]" cmd /k "dotnet run --project AutoGestionSaaS\AutoGestion.Gateway\AutoGestion.Gateway.csproj"

timeout /t 2 /nobreak > nul

echo [5/6] Iniciando Frontend React + Vite (Puerto 5173)...
start "AutoGestion UI [5173]" cmd /k "cd autogestion-saas-ui && npm run dev"

timeout /t 4 /nobreak > nul

echo [6/6] Abriendo aplicación en tu navegador...
start http://localhost:5173/

echo.
echo ========================================================
echo   ¡TODO EL SISTEMA ESTÁ CORRIENDO CORRECTAMENTE!
echo.
echo   - Frontend:      http://localhost:5173/
echo   - Gateway:       http://localhost:5000/
echo   - Administrador: http://localhost:5001/swagger
echo   - Inventario:    http://localhost:5002/swagger
echo   - Clientes:      http://localhost:5003/swagger
echo   - Ventas:        http://localhost:5004/swagger
echo ========================================================
echo.
pause
