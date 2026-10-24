# Identidad Visual - AutoGestión SaaS

## 1. Paleta de Colores

### Colores Principales

| Color | Hex | RGB | Uso |
|-------|-----|-----|-----|
| **Azul Oscuro** | `#0f172a` | 15, 23, 42 | Encabezados, textos principales, sidebar |
| **Azul Eléctrico** | `#1d6aff` | 29, 106, 255 | Botones primarios, enlaces, acentos |
| **Blanco** | `#ffffff` | 255, 255, 255 | Fondo principal, tarjetas |
| **Gris Muy Claro** | `#f8fafc` | 248, 250, 252 | Fondo secundario, secciones |

### Colores de Estado

| Color | Hex | RGB | Uso |
|-------|-----|-----|-----|
| **Verde (Éxito)** | `#16a34a` | 22, 163, 74 | Estados positivos, ventas completadas |
| **Ámbar/Naranja (Advertencia)** | `#d97706` | 217, 119, 6 | Reservas, alertas, vencimientos |
| **Rojo (Error)** | `#dc2626` | 220, 38, 38 | Errores, estados negativos, cancelaciones |
| **Azul Claro (Info)** | `#0891b2` | 8, 145, 178 | Información general, notificaciones |

### Colores de Acento

| Color | Hex | RGB | Uso |
|-------|-----|-----|-----|
| **Púrpura** | `#7c3aed` | 124, 58, 237 | Clientes, CRM |
| **Gris Medio** | `#64748b` | 100, 116, 139 | Textos secundarios, bordes |
| **Gris Claro** | `#e2e8f0` | 226, 232, 240 | Bordes, separadores |

## 2. Tipografía

### Fuente Principal
- **Nombre**: Inter (o fuente del sistema similar)
- **Estilo**: Moderna, limpia, sans-serif
- **Características**: Alta legibilidad, optimizada para interfaces

### Escala Tipográfica

| Tamaño | Uso | Peso |
|--------|-----|------|
| 32px / 2rem | Títulos de página | 700 (Bold) |
| 24px / 1.5rem | Títulos de sección | 600 (Semi-bold) |
| 18px / 1.125rem | Subtítulos, KPIs | 600 (Semi-bold) |
| 16px / 1rem | Texto de cuerpo | 400 (Regular) |
| 14px / 0.875rem | Texto secundario | 400 (Regular) |
| 13px / 0.8125rem | Etiquetas, hints | 400 (Regular) |
| 12px / 0.75rem | Textos pequeños | 400 (Regular) |

### Line Height
- Títulos: 1.2
- Texto de cuerpo: 1.5
- Textos pequeños: 1.4

## 3. Iconografía

### Estilo
- **Tipo**: Iconos uniformes y sencillos
- **Línea**: Contorno limpio
- **Tamaño**: 16px, 20px, 24px
- **Fuente**: Lucide Icons (o similar)

### Iconos por Módulo

| Módulo | Iconos Principales |
|--------|-------------------|
| **Dashboard** | 📊, 📈, 🏠, ⚡ |
| **Inventario** | 🚗, 🚙, 🚛, 📦, 🔍 |
| **Clientes** | 👤, 👥, 📞, ✉️ |
| **Ventas** | 💰, 🏁, 📋, 💳 |
| **Reservas** | 📋, ⏰, 📝 |
| **Planes** | ⭐, 💎, 🏆, 📑 |
| **Administración** | 🛡️, ⚙️, 🔐, 👑 |
| **Auditoría** | 📜, 🕐, 📝, 🔍 |

## 4. Componentes UI

### 4.1 Botones

#### Botón Primario
- **Color de fondo**: `#1d6aff` (Azul Eléctrico)
- **Color de texto**: `#ffffff` (Blanco)
- **Border radius**: 8px
- **Padding**: 12px 20px
- **Hover**: `#1557e0` (más oscuro)
- **Estado activo**: `#0d4cc0`

#### Botón Secundario
- **Color de fondo**: `#f1f5f9` (Gris muy claro)
- **Color de texto**: `#0f172a` (Azul oscuro)
- **Border radius**: 8px
- **Padding**: 12px 20px
- **Hover**: `#e2e8f0`

