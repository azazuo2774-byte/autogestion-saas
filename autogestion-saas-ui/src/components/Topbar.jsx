import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RUTAS } from '../data/demo';

const PAGE_NAMES = {
  [RUTAS.DASHBOARD]: 'Panel Principal',
  [RUTAS.INVENTARIO]: 'Inventario',
  [RUTAS.VEHICULO_NUEVO]: 'Nuevo Vehículo',
  [RUTAS.VEHICULO_DETALLE]: 'Detalle de Vehículo',
  [RUTAS.CLIENTES]: 'Clientes',
  [RUTAS.CLIENTE_DETALLE]: 'Perfil de Cliente',
  [RUTAS.RESERVAS]: 'Reservas',
  [RUTAS.VENTAS]: 'Ventas',
  [RUTAS.PAGOS]: 'Pagos',
  [RUTAS.PLANES]: 'Planes',
  [RUTAS.SUSCRIPCIONES]: 'Mi Suscripción',
  [RUTAS.AUDITORIA]: 'Auditoría y Reportes',
  [RUTAS.PERFIL]: 'Mi Perfil',
  [RUTAS.ADMIN_DASHBOARD]: 'Panel Administrador',
  [RUTAS.ADMIN_TENANTS]: 'Gestión de Tenants',
  [RUTAS.ADMIN_PLANES]: 'Administrar Planes',
  [RUTAS.ADMIN_SUSCRIPCIONES]: 'Administrar Suscripciones',
};

export default function Topbar({ isAdminPanel }) {
  const { currentRoute, toggleSidebar, navigate, user, tenant, notifications, markNotifRead, logout } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pageName = PAGE_NAMES[currentRoute] || '';
  const unread = notifications.filter(n => !n.leida).length;

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button className="toggle-sidebar-btn" onClick={toggleSidebar} title="Colapsar menú">
          ☰
        </button>
        <div>
          <div className="topbar-title">{pageName}</div>
          {tenant && (
            <div className="topbar-breadcrumb">
              <span>{tenant.nombre}</span>
              <span className="sep">›</span>
              <span className="current">{pageName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="topbar-right">
        {/* Notificaciones */}
        <div style={{ position: 'relative' }}>
          <button
            className="topbar-btn"
            onClick={() => { setShowNotif(v => !v); setShowUserMenu(false); }}
            title="Notificaciones"
          >
            🔔
            {unread > 0 && <span className="notif-dot" />}
          </button>
          {showNotif && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              width: 320,
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              border: '1px solid #e2e8f0',
              zIndex: 300,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px' }}>Notificaciones</strong>
                {unread > 0 && (
                  <button
                    onClick={() => notifications.forEach(n => markNotifRead(n.id))}
                    style={{ fontSize: '12px', color: '#1d6aff', cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    Marcar leídas
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                  Sin notificaciones
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotifRead(n.id)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f8fafc',
                      background: n.leida ? 'white' : '#f0f6ff',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>
                      {n.tipo === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <div>
                      <p style={{ fontSize: '13px', color: '#334155' }}>{n.msg}</p>
                      {!n.leida && (
                        <span style={{ fontSize: '11px', color: '#1d6aff', fontWeight: 600 }}>Nuevo</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Acceso rápido a inventario */}
        <button
          className="topbar-btn"
          onClick={() => navigate(RUTAS.INVENTARIO)}
          title="Ir a Inventario"
        >
          🚗
        </button>

        {/* Menú de usuario */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-avatar"
            style={{ cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #2256a8, #1d6aff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px' }}
            onClick={() => { setShowUserMenu(v => !v); setShowNotif(false); }}
          >
            {user?.initials || '?'}
          </div>
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              width: 220,
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              border: '1px solid #e2e8f0',
              zIndex: 300,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{user?.nombre}</strong>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{user?.email}</span>
                <span style={{ fontSize: '11px', color: '#1d6aff', display: 'block', marginTop: '4px', fontWeight: 600 }}>{user?.rol}</span>
              </div>
              <div
                onClick={() => { navigate(RUTAS.PERFIL); setShowUserMenu(false); }}
                style={{ padding: '12px 16px', fontSize: '14px', cursor: 'pointer', color: '#334155', display: 'flex', gap: '8px', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                👤 Mi Perfil
              </div>
              <div
                onClick={() => { navigate(RUTAS.SUSCRIPCIONES); setShowUserMenu(false); }}
                style={{ padding: '12px 16px', fontSize: '14px', cursor: 'pointer', color: '#334155', display: 'flex', gap: '8px', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                ⭐ Mi Suscripción
              </div>
              <div
                onClick={logout}
                style={{ padding: '12px 16px', fontSize: '14px', cursor: 'pointer', color: '#dc2626', display: 'flex', gap: '8px', alignItems: 'center', borderTop: '1px solid #f1f5f9' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                ⏏ Cerrar Sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
