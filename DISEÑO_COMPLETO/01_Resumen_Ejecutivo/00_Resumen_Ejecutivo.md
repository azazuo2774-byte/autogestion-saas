# Resumen Ejecutivo - AutoGestión SaaS

## 1. ¿Qué es AutoGestión SaaS?

AutoGestión SaaS es una plataforma tecnológica de Software como Servicio (SaaS) diseñada específicamente para la administración de autoventas de vehículos usados en Bolivia. La plataforma centraliza en un solo sistema digital la gestión de inventario de vehículos, clientes, oportunidades comerciales, reservas, ventas y reportes.

**No es una tienda de automóviles que vende sus propios vehículos.** Es una herramienta tecnológica que permite a distintas autoventas administrar independientemente sus negocios mediante una suscripción mensual.

## 2. Problema que Resuelve

### Problema Identificado

Muchas autoventas pequeñas y medianas en Bolivia gestionan sus operaciones utilizando:
- Registros manuales en cuadernos
- Mensajes de WhatsApp dispersos
- Hojas de cálculo no estructuradas
- Procesos informales sin seguimiento

Esto provoca:
- Pérdida de información comercial
- Dificultad para conocer el estado de los vehículos
- Falta de seguimiento a compradores interesados
- Registros comerciales incompletos
- Poca visibilidad del rendimiento del negocio
- Dependencia de la memoria de los dueños

### Solución Propuesta

AutoGestión SaaS ofrece:
- **Centralización**: Toda la información en un solo lugar
- **Organización**: Estructura clara de datos y procesos
- **Accesibilidad**: Información disponible cuando se necesita
- **Seguridad**: Respaldo de datos y control de acceso
- **Escalabilidad**: Crece con el negocio

## 3. Mercado Objetivo

### Ubicación Inicial
- Tarija, Bolivia

### Segmento
- Propietarios y administradores de autoventas pequeñas y medianas
- Negocios que venden vehículos usados
- Empresas que necesitan profesionalizar sus operaciones

### Características del Usuario Objetivo
- Conocimientos tecnológicos limitados a moderados
- Necesidad de organización y control
- Presupuesto accesible (suscripciones mensuales)
- Valoran la simplicidad y eficiencia

## 4. Modelo de Negocio

### Tipo de Negocio
Software como Servicio (SaaS) con modelo de suscripción mensual.

### Planes Comerciales (Referenciales)
- **Básico**: Bs 0/mes - Para autoventas que recién comienzan
- **Emprendedor**: Bs 79/mes - Ideal para autoventas en crecimiento
- **Profesional**: Bs 149/mes - Para negocios consolidados
- **Empresa**: Bs 299/mes - Máxima capacidad con soporte dedicado

**Nota**: Estos precios son referenciales de una etapa de diseño y no representan tarifas definitivas ni cobros reales.

### Propuesta de Valor
- Reducción de dependencia de registros manuales
- Mejor seguimiento comercial
- Visibilidad del negocio
- Organización de inventario
- Gestión profesional de clientes

## 5. Arquitectura Tecnológica

### Enfoque Arquitectónico
- **Multitenencia Silo**: Cada autoventa (tenant) tiene bases de datos independientes
- **Microservicios**: Arquitectura modular con servicios especializados
- **Identificación de Tenant**: Mediante encabezado HTTP `X-Tenant-Id`
- **Comunicación**: APIs REST entre microservicios

### Microservicios
1. **Administrador**: Gestión de tenants, usuarios, planes y suscripciones
2. **Inventario**: Gestión de vehículos
3. **Clientes**: Gestión de clientes y CRM
4. **Ventas**: Gestión de operaciones comerciales

### Tecnologías
- **Frontend**: React, Vite, HTML, CSS, JavaScript
- **Backend**: ASP.NET Core, C#, Entity Framework Core
- **Base de Datos**: PostgreSQL 17
- **Arquitectura**: REST APIs, HttpClient, Gateway YARP (previsto)

## 6. Tipos de Usuario

### 1. Administrador General del SaaS
- Administra la plataforma AutoGestión SaaS
- Supervisa tenants, planes, suscripciones
- Gestiona usuarios y roles del sistema
- No debe confundirse con administrador de autoventa

### 2. Propietario de Autoventa
- Responsable de su empresa
- Administra inventario, clientes, ventas
- Visualiza indicadores del negocio
- Permisos completos dentro de su tenant

### 3. Administrador de Autoventa
- Gestiona operaciones autorizadas
- Permisos configurables según rol
- Pertenece a una autoventa específica

### 4. Vendedor
- Registra clientes
- Consulta vehículos
- Realiza seguimiento comercial
- Participa en reservas y ventas según permisos

### 5. Cliente/Comprador
- Persona interesada en comprar un vehículo
- Sus datos forman parte del CRM
- No tiene acceso al panel interno del SaaS

## 7. Módulos del Sistema

### Módulo A. Administración General
- Panel administrativo general
- Registro de autoventas (tenants)
- Gestión de usuarios, roles y permisos
- Catálogo de planes
- Administración de suscripciones
- Estados de servicio y alertas

### Módulo B. Autenticación y Acceso
- Inicio de sesión
- Recuperación de contraseña
- Cambio de contraseña
- Selección de autoventa (cuando corresponde)
- Verificación de permisos
- Gestión de sesión