#### Botón Fantasma (Ghost)
- **Color de fondo**: Transparente
- **Color de texto**: `#64748b` (Gris medio)
- **Border radius**: 8px
- **Padding**: 8px 16px
- **Hover**: `#f1f5f9`

### 4.2 Tarjetas

#### Tarjeta Estándar
- **Color de fondo**: `#ffffff` (Blanco)
- **Border**: 1px solid `#e2e8f0`
- **Border radius**: 12px
- **Padding**: 20px
- **Sombra**: `0 1px 3px rgba(0,0,0,0.05)`
- **Hover**: Sombra aumentada `0 4px 6px rgba(0,0,0,0.08)`

#### Tarjeta KPI
- **Color de fondo**: `#ffffff`
- **Border radius**: 12px
- **Padding**: 16px
- **Icono**: 44x44px con fondo de color suave

### 4.3 Formularios

#### Input de Texto
- **Color de fondo**: `#ffffff`
- **Border**: 1px solid `#e2e8f0`
- **Border radius**: 8px
- **Padding**: 10px 12px
- **Focus**: Border `#1d6aff`, outline 2px `#1d6aff20`
- **Error**: Border `#dc2626`

#### Etiqueta (Label)
- **Color**: `#475569` (Gris oscuro)
- **Tamaño**: 13px
- **Peso**: 500 (Medium)
- **Margen inferior**: 6px

#### Hint de Ayuda
- **Color**: `#94a3b8` (Gris claro)
- **Tamaño**: 12px
- **Margen superior**: 4px

### 4.4 Tablas

#### Tabla Estándar
- **Color de fondo**: `#ffffff`
- **Border**: 1px solid `#e2e8f0`
- **Border radius**: 8px
- **Header**: Fondo `#f8fafc`, texto `#475569`, peso 600
- **Row hover**: Fondo `#f8fafc`
- **Padding celdas**: 12px 16px

### 4.5 Badges (Etiquetas de Estado)

| Estado | Color de Fondo | Color de Texto |
|--------|----------------|----------------|
| **Disponible** | `#dcfce7` | `#16a34a` |
| **Reservado** | `#fef3c7` | `#d97706` |
| **Vendido** | `#e0f2fe` | `#0891b2` |
| **Activo** | `#dcfce7` | `#16a34a` |
| **Inactivo** | `#f1f5f9` | `#64748b` |
| **Suspendido** | `#fee2e2` | `#dc2626` |
| **Pendiente** | `#fef3c7` | `#d97706` |

### 4.6 Alertas

#### Alerta de Éxito
- **Fondo**: `#dcfce7`
- **Texto**: `#16a34a`
- **Icono**: ✓

#### Alerta de Advertencia
- **Fondo**: `#fef3c7`
- **Texto**: `#d97706`
- **Icono**: ⚠

#### Alerta de Error
- **Fondo**: `#fee2e2`
- **Texto**: `#dc2626`
- **Icono**: ⚠

### 4.7 Sidebar (Menú Lateral)

#### Sidebar Escritorio
- **Ancho**: 260px (expandido), 64px (colapsado)
- **Color de fondo**: `#0f172a` (Azul oscuro)
- **Color de texto**: `#94a3b8`
- **Item activo**: Fondo `#1d6aff20`, texto `#1d6aff`
- **Item hover**: Fondo `#ffffff10`
- **Transición**: 200ms

#### Sidebar Móvil
- **Comportamiento**: Drawer desde la izquierda
- **Ancho**: 280px
- **Overlay**: Fondo semitransparente

### 4.8 Topbar (Barra Superior)

#### Topbar Estándar
- **Altura**: 64px
- **Color de fondo**: `#ffffff`
- **Border inferior**: 1px solid `#e2e8f0`
- **Elementos**: Título de página, notificaciones, perfil de usuario

## 5. Espaciado

