import { useApp } from '../context/AppContext';
import { DEMO_TENANTS_ADMIN } from '../data/demo';

function KpiCard({ label, value, sub, icon, color = 'blue' }) {
  const colors = {
    blue: { bg: '#eff6ff', color: '#1d6aff' },
    green: { bg: '#dcfce7', color: '#16a34a' },
    amber: { bg: '#fef3c7', color: '#d97706' },
    purple: { bg: '#f3e8ff', color: '#7c3aed' },
    red: { bg: '#fee2e2', color: '#dc2626' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        <div className="kpi-icon" style={{ background: c.bg, color: c.color }}>{icon}</div>
      </div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

function TenantRow({ tenant, onView }) {
  const statusColors = {
    'Activo': 'badge-green',
    'Suspendido': 'badge-red',
    'Pendiente': 'badge-amber',
  };

  return (
    <tr style={{ cursor: 'pointer' }} onClick={() => onView(tenant)}>
      <td>
        <div className="cell-bold">{tenant.nombre}</div>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{tenant.ciudad}</div>
      </td>
      <td>{tenant.propietario}</td>
      <td>{tenant.email}</td>
      <td>
        <span className={`badge ${statusColors[tenant.estado] || 'badge-gray'}`}>
          {tenant.estado}
        </span>
      </td>
      <td>{tenant.plan}</td>
      <td>{tenant.suscripcionVence}</td>
      <td>{tenant.registrado}</td>
    </tr>
  );
}

export default function AdminDashboard() {
  const { navigate } = useApp();

  const activeTenants = DEMO_TENANTS_ADMIN.filter(t => t.estado === 'Activo').length;
  const suspendedTenants = DEMO_TENANTS_ADMIN.filter(t => t.estado === 'Suspendido').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Panel Administrativo SaaS</h1>
          <p className="page-subtitle">Gestión general de AutoGestión SaaS</p>
        </div>
      </div>

      <div className="demo-notice">
        <span>🎯</span>
        <span>Los datos mostrados son <strong>ficticios y de demostración</strong>. En producción reflejarán las operaciones reales de la plataforma.</span>
      </div>

      <div className="kpi-grid">
        <KpiCard
          label="Total Tenants"
          value={DEMO_TENANTS_ADMIN.length}
          sub="autoventas registradas"
          icon="🏢"
          color="blue"
        />
        <KpiCard
          label="Activos"
          value={activeTenants}
          sub="con suscripción vigente"
          icon="✅"
          color="green"
        />
        <KpiCard
          label="Suspendidos"
          value={suspendedTenants}
          sub="requieren atención"
          icon="⚠"
          color="red"
        />
        <KpiCard
          label="Ingresos Mensuales"
          value="Bs 228"
          sub="estimado (demo)"
          icon="💰"
          color="purple"
        />
      </div>

      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Tenants Recientes</div>
                <div className="card-subtitle">Últimas autoventas registradas</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('admin-tenants')}>
                Ver todos →
              </button>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Autoventa</th>
                    <th>Propietario</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th>Plan</th>
                    <th>Vence</th>
                    <th>Registrado</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_TENANTS_ADMIN.map(tenant => (
                    <TenantRow
                      key={tenant.id}
                      tenant={tenant}
                      onView={(t) => navigate('admin-tenants', { tenantId: t.id })}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Accesos Rápidos</div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Nuevo Tenant', icon: '🏢', route: 'admin-tenants', color: '#1d6aff' },
                  { label: 'Gestionar Planes', icon: '📑', route: 'admin-planes', color: '#7c3aed' },
                  { label: 'Suscripciones', icon: '⭐', route: 'admin-suscripciones', color: '#d97706' },
                  { label: 'Usuarios', icon: '👥', route: 'admin-tenants', color: '#0891b2' },
                ].map(item => (
                  <div
                    key={item.route}
                    onClick={() => navigate(item.route)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '16px',
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

          <div className="card">
            <div className="card-header">
              <div className="card-title">Estado del Sistema</div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Administrador API', status: 'Online', color: 'green' },
                  { label: 'Inventario API', status: 'Online', color: 'green' },
                  { label: 'Clientes API', status: 'Online', color: 'green' },
                  { label: 'Ventas API', status: 'Online', color: 'green' },
                  { label: 'PostgreSQL', status: 'Online', color: 'green' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#475569' }}>{item.label}</span>
                    <span className={`badge badge-${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
