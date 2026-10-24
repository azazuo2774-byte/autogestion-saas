import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_TENANTS_ADMIN, DEMO_PLANES } from '../data/demo';

const DEMO_SUSCRIPCIONES = [
  {
    id: 1,
    tenantId: 1,
    tenantNombre: 'AutoVenta Tarija Norte',
    planId: 3,
    planNombre: 'Profesional',
    inicioUtc: '2026-10-01T00:00:00Z',
    vencimientoUtc: '2026-10-31T23:59:59Z',
    estado: 'Habilitada',
    resultado: 'Activa',
  },
  {
    id: 2,
    tenantId: 2,
    tenantNombre: 'Autos del Sur SRL',
    planId: 2,
    planNombre: 'Emprendedor',
    inicioUtc: '2026-09-15T00:00:00Z',
    vencimientoUtc: '2026-11-15T23:59:59Z',
    estado: 'Habilitada',
    resultado: 'Activa',
  },
  {
    id: 3,
    tenantId: 3,
    tenantNombre: 'Multiautos Bermejo',
    planId: 1,
    planNombre: 'Básico',
    inicioUtc: '2026-07-20T00:00:00Z',
    vencimientoUtc: '2026-09-30T23:59:59Z',
    estado: 'Habilitada',
    resultado: 'Vencida',
  },
];