### Escala de Espaciado
- **4px**: Espaciado muy pequeño
- **8px**: Espaciado pequeño
- **12px**: Espaciado regular
- **16px**: Espaciado medio
- **20px**: Espaciado grande
- **24px**: Espaciado muy grande
- **32px**: Espaciado extra grande
- **48px**: Espaciado de sección

### Uso Típico
- **Entre elementos de formulario**: 12px
- **Entre tarjetas**: 20px
- **Entre secciones**: 32px
- **Padding de tarjeta**: 20px
- **Padding de sección**: 24px

## 6. Sombras

### Escala de Sombras

| Nombre | Sombra | Uso |
|--------|--------|-----|
| **sm** | `0 1px 2px rgba(0,0,0,0.05)` | Elementos sutiles |
| **md** | `0 4px 6px rgba(0,0,0,0.08)` | Tarjetas estándar |
| **lg** | `0 10px 15px rgba(0,0,0,0.1)` | Modales, dropdowns |
| **xl** | `0 20px 25px rgba(0,0,0,0.12)` | Elementos elevados |

## 7. Bordes

### Border Radius
- **Pequeño**: 4px (botones pequeños, badges)
- **Medio**: 8px (inputs, botones estándar)
- **Grande**: 12px (tarjetas, modales)
- **Extra grande**: 16px (elementos destacados)

### Grosores de Borde
- **Fino**: 1px (bordes estándar)
- **Medio**: 2px (focus states)

## 8. Estados Interactivos

### Hover
- **Botones**: Cambio de color, transformación sutil
- **Tarjetas**: Sombra aumentada
- **Filas de tabla**: Fondo cambiado
- **Links**: Color cambiado, subrayado

### Focus
- **Inputs**: Border de color primario, outline
- **Botones**: Outline de color primario
- **Accesibilidad**: Siempre visible para navegación por teclado

### Active
- **Botones**: Presión visual (transformación scale 0.98)
- **Links**: Color más oscuro

### Disabled
- **Botones**: Opacidad 0.5, cursor no permitido
- **Inputs**: Fondo gris claro, cursor no permitido

## 9. Responsive Design

### Breakpoints

| Dispositivo | Ancho | Comportamiento |
|-------------|-------|---------------|
| **Móvil** | < 640px | Sidebar colapsado, tabla scrollable |
| **Tablet** | 640px - 1024px | Sidebar colapsable, grid adaptativo |
| **Escritorio** | > 1024px | Sidebar expandido, layout completo |

### Adaptaciones Móviles
- **Sidebar**: Menú hamburguesa, drawer
- **Tablas**: Scroll horizontal, cards en móvil
- **Grid**: 1 columna en móvil, 2 en tablet, 3+ en escritorio
- **KPIs**: 2 columnas en móvil, 3 en tablet, 6 en escritorio
- **Formularios**: Inputs full width en móvil

## 10. Animaciones

### Duraciones
- **Rápida**: 150ms (hover states)
- **Media**: 200ms (transiciones estándar)
- **Lenta**: 300ms (modales, drawers)

### Tipos de Animación
- **Fade in**: Opacidad 0 → 1
- **Slide in**: Transformación desde fuera
- **Scale**: Escala 0.95 → 1
- **Easing**: ease-out (suave)

### Uso
- **Carga de página**: Fade in
- **Modal**: Scale + fade
- **Sidebar**: Slide
- **Hover**: Transformación sutil

## 11. Accesibilidad

### Contraste de Color
- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Componentes interactivos**: Mínimo 3:1

### Navegación por Teclado
- **Tab order**: Lógico y predecible
- **Focus visible**: Siempre visible
- **Shortcuts**: No implementados en MVP

### Screen Readers
- **ARIA labels**: En componentes interactivos
- **Alt text**: En imágenes
- **Semantic HTML**: Uso correcto de etiquetas

## 12. Dark Mode (Futuro)

### Propuesta
- **Fondo principal**: `#0f172a` → `#1e293b`
- **Fondo secundario**: `#f8fafc` → `#334155`
- **Texto principal**: `#0f172a` → `#f1f5f9`
- **Texto secundario**: `#64748b` → `#94a3b8`
- **Tarjetas**: `#ffffff` → `#1e293b`

