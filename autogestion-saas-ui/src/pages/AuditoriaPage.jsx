import { useState } from 'react';
import { DEMO_ACTIVIDADES, DEMO_VENTAS, DEMO_VEHICULOS, DEMO_CLIENTES } from '../data/demo';

const FILTROS_TIPO = ['Todos', 'venta', 'reserva', 'cliente', 'vehiculo'];

export default function AuditoriaPage() {
  const [activeTab, setActiveTab] = useState('historial');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');

  const actividades = DEMO_ACTIVIDADES.filter(a => {
    if (filtroTipo !== 'Todos' && a.tipo !== filtroTipo) return false;
    return true;
  });

  const colorMap = {
    green: { bg: '#dcfce7', color: '#16a34a' },
    blue: { bg: '#e0f2fe', color: '#0891b2' },
    amber: { bg: '#fef3c7', color: '#d97706' },
    red: { bg: '#fee2e2', color: '#dc2626' },
  };

  const [exportNotice, setExportNotice] = useState('');

  const triggerExport = (format = 'CSV') => {
    setExportNotice(`Generando y descargando reporte en formato ${format}...`);
    setTimeout(() => {
      setExportNotice(`¡Reporte en formato ${format} descargado correctamente!`);
      setTimeout(() => setExportNotice(''), 3000);
    }, 1000);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Auditoría y Reportes</h2>
          <p>Historial de actividades y estadísticas del negocio</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => triggerExport('CSV')}>
            📄 Exportar reporte
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="alert alert-success" style={{ marginBottom: '16px' }}>
          <span className="alert-icon">✓</span>
          <div className="alert-content"><strong>{exportNotice}</strong></div>
        </div>
      )}

      <div className="demo-notice">
        <span>📊</span>
        <span>Los datos son de <strong>demostración</strong>. Los reportes exportables son una <strong>funcionalidad propuesta</strong> para versiones futuras del MVP.</span>
      </div>

      <div className="tabs">
        <div className={`tab-item${activeTab === 'historial' ? ' active' : ''}`} onClick={() => setActiveTab('historial')}>📋 Historial de actividades</div>
        <div className={`tab-item${activeTab === 'estadisticas' ? ' active' : ''}`} onClick={() => setActiveTab('estadisticas')}>📊 Estadísticas</div>
        <div className={`tab-item${activeTab === 'reportes' ? ' active' : ''}`} onClick={() => setActiveTab('reportes')}>📈 Reportes</div>
      </div>

      {activeTab === 'historial' && (
        <div>
          {/* Filtros */}
          <div className="search-filter-bar" style={{ marginBottom: '20px' }}>
            <select className="filter-select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
              {FILTROS_TIPO.map(t => <option key={t}>{t}</option>)}
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: '#64748b' }}>Desde</label>
              <input type="date" className="filter-select" value={filtroFechaDesde} onChange={e => setFiltroFechaDesde(e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: '#64748b' }}>Hasta</label>
              <input type="date" className="filter-select" value={filtroFechaHasta} onChange={e => setFiltroFechaHasta(e.target.value)} />
            </div>
          </div>

          <div className="card">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Usuario</th>
                    <th>Fecha y hora</th>
                  </tr>
                </thead>
                <tbody>
                  {actividades.map(a => {
                    const c = colorMap[a.color] || colorMap.blue;
                    return (
                      <tr key={a.id}>
                        <td>
                          <span style={{ background: c.bg, color: c.color, padding: '3px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {a.icon} {a.tipo}
                          </span>
                        </td>
                        <td style={{ maxWidth: '300px' }}>{a.descripcion}</td>
                        <td style={{ color: '#64748b' }}>{a.usuario}</td>
                        <td className="cell-mono" style={{ color: '#94a3b8', fontSize: '12px' }}>
                          {new Date(a.timestamp).toLocaleString('es-BO')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'estadisticas' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Vehículos disponibles', value: DEMO_VEHICULOS.filter(v => v.estado === 'Disponible').length, icon: '✅', color: 'green' },
              { label: 'Vehículos reservados', value: DEMO_VEHICULOS.filter(v => v.estado === 'Reservado').length, icon: '📋', color: 'amber' },
              { label: 'Vehículos vendidos', value: DEMO_VEHICULOS.filter(v => v.estado === 'Vendido').length, icon: '🏁', color: 'blue' },
              { label: 'Clientes activos', value: DEMO_CLIENTES.filter(c => c.estado === 'Activo').length, icon: '👥', color: 'purple' },
              { label: 'Ventas registradas', value: DEMO_VENTAS.length, icon: '💰', color: 'green' },
              { label: 'Ingresos (demo)', value: 'Bs 46.000', icon: '📊', color: 'blue' },
            ].map(s => (
              <div key={s.label} className={`kpi-card ${s.color}`}>
                <div className="kpi-header">
                  <span className="kpi-label">{s.label}</span>
                  <div className={`kpi-icon ${s.color}`}>{s.icon}</div>
                </div>
                <div className="kpi-value">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Tabla: inventario por estado */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <div className="card-title">Inventario por marca</div>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Marca</th>
                    <th>Cantidad</th>
                    <th>Disponibles</th>
                    <th>Reservados</th>
                    <th>Vendidos</th>
                  </tr>
                </thead>
                <tbody>
                  {['Toyota', 'Nissan', 'Honda', 'Mitsubishi', 'Hyundai'].map(marca => {
                    const mv = DEMO_VEHICULOS.filter(v => v.marca === marca);
                    if (mv.length === 0) return null;
                    return (
                      <tr key={marca}>
                        <td className="cell-bold">{marca}</td>
                        <td>{mv.length}</td>
                        <td>{mv.filter(v => v.estado === 'Disponible').length}</td>
                        <td>{mv.filter(v => v.estado === 'Reservado').length}</td>
                        <td>{mv.filter(v => v.estado === 'Vendido').length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reportes' && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📈</div>
            <div className="empty-title">Reportes exportables</div>
            <div className="empty-desc">
              La generación y exportación de reportes en PDF/Excel es una <strong>funcionalidad propuesta</strong> para versiones posteriores al MVP. Incluirá resúmenes de ventas, inventario, clientes y rendimiento.
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => triggerExport('PDF')}>📄 Exportar PDF</button>
              <button className="btn btn-secondary" onClick={() => triggerExport('Excel')}>📊 Exportar Excel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
