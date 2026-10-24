import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_CLIENTES, DEMO_OPORTUNIDADES, RUTAS } from '../data/demo';

const ESTADOS_OPO = ['Prospecto', 'Propuesta', 'Negociación', 'Reserva', 'Cerrada', 'Perdida'];

function ClienteCard({ cliente, onClick }) {
  const initials = cliente.nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 200ms',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2256a8, #1d6aff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '16px',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {cliente.nombre}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{cliente.ciudad}</div>
        </div>
        <span className={`badge ${cliente.estado === 'Activo' ? 'badge-green' : 'badge-gray'}`}>
          {cliente.estado}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#475569' }}>
        <div>📞 {cliente.telefono}</div>
        {cliente.correo && <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>✉ {cliente.correo}</div>}
        <div>🎯 Interés: {cliente.interes}</div>
      </div>

      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
        <span style={{ color: '#94a3b8' }}>Oportunidades</span>
        <span style={{ fontWeight: 700, color: '#1d6aff' }}>{cliente.oportunidades}</span>
      </div>
    </div>
  );
}

function ClienteModal({ cliente, onClose, navigate, onUpdate }) {
  const [activeTab, setActiveTab] = useState('perfil');
  const [formEdit, setFormEdit] = useState({ ...cliente });
  const [editMode, setEditMode] = useState(false);

  const oportunidades = DEMO_OPORTUNIDADES.filter(o => o.clienteId === cliente.id);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div>
            <div className="modal-title">{cliente.nombre}</div>
            <div className="modal-subtitle">CI: {cliente.ci} · {cliente.ciudad}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="tabs" style={{ padding: '0 24px' }}>
          <div className={`tab-item${activeTab === 'perfil' ? ' active' : ''}`} onClick={() => setActiveTab('perfil')}>👤 Perfil</div>
          <div className={`tab-item${activeTab === 'oportunidades' ? ' active' : ''}`} onClick={() => setActiveTab('oportunidades')}>
            💼 Oportunidades {oportunidades.length > 0 && `(${oportunidades.length})`}
          </div>
        </div>

        <div className="modal-body">
          {activeTab === 'perfil' && (
            <div>
              {editMode ? (
                <div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Nombre completo <span className="required">*</span></label>
                      <input className="form-control" value={formEdit.nombre} onChange={e => setFormEdit(f => ({...f, nombre: e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CI / DNI</label>
                      <input className="form-control" value={formEdit.ci} onChange={e => setFormEdit(f => ({...f, ci: e.target.value}))} />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Teléfono</label>
                      <input className="form-control" value={formEdit.telefono} onChange={e => setFormEdit(f => ({...f, telefono: e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Correo</label>
                      <input type="email" className="form-control" value={formEdit.correo || ''} onChange={e => setFormEdit(f => ({...f, correo: e.target.value}))} />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Ciudad</label>
                      <input className="form-control" value={formEdit.ciudad} onChange={e => setFormEdit(f => ({...f, ciudad: e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Interés principal</label>
                      <input className="form-control" value={formEdit.interes} onChange={e => setFormEdit(f => ({...f, interes: e.target.value}))} />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Nombre', value: cliente.nombre },
                    { label: 'CI / DNI', value: cliente.ci },
                    { label: 'Teléfono', value: cliente.telefono },
                    { label: 'Correo', value: cliente.correo || '—' },
                    { label: 'Ciudad', value: cliente.ciudad },
                    { label: 'Interés', value: cliente.interes },
                    { label: 'Estado', value: cliente.estado },
                    { label: 'Registrado', value: cliente.registradoEn },
                  ].map(f => (
                    <div key={f.label} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{f.label}</div>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'oportunidades' && (
            <div>
              {oportunidades.length === 0 ? (
                <div className="empty-state" style={{ paddingTop: '30px' }}>
                  <div className="empty-icon">💼</div>
                  <div className="empty-title">Sin oportunidades</div>
                  <div className="empty-desc">No se han registrado oportunidades comerciales para este cliente.</div>
                  <button className="btn btn-primary">+ Agregar oportunidad</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {oportunidades.map(o => (
                    <div key={o.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong style={{ color: '#0f172a' }}>{o.vehiculo}</strong>
                        <span className={`badge ${
                          o.estado === 'Negociación' ? 'badge-amber' :
                          o.estado === 'Reserva' ? 'badge-blue' :
                          o.estado === 'Cerrada' ? 'badge-green' : 'badge-gray'
                        }`}>{o.estado}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                        Presupuesto: <strong>Bs {o.presupuesto.toLocaleString()}</strong>
                      </div>
                      <div style={{ fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                        Vendedor: {o.vendedor}
                      </div>
                      {o.nota && <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>{o.nota}</p>}
                    </div>
                  ))}
                  <button className="btn btn-secondary btn-sm">+ Nueva oportunidad</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
          {editMode ? (
            <button className="btn btn-primary" onClick={() => {
              if (onUpdate) onUpdate(formEdit);
              setEditMode(false);
            }}>💾 Guardar cambios</button>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => setEditMode(true)}>✏️ Editar</button>
              <button className="btn btn-primary" onClick={() => navigate(RUTAS.RESERVAS)}>📋 Nueva reserva</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NuevoClienteModal({ onClose, onSave }) {
  const [form, setForm] = useState({ nombre: '', ci: '', telefono: '', correo: '', ciudad: 'Tarija', interes: '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre || form.nombre.length < 3) e.nombre = 'Nombre requerido (mínimo 3 caracteres)';
    if (!form.telefono) e.telefono = 'El teléfono es requerido';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (onSave) {
      onSave({
        ...form,
        id: Date.now(),
        estado: 'Activo',
        oportunidades: 0,
        registradoEn: new Date().toISOString().split('T')[0]
      });
    }
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  if (saved) return (
    <div className="modal-overlay">
      <div className="modal" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Cliente registrado</div>
        <div style={{ color: '#64748b', fontSize: '14px' }}>{form.nombre} ha sido agregado al CRM.</div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Registrar nuevo cliente</div>
            <div className="modal-subtitle">Agrega los datos de contacto del comprador</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nombre completo <span className="required">*</span></label>
            <input className={`form-control${errors.nombre ? ' error' : ''}`} value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))} placeholder="Ej: María Fernández Rojas" />
            {errors.nombre && <div className="form-error">⚠ {errors.nombre}</div>}
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">CI / DNI</label>
              <input className="form-control" value={form.ci} onChange={e => setForm(f => ({...f, ci: e.target.value}))} placeholder="4512345" />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono <span className="required">*</span></label>
              <input className={`form-control${errors.telefono ? ' error' : ''}`} value={form.telefono} onChange={e => setForm(f => ({...f, telefono: e.target.value}))} placeholder="71234567" />
              {errors.telefono && <div className="form-error">⚠ {errors.telefono}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input type="email" className="form-control" value={form.correo} onChange={e => setForm(f => ({...f, correo: e.target.value}))} placeholder="cliente@correo.com" />
            <div className="form-hint">Opcional. Útil para comunicaciones y seguimiento.</div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Ciudad</label>
              <input className="form-control" value={form.ciudad} onChange={e => setForm(f => ({...f, ciudad: e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Interés principal</label>
              <input className="form-control" value={form.interes} onChange={e => setForm(f => ({...f, interes: e.target.value}))} placeholder="Camioneta, SUV…" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>💾 Registrar cliente</button>
        </div>
      </div>
    </div>
  );
}

export default function ClientesPage() {
  const { navigate, routeParams, currentRoute } = useApp();
  const [clientes, setClientes] = useState(DEMO_CLIENTES);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showNuevo, setShowNuevo] = useState(!!routeParams?.nuevo);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    if (routeParams?.nuevo) {
      setShowNuevo(true);
    }
    if (routeParams?.clienteId) {
      const c = clientes.find(x => x.id === routeParams.clienteId);
      if (c) setSelectedCliente(c);
    }
  }, [routeParams, clientes]);

  const filtered = clientes.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || `${c.nombre} ${c.telefono} ${c.correo || ''} ${c.ciudad}`.toLowerCase().includes(q);
    const matchE = filterEstado === 'Todos' || c.estado === filterEstado;
    return matchQ && matchE;
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Clientes y CRM</h2>
          <p>{filtered.length} cliente{filtered.length !== 1 ? 's' : ''} · {DEMO_OPORTUNIDADES.length} oportunidades activas</p>
        </div>
        <div className="page-header-actions">
          <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '7px 12px', background: viewMode === 'grid' ? '#f1f5f9' : 'white', border: 'none', cursor: 'pointer', borderRight: '1px solid #e2e8f0' }}>⊞</button>
            <button onClick={() => setViewMode('table')} style={{ padding: '7px 12px', background: viewMode === 'table' ? '#f1f5f9' : 'white', border: 'none', cursor: 'pointer' }}>☰</button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowNuevo(true)}>+ Nuevo cliente</button>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="form-control" placeholder="Buscar por nombre, teléfono, ciudad…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
          <option value="Todos">Todos los estados</option>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <div className="empty-title">Sin resultados</div>
            <div className="empty-desc">No hay clientes que coincidan con tu búsqueda.</div>
            <button className="btn btn-secondary" onClick={() => setSearch('')}>Limpiar búsqueda</button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(c => (
            <ClienteCard key={c.id} cliente={c} onClick={() => setSelectedCliente(c)} />
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Teléfono</th>
                  <th>Ciudad</th>
                  <th>Interés</th>
                  <th>Oportunidades</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div className="cell-bold">{c.nombre}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>CI: {c.ci}</div>
                    </td>
                    <td>{c.telefono}</td>
                    <td>{c.ciudad}</td>
                    <td style={{ maxWidth: '150px' }}><span className="truncate">{c.interes}</span></td>
                    <td>
                      <span style={{ background: c.oportunidades > 0 ? '#eff6ff' : '#f8fafc', color: c.oportunidades > 0 ? '#1d6aff' : '#94a3b8', fontWeight: 700, borderRadius: '20px', padding: '3px 10px', fontSize: '12px' }}>
                        {c.oportunidades}
                      </span>
                    </td>
                    <td><span className={`badge ${c.estado === 'Activo' ? 'badge-green' : 'badge-gray'}`}>{c.estado}</span></td>
                    <td className="col-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCliente(c)}>Ver perfil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedCliente && (
        <ClienteModal
          cliente={selectedCliente}
          onClose={() => setSelectedCliente(null)}
          navigate={navigate}
          onUpdate={(updatedC) => {
            setClientes(cs => cs.map(c => c.id === updatedC.id ? updatedC : c));
            setSelectedCliente(updatedC);
          }}
        />
      )}
      {showNuevo && (
        <NuevoClienteModal
          onClose={() => setShowNuevo(false)}
          onSave={(newC) => setClientes(cs => [newC, ...cs])}
        />
      )}
    </div>
  );
}