**Nota**: Dark mode no está implementado en el MVP, pero se propone como mejora futura.

## 13. Branding

### Logo
- **Icono**: 🚀 (cohete)
- **Texto**: AutoGestión SaaS
- **Color**: Azul eléctrico
- **Uso**: Header de login, sidebar expandido

### Favicon
- **Icono simplificado**: 🚗
- **Color**: Azul oscuro

### Marca de Agua
- **Texto**: "AutoGestión SaaS"
- **Opacidad**: 10%
- **Ubicación**: Esquina inferior derecha (solo en versión demo)

## 14. Justificación de Decisiones de Diseño

### ¿Por qué Azul?
- **Profesionalismo**: El azul transmite confianza y tecnología
- **Legibilidad**: Alto contraste con blanco
- **Adopción**: Color ampliamente aceptado en software empresarial

### ¿Por qué Inter?
- **Legibilidad**: Optimizada para interfaces digitales
- **Neutralidad**: No distrae del contenido
- **Disponibilidad**: Fuente del sistema, no requiere carga externa

### ¿Por qué Tarjetas con Borde Redondeado?
- **Modernidad**: Estilo contemporáneo
- **Jerarquía**: Agrupación visual clara
- **Usabilidad**: Bordes suaves son más amigables

### ¿Por qué Sidebar Fijo?
- **Eficiencia**: Navegación siempre accesible
- **Escalabilidad**: Permite agregar módulos fácilmente
- **Familiaridad**: Patrón común en aplicaciones SaaS

## 15. Componentes Específicos por Módulo

### Dashboard
- **KPI Cards**: Con iconos y tendencias
- **Activity Feed**: Lista con avatares y timestamps
- **Quick Actions**: Grid de botones con iconos

### Inventario
- **Vehicle Card**: Imagen principal + datos clave
- **Status Badge**: Colores por estado comercial
- **Filter Bar**: Búsqueda + filtros desplegables

### Clientes
- **Client Avatar**: Iniciales con color
- **Opportunity Badge**: Número de oportunidades
- **Last Contact**: Timestamp relativo

### Ventas
- **Sale Summary**: Monto destacado
- **Payment Badge**: Método de pago
- **Conversion Rate**: Indicador de éxito

### Planes
- **Plan Card**: Destacado para plan recomendado
- **Feature List**: Checkmarks para características
- **CTA Button**: Prominente

## 16. Sistema de Diseño

### Tokens de Diseño (Propuesto)

```css
:root {
  /* Colores */
  --color-primary: #1d6aff;
  --color-primary-dark: #1557e0;
  --color-primary-light: #1d6aff20;
  --color-success: #16a34a;
  --color-success-light: #dcfce7;
  --color-warning: #d97706;
  --color-warning-light: #fef3c7;
  --color-error: #dc2626;
  --color-error-light: #fee2e2;
  
  /* Tipografía */
  --font-family: 'Inter', system-ui, sans-serif;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;
  
  /* Espaciado */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Bordes */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.08);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

## 17. Validación de Diseño

### Checklist de Calidad
- ✅ Coherencia visual entre módulos
- ✅ Interfaz en español
- ✅ Moneda en bolivianos (Bs)
- ✅ Contexto boliviano (Tarija)
- ✅ Datos demostrativos identificados
- ✅ Navegación conectada
- ✅ Funcionalidad clara en cada elemento
- ✅ Validaciones en formularios
- ✅ Búsqueda y filtros en tablas
- ✅ Indicadores sin cifras inventadas como reales
- ✅ Separación de roles clara
- ✅ Arquitectura Silo reflejada
- ✅ Nombres coherentes
- ✅ Diferenciación de funcionalidades
- ✅ Responsive design
- ✅ Archivos editables

## 18. Evolución del Diseño

### Versión Actual
- Diseño limpio y profesional
- Enfoque en funcionalidad
- Prioridad de legibilidad

### Mejoras Futuras
- Dark mode
- Temas personalizables
- Animaciones más elaboradas
- Componentes más complejos
- Micro-interacciones
- Personalización por tenant
