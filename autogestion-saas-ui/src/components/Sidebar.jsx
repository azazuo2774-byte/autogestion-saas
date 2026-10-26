import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RUTAS } from '../data/demo';

const NAV_AUTOVENTA = [
  {
    section: 'Principal',
    items: [
      { label: 'Panel Principal', icon: '📊', route: RUTAS.DASHBOARD },
    ],
  },
  {
    section: 'Negocio',
    items: [
      { label: 'Inventario', icon: '🚗', route: RUTAS.INVENTARIO },
      { label: 'Clientes', icon: '👥', route: RUTAS.CLIENTES },
      { label: 'Reservas', icon: '📋', route: RUTAS.RESERVAS },
      { label: 'Ventas', icon: '💰', route: RUTAS.VENTAS },
      { label: 'Pagos', icon: '💳', route: RUTAS.PAGOS },
    ],
  },
  {
    section: 'Configuración',
    items: [
      { label: 'Mi Suscripción', icon: '⭐', route: RUTAS.SUSCRIPCIONES },
      { label: 'Planes', icon: '📦', route: RUTAS.PLANES },
      { label: 'Auditoría', icon: '📈', route: RUTAS.AUDITORIA },
      { label: 'Mi Perfil', icon: '👤', route: RUTAS.PERFIL },
    ],
  },
];

const NAV_ADMIN = [
  {
    section: 'Administración',
    items: [
      { label: 'Panel Admin', icon: '🛡️', route: RUTAS.ADMIN_DASHBOARD },
      { label: 'Tenants', icon: '🏢', route: RUTAS.ADMIN_TENANTS },
      { label: 'Planes', icon: '📦', route: RUTAS.ADMIN_PLANES },
      { label: 'Suscripciones', icon: '⭐', route: RUTAS.ADMIN_SUSCRIPCIONES },
    ],
  },
];

export default function Sidebar({ isAdminPanel }) {
  const { currentRoute, navigate, tenant, user, sidebarCollapsed, mobileSidebarOpen, closeMobileSidebar, logout } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = isAdminPanel ? NAV_ADMIN : NAV_AUTOVENTA;

  return (
    <aside className={`app-sidebar${sidebarCollapsed ? ' collapsed' : ''}${mobileSidebarOpen ? ' mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🚀</div>
        {!sidebarCollapsed && (
          <div className="sidebar-logo-text">
            <h1>AutoGestión</h1>
            <span>SaaS Platform</span>
          </div>
        )}
      </div>

      {/* Tenant badge */}
      {!isAdminPanel && tenant && !sidebarCollapsed && (
        <div className="sidebar-tenant-badge">
          <div className="badge-dot" />
          <div className="badge-text">
            <strong>{tenant.nombre}</strong>
            <small>Tenant #{tenant.id} · {tenant.plan}</small>
          </div>
        </div>
      )}

      {isAdminPanel && !sidebarCollapsed && (
        <div className="sidebar-tenant-badge" style={{ borderColor: 'rgba(29,106,255,0.25)' }}>
          <div className="badge-dot" style={{ background: '#1d6aff', boxShadow: '0 0 6px #1d6aff' }} />
          <div className="badge-text">
            <strong>Panel Admin SaaS</strong>
            <small>Administración general</small>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section} className="nav-section">
            {!sidebarCollapsed && (
              <div className="nav-section-label">{section.section}</div>
            )}
            {section.items.map((item) => (
              <div
                key={item.route}
                className={`nav-item${currentRoute === item.route ? ' active' : ''}`}
                onClick={() => {
                  navigate(item.route);
                  closeMobileSidebar();
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                {!sidebarCollapsed && item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="sidebar-footer">
        {showLogoutConfirm && !sidebarCollapsed ? (
          <div style={{ padding: '8px', background: 'rgba(220,38,38,0.1)', borderRadius: '8px', marginBottom: '8px' }}>
            <p style={{ color: '#fca5a5', fontSize: '12px', marginBottom: '8px' }}>¿Cerrar sesión?</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={logout}
                style={{ flex: 1, padding: '4px', background: '#dc2626', color: 'white', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', border: 'none' }}
              >
                Salir
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1, padding: '4px', background: 'rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', border: 'none' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : null}

        <div className="sidebar-user" onClick={() => sidebarCollapsed ? logout() : setShowLogoutConfirm(v => !v)}>
          <div className="user-avatar">{user?.initials || '?'}</div>
          {!sidebarCollapsed && (
            <div className="user-info">
              <strong>{user?.nombre}</strong>
              <span>{user?.rol}</span>
            </div>
          )}
          {!sidebarCollapsed && (
            <span style={{ color: '#475569', fontSize: '14px', marginLeft: 'auto' }}>⏏</span>
          )}
        </div>
      </div>
    </aside>
  );
}
