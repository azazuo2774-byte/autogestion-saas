import { useApp } from '../context/AppContext';
import { DEMO_VEHICULOS, DEMO_CLIENTES, DEMO_VENTAS, DEMO_ACTIVIDADES, RUTAS } from '../data/demo';

const VEHICULOS_DISPONIBLES = DEMO_VEHICULOS.filter(v => v.estado === 'Disponible').length;
const VEHICULOS_RESERVADOS = DEMO_VEHICULOS.filter(v => v.estado === 'Reservado').length;
const VEHICULOS_VENDIDOS = DEMO_VEHICULOS.filter(v => v.estado === 'Vendido').length;

function KpiCard({ label, value, sub, icon, color = 'blue', trend, trendDir }) {
  return (
    <div className={`kpi-card ${color}`}>
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        <div className={`kpi-icon ${color}`}>{icon}</div>
      </div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
      {trend && (
        <div style={{ marginTop: '8px' }}>
          <span className={`kpi-trend ${trendDir || 'flat'}`}>
            {trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '→'} {trend}
          </span>
        </div>
      )}
    </div>
  );
}

function ActivityItem({ item }) {
  const timeAgo = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 60) return `hace ${diff} min`;
    if (diff < 1440) return `hace ${Math.floor(diff / 60)}h`;
    return `hace ${Math.floor(diff / 1440)} días`;
  };

  const colors = {
    green: { bg: '#dcfce7', color: '#16a34a' },
    blue: { bg: '#e0f2fe', color: '#0891b2' },
    amber: { bg: '#fef3c7', color: '#d97706' },
    red: { bg: '#fee2e2', color: '#dc2626' },
  };
  const c = colors[item.color] || colors.blue;

  return (
    <div className="activity-item">
      <div className="activity-avatar" style={{ background: c.bg, color: c.color }}>
        {item.icon}
      </div>
      <div className="activity-content">
        <div className="activity-text">{item.descripcion}</div>
        <div className="activity-time">{item.usuario} · {timeAgo(item.timestamp)}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { navigate, suscripcion, tenant } = useApp();

  return (
    <div>
      {/* Demo notice */}
      <div className="demo-notice">
        <span>🎯</span>
        <span>Los datos mostrados son <strong>ficticios y de demostración</strong>. En producción reflejarán las operaciones reales de <strong>{tenant?.nombre}</strong>.</span>
      </div>

      {/* Alerta de suscripción */}
      {suscripcion?.resultado === 'Activa' && (
        <div className="alert alert-warning" style={{ marginBottom: '20px' }}>
          <span className="alert-icon">⚠</span>
          <div className="alert-content">
            <strong>Suscripción por vencer</strong>
            Tu plan <strong>{suscripcion.planNombre}</strong> vence el{' '}
            {new Date(suscripcion.vencimientoUtc).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' })}.{' '}
            <span
              style={{ color: '#1d6aff', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => navigate(RUTAS.SUSCRIPCIONES)}
            >
              Renovar ahora →
            </span>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="kpi-grid">
        <KpiCard
          label="Total vehículos"
          value={DEMO_VEHICULOS.length}
          sub="en inventario"
          icon="🚗"
          color="blue"
        />
        <KpiCard
          label="Disponibles"
          value={VEHICULOS_DISPONIBLES}
          sub="listos para vender"
          icon="✅"
          color="green"
          trend="2 este mes"
          trendDir="up"
        />
        <KpiCard
          label="Reservados"
          value={VEHICULOS_RESERVADOS}
          sub="con seña activa"
          icon="📋"
          color="amber"
        />
        <KpiCard
          label="Vendidos"
          value={VEHICULOS_VENDIDOS}
          sub="este período"
          icon="🏁"
          color="blue"
          trend="1 este mes"
          trendDir="up"
        />
        <KpiCard
          label="Clientes"
          value={DEMO_CLIENTES.length}
          sub="registrados en CRM"
          icon="👥"
          color="purple"
          trend="3 este mes"
          trendDir="up"
        />
        <KpiCard
          label="Ingresos (demo)"
          value="Bs 46.000"
          sub="ventas registradas"
          icon="💰"
          color="green"
        />
      </div>

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Accesos rápidos */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Accesos rápidos</div>
                <div className="card-subtitle">Operaciones más frecuentes</div>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                {[
                  { label: 'Nuevo vehículo', icon: '🚗', route: RUTAS.VEHICULO_NUEVO, color: '#1d6aff' },
                  { label: 'Nuevo cliente', icon: '👤', route: RUTAS.CLIENTES, color: '#7c3aed' },
                  { label: 'Nueva reserva', icon: '📋', route: RUTAS.RESERVAS, color: '#d97706' },
                  { label: 'Nueva venta', icon: '💰', route: RUTAS.VENTAS, color: '#16a34a' },
                  { label: 'Ver inventario', icon: '📦', route: RUTAS.INVENTARIO, color: '#0891b2' },
                  { label: 'Reportes', icon: '📈', route: RUTAS.AUDITORIA, color: '#475569' },
                ].map(item => (
                  <div
                    key={item.route}
                    onClick={() => navigate(item.route)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '16px 12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 200ms',
                      textAlign: 'center',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = item.color + '10';
                      e.currentTarget.style.borderColor = item.color + '40';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{item.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vehículos recientes */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Inventario reciente</div>
                <div className="card-subtitle">Últimos vehículos ingresados</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate(RUTAS.INVENTARIO)}>
                Ver todos →
              </button>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Vehículo</th>
                    <th>Año</th>
                    <th>Precio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_VEHICULOS.slice(0, 4).map(v => (
                    <tr
                      key={v.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(RUTAS.VEHICULO_DETALLE, { vehiculoId: v.id })}
                    >
                      <td>
                        <div className="cell-bold">{v.marca} {v.modelo}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{v.placa}</div>
                      </td>
                      <td>{v.anio}</td>
                      <td><strong style={{ color: '#1d6aff' }}>Bs {v.precio.toLocaleString()}</strong></td>
                      <td>
                        <span className={`badge ${
                          v.estado === 'Disponible' ? 'badge-green' :
                          v.estado === 'Reservado' ? 'badge-amber' :
                          v.estado === 'Vendido' ? 'badge-navy' : 'badge-gray'
                        }`}>
                          {v.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Actividad reciente */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Actividad reciente</div>
                <div className="card-subtitle">Últimas operaciones registradas</div>
              </div>
            </div>
            <div className="card-body">
              <div className="activity-list">
                {DEMO_ACTIVIDADES.map(a => (
                  <ActivityItem key={a.id} item={a} />
                ))}
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => navigate(RUTAS.AUDITORIA)}>
                Ver historial completo →
              </button>
            </div>
          </div>

          {/* Suscripción */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Mi Suscripción</div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: 44, height: 44, background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  ⭐
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>
                    Plan {suscripcion?.planNombre}
                  </div>
                  <span className={`badge ${suscripcion?.resultado === 'Activa' ? 'badge-green' : 'badge-red'}`}>
                    {suscripcion?.resultado}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Inicio</span>
                  <strong style={{ color: '#0f172a' }}>
                    {new Date(suscripcion?.inicioUtc).toLocaleDateString('es-BO')}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Vencimiento</span>
                  <strong style={{ color: '#d97706' }}>
                    {new Date(suscripcion?.vencimientoUtc).toLocaleDateString('es-BO')}
                  </strong>
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <button
                  className="btn btn-primary w-full"
                  style={{ justifyContent: 'center' }}
                  onClick={() => navigate(RUTAS.PLANES)}
                >
                  Ver planes disponibles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
