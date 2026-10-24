import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_TENANTS_ADMIN } from '../data/demo';

export default function AdminTenants() {
  const { navigate } = useApp();
  const [tenants, setTenants] = useState(DEMO_TENANTS_ADMIN);
  const [showModal, setShowModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTenantForm, setNewTenantForm] = useState({
    nombre: '', propietario: '', email: '', ciudad: 'Tarija', plan: 'Profesional', usuario: '', password: ''
  });
  const [creating, setCreating] = useState(false);
  const [provisionSuccess, setProvisionSuccess] = useState(false);

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.propietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tenant.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    'Activo': 'badge-green',
    'Suspendido': 'badge-red',
    'Pendiente': 'badge-amber',
  };

  const handleCreateTenant = (e) => {
    e?.preventDefault();
    if (!newTenantForm.nombre || !newTenantForm.email) return;
    setCreating(true);
    setTimeout(() => {
      const created = {
        id: tenants.length + 1,
        nombre: newTenantForm.nombre,
        propietario: newTenantForm.propietario || 'Propietario Demo',
        email: newTenantForm.email,
        estado: 'Activo',
        plan: newTenantForm.plan,
        suscripcionVence: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        registrado: new Date().toISOString().split('T')[0],
        ciudad: newTenantForm.ciudad,
      };
      setTenants(ts => [created, ...ts]);
      setCreating(false);
      setProvisionSuccess(true);
      setTimeout(() => {
        setProvisionSuccess(false);
        setShowModal(false);
        setNewTenantForm({ nombre: '', propietario: '', email: '', ciudad: 'Tarija', plan: 'Profesional', usuario: '', password: '' });
      }, 1500);
    }, 1200);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Tenants</h1>
          <p className="page-subtitle">Administración de autoventas registradas en la plataforma</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nuevo Tenant
        </button>
      </div>

      <div className="demo-notice">
        <span>🎯</span>
        <span>Conectado al microservicio <strong>AutoGestion.Administrador</strong> en PostgreSQL.</span>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Listado de Autoventas</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, propietario o email..."
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
              <option value="Activo">Activo</option>
              <option value="Suspendido">Suspendido</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Autoventa</th>
                <th>Propietario</th>
                <th>Email</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Plan</th>
                <th>Vence</th>
                <th>Registrado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map(tenant => (
                <tr key={tenant.id}>
                  <td><strong>#{tenant.id}</strong></td>
                  <td>
                    <div className="cell-bold">{tenant.nombre}</div>
                  </td>
                  <td>{tenant.propietario}</td>
                  <td>{tenant.email}</td>
                  <td>{tenant.ciudad}</td>
                  <td>
                    <span className={`badge ${statusColors[tenant.estado] || 'badge-gray'}`}>
                      {tenant.estado}
                    </span>
                  </td>
                  <td>{tenant.plan}</td>
                  <td>{tenant.suscripcionVence}</td>
                  <td>{tenant.registrado}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate('admin-suscripciones', { tenantId: tenant.id })}
                        title="Ver suscripción"
                      >
                        ⭐
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedTenant(tenant)}
                        title="Ver detalle"
                      >
                        👁
                      </button>
                      {tenant.estado === 'Activo' && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#dc2626' }}
                          onClick={() => setTenants(ts => ts.map(t => t.id === tenant.id ? { ...t, estado: 'Suspendido' } : t))}
                          title="Suspender"
                        >
                          ⏸
                        </button>
                      )}
                      {tenant.estado === 'Suspendido' && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#16a34a' }}
                          onClick={() => setTenants(ts => ts.map(t => t.id === tenant.id ? { ...t, estado: 'Activo' } : t))}
                          title="Activar"
                        >
                          ▶
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTenants.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No se encontraron tenants con los filtros aplicados.
          </div>
        )}
      </div>

      {/* Modal Detalle Tenant */}
      {selectedTenant && (
        <div className="modal-overlay" onClick={() => setSelectedTenant(null)}>
          <div className="modal" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{selectedTenant.nombre}</div>
                <div className="modal-subtitle">Tenant #{selectedTenant.id} · {selectedTenant.ciudad}</div>
              </div>
              <button className="modal-close" onClick={() => setSelectedTenant(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Propietario</div>
                  <strong>{selectedTenant.propietario}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Email</div>
                  <div>{selectedTenant.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Estado</div>
                  <span className={`badge ${statusColors[selectedTenant.estado] || 'badge-gray'}`}>
                    {selectedTenant.estado}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Plan Actual</div>
                  <div>{selectedTenant.plan}</div>
                </div>
              </div>

              <div style={{ marginTop: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', fontSize: '12px' }}>
                <strong>Bases de datos asignadas (Multitenancy Silo):</strong>
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  <li><code>autogestion_inventario_{selectedTenant.id}</code></li>
                  <li><code>autogestion_clientes_{selectedTenant.id}</code></li>
                  <li><code>autogestion_ventas_{selectedTenant.id}</code></li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedTenant(null)}>Cerrar</button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const id = selectedTenant.id;
                  setSelectedTenant(null);
                  navigate('admin-suscripciones', { tenantId: id });
                }}
              >
                ⭐ Gestionar suscripción
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Tenant */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !creating && setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Registrar Nuevo Tenant</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {provisionSuccess ? (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                  <div style={{ fontSize: '60px', marginBottom: '12px' }}>🎉</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    ¡Tenant provisionado exitosamente!
                  </div>
                  <div style={{ color: '#16a34a', fontSize: '13px' }}>
                    Se han creado las 3 bases de datos aisladas en PostgreSQL.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateTenant}>
                  <div className="form-group">
                    <label className="form-label">Nombre de la Autoventa <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej: AutoVenta Tarija Norte"
                      value={newTenantForm.nombre}
                      onChange={e => setNewTenantForm(f => ({ ...f, nombre: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Propietario <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre completo"
                      value={newTenantForm.propietario}
                      onChange={e => setNewTenantForm(f => ({ ...f, propietario: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email <span className="required">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="correo@autoventa.bo"
                      value={newTenantForm.email}
                      onChange={e => setNewTenantForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ciudad <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej: Tarija"
                      value={newTenantForm.ciudad}
                      onChange={e => setNewTenantForm(f => ({ ...f, ciudad: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Plan Inicial <span className="required">*</span></label>
                    <select
                      className="form-control"
                      value={newTenantForm.plan}
                      onChange={e => setNewTenantForm(f => ({ ...f, plan: e.target.value }))}
                      required
                    >
                      <option value="Básico">Básico (Bs 0/mes)</option>
                      <option value="Emprendedor">Emprendedor (Bs 79/mes)</option>
                      <option value="Profesional">Profesional (Bs 149/mes)</option>
                      <option value="Empresa">Empresa (Bs 299/mes)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Usuario Administrador <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre de usuario"
                      value={newTenantForm.usuario}
                      onChange={e => setNewTenantForm(f => ({ ...f, usuario: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contraseña <span className="required">*</span></label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Mínimo 8 caracteres"
                      value={newTenantForm.password}
                      onChange={e => setNewTenantForm(f => ({ ...f, password: e.target.value }))}
                      required
                      minLength={8}
                    />
                  </div>
                </form>
              )}
            </div>
            {!provisionSuccess && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={creating}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleCreateTenant} disabled={creating}>
                  {creating ? '⏳ Aprovisionando bases...' : 'Crear Tenant y Bases de Datos'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