### Módulo C. Panel Principal
- Dashboard con KPIs
- Total de vehículos, clientes, ventas
- Actividades recientes
- Alertas de suscripción
- Accesos rápidos

### Módulo D. Inventario de Vehículos
- Listado, registro y edición de vehículos
- Ficha detallada con fotografías
- Búsqueda y filtros
- Estados comerciales
- Historial de cambios

### Módulo E. Clientes y CRM
- Gestión de clientes
- Historial de interés
- Oportunidades de venta
- Seguimiento comercial
- Estados de oportunidad

### Módulo F. Reservas
- Registro de reservas
- Selección de cliente y vehículo
- Gestión de seña
- Estados y vencimientos
- Conversión en venta

### Módulo G. Ventas
- Registro de ventas
- Vinculación con reservas
- Estados de venta
- Historial de operaciones

### Módulo H. Pagos Comerciales
- Registro de pagos
- Método de pago
- Historial
- Resumen por venta

### Módulo I. Planes y Suscripciones
- Catálogo de planes
- Comparación de funcionalidades
- Contratación de prueba
- Gestión de suscripciones
- Consulta de vigencia

### Módulo J. Auditoría y Reportes
- Historial de actividades
- Filtros por fecha
- Estadísticas de vehículos
- Resumen de ventas
- Reportes exportables (funcionalidad prevista)

## 8. Avances Técnicos Realizados

### Backend .NET
- Compilación exitosa de los 4 microservicios
- Configuración de conexiones locales a PostgreSQL
- Ejecución del Administrador con Swagger
- Aplicación de migración administrativa inicial
- Registro de autoventas vía Swagger (HTTP 201)
- Generación de bases de datos con nombres dinámicos
- Verificación en pgAdmin de bases por tenant
- Ejecución de Inventario, Clientes y Ventas
- Configuración de `X-Tenant-Id` en Swagger
- Registro de vehículo Toyota Hilux (HTTP 201)
- Consulta exitosa (HTTP 200)
- Creación de suscripción activa
- Consulta de vigencia correcta

### Frontend React
- Estructura de proyecto con Vite
- Páginas implementadas: Dashboard, Login, Inventario, Clientes, Reservas, Ventas, Pagos, Planes, Auditoría, Perfil
- Sistema de navegación y contexto
- Datos de demostración
- Componentes de UI (Sidebar, Topbar)
- Estilos CSS personalizados

## 9. Diferenciación: Diseñado vs Implementado

### Implementado (Backend .NET)
- Arquitectura Silo funcional
- 4 microservicios ejecutándose
- Generación dinámica de bases por tenant
- APIs REST básicas
- Validación de vigencia de suscripción
- Registro de vehículos, clientes, ventas

### Diseñado (Este Documento)
- Pantallas y flujos completos de usuario
- Diagramas de arquitectura y UML
- Historias de usuario y casos de uso
- Wireframes de baja y alta fidelidad
- Recorridos de usuario detallados
- Documentación técnica integral
- Plan de MVP vs producto completo

### Funcionalidades Futuras (No Implementadas)
- Autenticación JWT real
- Pasarela de pagos
- Reportes avanzados exportables
- Gateway YARP
- Verificación interservicio de tenant
- Transacciones distribuidas
- Observabilidad

## 10. Contexto de Desarrollo

### Investigación Realizada
- Identificación del problema y necesidades del cliente
- Segmentación del mercado objetivo
- Propuesta de valor
- Modelo de negocio SaaS
- Business Model Canvas
- Mapa de empatía
- Definición del producto mínimo viable
- Diseño inicial de cinco wireframes
- Landing page de presentación
- Formulario de interés para usuarios beta
- Validación inicial del concepto
- Análisis de feedback de potenciales usuarios

**Nota**: No se inventan cifras de encuestas, entrevistas, porcentajes de aceptación ni resultados de validación. Las decisiones de diseño se fundamentan en necesidades identificadas.

## 11. Calidad del Diseño

### Principios de Diseño
- **Coherencia visual**: Todos los módulos mantienen consistencia
- **Interfaz en español**: Adaptado al contexto boliviano
- **Moneda**: Boliviano (Bs)
- **Contexto local**: Ejemplos de Tarija, Bolivia
- **Datos demostrativos**: Identificados como ficticios
- **Navegación conectada**: Sin pantallas inconexas
- **Funcionalidad clara**: Sin elementos visuales sin propósito
- **Validaciones**: Cada formulario tiene validación
- **Búsqueda y filtros**: Tablas con capacidades de filtrado
- **Datos reales**: Indicadores no presentan cifras inventadas como datos reales
- **Separación de roles**: Administrador SaaS vs administrador de autoventa
- **Arquitectura Silo**: Bases independientes por tenant
- **Nombres coherentes**: Microservicios coinciden con bases
- **Diferenciación clara**: Funcionalidades futuras vs implementadas
- **Responsive**: Diseño adaptable a dispositivos móviles
- **Archivos editables**: Entregados cuando la herramienta lo permite

## 12. Próximos Pasos

Este diseño integral proporciona:
- Documentación completa del proyecto
- Diagramas técnicos editables (PlantUML)
- Wireframes de todos los módulos
- Especificaciones de implementación
- Guía para desarrollo posterior
- Base académica para presentación

El resultado tiene la calidad visual de una plataforma comercial real y la claridad técnica de un proyecto universitario de Ingeniería de Sistemas.