export default function AdminSuscripciones() {
  const { navigate } = useApp();
  const [subs, setSubs] = useState(DEMO_SUSCRIPCIONES);
  const [showModal, setShowModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form, setForm] = useState({
    tenantId: '1',
    planId: '3',
    inicioUtc: new Date().toISOString().split('T')[0],
    duracionDias: 30,
    estado: 'Habilitada',
  });

  const filteredSubs = subs.filter(sub => {
    const matchesSearch = sub.tenantNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.planNombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.resultado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    'Activa': 'badge-green',
    'Vencida': 'badge-red',
    'Inexistente': 'badge-gray',
  };

  const getVigencia = (sub) => {
    const inicio = new Date(sub.inicioUtc);
    const vencimiento = new Date(sub.vencimientoUtc);
    const ahora = new Date();

    if (sub.estado === 'Habilitada' && inicio <= ahora && ahora < vencimiento) {
      return 'Vigente';
    }
    return 'No vigente';
  };

  const handleRenovar = (id) => {
    setSubs(list => list.map(s => {
      if (s.id !== id) return s;
      const currentVenc = new Date(s.vencimientoUtc);
      const base = currentVenc > new Date() ? currentVenc : new Date();
      base.setDate(base.getDate() + 30);
      return {
        ...s,
        vencimientoUtc: base.toISOString(),
        resultado: 'Activa',
        estado: 'Habilitada',
      };
    }));
  };

  const handleReactivar = (id) => {
    setSubs(list => list.map(s => {
      if (s.id !== id) return s;
      const base = new Date();
      base.setDate(base.getDate() + 30);
      return {
        ...s,
        inicioUtc: new Date().toISOString(),
        vencimientoUtc: base.toISOString(),
        resultado: 'Activa',
        estado: 'Habilitada',
      };
    }));
  };

  const handleCancelar = (id) => {
    setSubs(list => list.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        resultado: 'Vencida',
        estado: 'Cancelada',
      };
    }));
  };

  const handleCreateSub = (e) => {
    e?.preventDefault();
    const tenant = DEMO_TENANTS_ADMIN.find(t => t.id === parseInt(form.tenantId, 10)) || DEMO_TENANTS_ADMIN[0];
    const plan = DEMO_PLANES.find(p => p.id === parseInt(form.planId, 10)) || DEMO_PLANES[0];
    const inicio = new Date(form.inicioUtc);
    const vencimiento = new Date(inicio);
    vencimiento.setDate(vencimiento.getDate() + (parseInt(form.duracionDias, 10) || 30));

    const nueva = {
      id: Date.now(),
      tenantId: tenant.id,
      tenantNombre: tenant.nombre,
      planId: plan.id,
      planNombre: plan.nombre,
      inicioUtc: inicio.toISOString(),
      vencimientoUtc: vencimiento.toISOString(),
      estado: form.estado,
      resultado: form.estado === 'Habilitada' ? 'Activa' : 'Vencida',
    };
    setSubs(list => [nueva, ...list]);
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Suscripciones</h1>
          <p className="page-subtitle">Control de acceso y vigencia por tenant</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nueva Suscripción
        </button>
      </div>

      <div className="demo-notice">
        <span>🎯</span>
        <span>Lógica de evaluación multitenant: <code>inicio ≤ ahora UTC &lt; vencimiento AND habilitada</code>.</span>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Listado de Suscripciones</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por autoventa o plan..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '300px' }}
            />
            <select
              className="form-control"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="all">Todos los estados</option>
              <option value="Activa">Activa</option>
              <option value="Vencida">Vencida</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Autoventa</th>
                <th>Plan</th>
                <th>Inicio (UTC)</th>
                <th>Vencimiento (UTC)</th>
                <th>Vigencia</th>
                <th>Resultado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map(sub => (
                <tr key={sub.id}>
                  <td>
                    <div className="cell-bold">{sub.tenantNombre}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Tenant #{sub.tenantId}</div>
                  </td>
                  <td>{sub.planNombre}</td>
                  <td>{new Date(sub.inicioUtc).toLocaleDateString('es-BO')}</td>
                  <td>{new Date(sub.vencimientoUtc).toLocaleDateString('es-BO')}</td>
                  <td>{getVigencia(sub)}</td>
                  <td>
                    <span className={`badge ${statusColors[sub.resultado] || 'badge-gray'}`}>
                      {sub.resultado}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedSub(sub)}
                        title="Ver detalle"
                      >
                        👁
                      </button>
                      {sub.resultado === 'Activa' && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleRenovar(sub.id)}
                          title="Renovar (+30 días)"
                        >
                          🔄
                        </button>
                      )}
                      {sub.resultado === 'Vencida' && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#16a34a' }}
                          onClick={() => handleReactivar(sub.id)}
                          title="Reactivar"
                        >
                          ▶
                        </button>
                      )}
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#dc2626' }}
                        onClick={() => handleCancelar(sub.id)}
                        title="Cancelar"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSubs.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No se encontraron suscripciones con los filtros aplicados.
          </div>
        )}
      </div>

      {/* Modal Detalle */}
      {selectedSub && (
        <div className="modal-overlay" onClick={() => setSelectedSub(null)}>
          <div className="modal" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Suscripción #{selectedSub.id}</div>
                <div className="modal-subtitle">{selectedSub.tenantNombre}</div>
              </div>
              <button className="modal-close" onClick={() => setSelectedSub(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Plan</div>
                  <strong>{selectedSub.planNombre}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Estado / Resultado</div>
                  <span className={`badge ${statusColors[selectedSub.resultado] || 'badge-gray'}`}>
                    {selectedSub.resultado}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Inicio (UTC)</div>
                  <div>{new Date(selectedSub.inicioUtc).toLocaleDateString('es-BO')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Vencimiento (UTC)</div>
                  <strong style={{ color: '#d97706' }}>{new Date(selectedSub.vencimientoUtc).toLocaleDateString('es-BO')}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedSub(null)}>Cerrar</button>
              {selectedSub.resultado === 'Activa' ? (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleRenovar(selectedSub.id);
                    setSelectedSub(null);
                  }}
                >
                  🔄 Renovar (+30 días)
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleReactivar(selectedSub.id);
                    setSelectedSub(null);
                  }}
                >
                  ▶ Reactivar suscripción
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Suscripcion */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Crear Nueva Suscripción</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateSub}>
                <div className="form-group">
                  <label className="form-label">Tenant <span className="required">*</span></label>
                  <select
                    className="form-control"
                    value={form.tenantId}
                    onChange={e => setForm(f => ({ ...f, tenantId: e.target.value }))}
                    required
                  >
                    {DEMO_TENANTS_ADMIN.map(t => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Plan <span className="required">*</span></label>
                  <select
                    className="form-control"
                    value={form.planId}
                    onChange={e => setForm(f => ({ ...f, planId: e.target.value }))}
                    required
                  >
                    {DEMO_PLANES.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} - Bs {p.precio}/mes</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha de Inicio <span className="required">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.inicioUtc}
                    onChange={e => setForm(f => ({ ...f, inicioUtc: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duración (días) <span className="required">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.duracionDias}
                    onChange={e => setForm(f => ({ ...f, duracionDias: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado Inicial</label>
                  <select
                    className="form-control"
                    value={form.estado}
                    onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
                  >
                    <option value="Habilitada">Habilitada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCreateSub}>
                Crear Suscripción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
