import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_VEHICULOS, RUTAS } from '../data/demo';

const MARCAS = [...new Set(DEMO_VEHICULOS.map(v => v.marca))];
const ESTADOS = ['Todos', 'Disponible', 'Reservado', 'Vendido'];
const COMBUSTIBLES = ['Todos', 'Diésel', 'Gasolina'];

function VehicleStatusBadge({ estado }) {
  const map = {
    Disponible: 'badge-green',
    Reservado: 'badge-amber',
    Vendido: 'badge-navy',
    Inactivo: 'badge-gray',
  };
  return <span className={`badge ${map[estado] || 'badge-gray'}`}>{estado}</span>;
}

function VehicleCard({ v, onView }) {
  const iconMap = {
    Toyota: '🚙', Nissan: '🚗', Honda: '🚘', Mitsubishi: '🚛', Hyundai: '🚗',
  };
  const icon = iconMap[v.marca] || '🚗';

  return (
    <div className="vehicle-card" onClick={onView}>
      <div className="vehicle-card-image">
        <span>{icon}</span>
        <div className="vehicle-card-status">
          <VehicleStatusBadge estado={v.estado} />
        </div>
      </div>
      <div className="vehicle-card-body">
        <div className="vehicle-card-title">{v.marca} {v.modelo}</div>
        <div className="vehicle-card-sub">{v.anio} · {v.color} · {v.placa}</div>
        <div className="vehicle-card-price">{v.moneda} {v.precio.toLocaleString('es-BO')}</div>
        <div className="vehicle-card-meta">
          <div className="vehicle-meta-item">⛽ {v.combustible}</div>
          <div className="vehicle-meta-item">⚙️ {v.transmision}</div>
          <div className="vehicle-meta-item">📏 {v.kilometraje.toLocaleString()} km</div>
        </div>
      </div>
    </div>
  );
}

function VehicleTableRow({ v, onView, onEdit }) {
  return (
    <tr>
      <td>
        <div className="cell-bold">{v.marca} {v.modelo}</div>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{v.placa}</div>
      </td>
      <td>{v.anio}</td>
      <td>{v.color}</td>
      <td className="cell-mono">{(v.kilometraje / 1000).toFixed(0)}k km</td>
      <td><strong style={{ color: '#1d6aff' }}>Bs {v.precio.toLocaleString()}</strong></td>
      <td><VehicleStatusBadge estado={v.estado} /></td>
      <td className="col-actions">
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={onView}>Ver</button>
          <button className="btn btn-secondary btn-sm" onClick={onEdit}>Editar</button>
        </div>
      </td>
    </tr>
  );
}

function VehicleModal({ vehiculo, onClose, navigate }) {
  const [activeTab, setActiveTab] = useState('info');

  if (!vehiculo) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div>
            <div className="modal-title">{vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}</div>
            <div className="modal-subtitle">{vehiculo.placa} · {vehiculo.chasis}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="tabs" style={{ padding: '0 24px' }}>
          {['info', 'fotos', 'historial'].map(t => (
            <div
              key={t}
              className={`tab-item${activeTab === t ? ' active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'info' ? '📋 Información' : t === 'fotos' ? '📷 Fotos' : '🕐 Historial'}
            </div>
          ))}
        </div>

        <div className="modal-body">
          {activeTab === 'info' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '80px' }}>🚗</span>
                <div>
                  <span className={`badge ${
                    vehiculo.estado === 'Disponible' ? 'badge-green' :
                    vehiculo.estado === 'Reservado' ? 'badge-amber' : 'badge-navy'
                  }`}>
                    {vehiculo.estado}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                {[
                  { label: 'Marca', value: vehiculo.marca },
                  { label: 'Modelo', value: vehiculo.modelo },
                  { label: 'Año', value: vehiculo.anio },
                  { label: 'Color', value: vehiculo.color },
                  { label: 'Combustible', value: vehiculo.combustible },
                  { label: 'Transmisión', value: vehiculo.transmision },
                  { label: 'Kilometraje', value: `${vehiculo.kilometraje.toLocaleString()} km` },
                  { label: 'Placa', value: vehiculo.placa },
                  { label: 'N° de Chasis', value: vehiculo.chasis, mono: true },
                  { label: 'Precio', value: `${vehiculo.moneda} ${vehiculo.precio.toLocaleString()}`, highlight: true },
                ].map(f => (
                  <div key={f.label} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{f.label}</div>
                    <div style={{
                      fontWeight: 600,
                      color: f.highlight ? '#1d6aff' : '#0f172a',
                      fontFamily: f.mono ? 'JetBrains Mono, monospace' : 'inherit',
                      fontSize: f.mono ? '12px' : '14px',
                    }}>
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>

              {vehiculo.descripcion && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descripción</div>
                  <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>{vehiculo.descripcion}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fotos' && (
            <div className="empty-state" style={{ paddingTop: '40px' }}>
              <div className="empty-icon">📷</div>
              <div className="empty-title">Sin fotos cargadas</div>
              <div className="empty-desc">Agrega fotografías del vehículo para mostrarlas a los compradores.</div>
              <button className="btn btn-secondary">
                📤 Subir fotos
              </button>
            </div>
          )}

          {activeTab === 'historial' && (
            <div>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot green">✓</div>
                  <div className="timeline-content">
                    <div className="timeline-text">Vehículo registrado en inventario</div>
                    <div className="timeline-time">Carlos Mendoza · {vehiculo.registradoEn}</div>
                  </div>
                </div>
                {vehiculo.estado === 'Reservado' && (
                  <div className="timeline-item">
                    <div className="timeline-dot amber">📋</div>
                    <div className="timeline-content">
                      <div className="timeline-text">Reserva generada para Luciana Vargas</div>
                      <div className="timeline-time">Luis Quispe · 2026-10-15</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
          {vehiculo.estado === 'Disponible' && (
            <>
              <button className="btn btn-secondary" onClick={() => navigate(RUTAS.RESERVAS)}>
                📋 Crear reserva
              </button>
              <button className="btn btn-primary" onClick={() => navigate(RUTAS.VENTAS)}>
                💰 Registrar venta
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NuevoVehiculoModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    marca: '', modelo: '', anio: '', color: '', combustible: 'Gasolina',
    transmision: 'Manual', kilometraje: '', placa: '', chasis: '',
    precio: '', moneda: 'Bs', descripcion: '', estado: 'Disponible',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.marca) e.marca = 'La marca es requerida';
    if (!form.modelo) e.modelo = 'El modelo es requerido';
    if (!form.anio || form.anio < 1990 || form.anio > 2030) e.anio = 'Año inválido (1990–2030)';
    if (!form.precio || form.precio <= 0) e.precio = 'El precio debe ser mayor a 0';
    if (!form.placa) e.placa = 'La placa es requerida';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (onSave) {
      onSave({
        ...form,
        id: Date.now(),
        precio: parseFloat(form.precio),
        anio: parseInt(form.anio, 10),
        kilometraje: parseInt(form.kilometraje, 10) || 0,
        fotos: ['🚗'],
        registradoEn: new Date().toISOString().split('T')[0],
      });
    }
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  if (saved) return (
    <div className="modal-overlay">
      <div className="modal" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          Vehículo registrado
        </div>
        <div style={{ color: '#64748b', fontSize: '14px' }}>
          {form.marca} {form.modelo} {form.anio} ha sido agregado al inventario.
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div>
            <div className="modal-title">Registrar nuevo vehículo</div>
            <div className="modal-subtitle">Completa los datos del vehículo para agregarlo al inventario</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="demo-notice">
            <span>💡</span>
            <span>En producción, este formulario se conecta al microservicio <strong>AutoGestion.Inventario</strong> con cabecera <code>X-Tenant-Id</code>.</span>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="v-marca">Marca <span className="required">*</span></label>
              <input id="v-marca" className={`form-control${errors.marca ? ' error' : ''}`} value={form.marca} onChange={e => setForm(f => ({...f, marca: e.target.value}))} placeholder="Toyota, Nissan…" />
              {errors.marca && <div className="form-error">⚠ {errors.marca}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="v-modelo">Modelo <span className="required">*</span></label>
              <input id="v-modelo" className={`form-control${errors.modelo ? ' error' : ''}`} value={form.modelo} onChange={e => setForm(f => ({...f, modelo: e.target.value}))} placeholder="Hilux, Frontier…" />
              {errors.modelo && <div className="form-error">⚠ {errors.modelo}</div>}
            </div>
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label" htmlFor="v-anio">Año <span className="required">*</span></label>
              <input id="v-anio" type="number" className={`form-control${errors.anio ? ' error' : ''}`} value={form.anio} onChange={e => setForm(f => ({...f, anio: e.target.value}))} placeholder="2021" min="1990" max="2030" />
              {errors.anio && <div className="form-error">⚠ {errors.anio}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="v-color">Color</label>
              <input id="v-color" className="form-control" value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} placeholder="Blanco, Negro…" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="v-km">Kilometraje</label>
              <input id="v-km" type="number" className="form-control" value={form.kilometraje} onChange={e => setForm(f => ({...f, kilometraje: e.target.value}))} placeholder="45000" min="0" />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="v-comb">Combustible</label>
              <select id="v-comb" className="form-control" value={form.combustible} onChange={e => setForm(f => ({...f, combustible: e.target.value}))}>
                <option>Gasolina</option>
                <option>Diésel</option>
                <option>Eléctrico</option>
                <option>Híbrido</option>
                <option>GNV</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="v-trans">Transmisión</label>
              <select id="v-trans" className="form-control" value={form.transmision} onChange={e => setForm(f => ({...f, transmision: e.target.value}))}>
                <option>Manual</option>
                <option>Automática</option>
                <option>CVT</option>
              </select>
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="v-placa">Placa <span className="required">*</span></label>
              <input id="v-placa" className={`form-control${errors.placa ? ' error' : ''}`} value={form.placa} onChange={e => setForm(f => ({...f, placa: e.target.value}))} placeholder="1234-TAR" />
              {errors.placa && <div className="form-error">⚠ {errors.placa}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="v-chasis">Número de chasis</label>
              <input id="v-chasis" className="form-control cell-mono" value={form.chasis} onChange={e => setForm(f => ({...f, chasis: e.target.value}))} placeholder="JTMBH3FV4…" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="v-precio">Precio <span className="required">*</span></label>
              <input id="v-precio" type="number" className={`form-control${errors.precio ? ' error' : ''}`} value={form.precio} onChange={e => setForm(f => ({...f, precio: e.target.value}))} placeholder="65000" min="0" />
              {errors.precio && <div className="form-error">⚠ {errors.precio}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="v-moneda">Moneda</label>
              <select id="v-moneda" className="form-control" value={form.moneda} onChange={e => setForm(f => ({...f, moneda: e.target.value}))}>
                <option value="Bs">Bs (Boliviano)</option>
                <option value="USD">USD (Dólar)</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="v-desc">Descripción</label>
            <textarea id="v-desc" className="form-control" value={form.descripcion} onChange={e => setForm(f => ({...f, descripcion: e.target.value}))} placeholder="Estado general, accesorios, observaciones…" rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="v-estado">Estado inicial</label>
            <select id="v-estado" className="form-control" value={form.estado} onChange={e => setForm(f => ({...f, estado: e.target.value}))}>
              <option>Disponible</option>
              <option>Reservado</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>
            💾 Guardar vehículo
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InventarioPage() {
  const { navigate, currentRoute, routeParams } = useApp();
  const [vehiculos, setVehiculos] = useState(DEMO_VEHICULOS);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterMarca, setFilterMarca] = useState('Todas');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [showNuevo, setShowNuevo] = useState(currentRoute === RUTAS.VEHICULO_NUEVO || !!routeParams?.nuevo);

  useEffect(() => {
    if (currentRoute === RUTAS.VEHICULO_NUEVO || routeParams?.nuevo) {
      setShowNuevo(true);
    }
    if (routeParams?.vehiculoId) {
      const v = vehiculos.find(x => x.id === routeParams.vehiculoId);
      if (v) setSelectedVehiculo(v);
    }
  }, [currentRoute, routeParams, vehiculos]);

  const filtered = vehiculos.filter(v => {
    const q = search.toLowerCase();
    const matchQ = !q || `${v.marca} ${v.modelo} ${v.placa} ${v.chasis}`.toLowerCase().includes(q);
    const matchE = filterEstado === 'Todos' || v.estado === filterEstado;
    const matchM = filterMarca === 'Todas' || v.marca === filterMarca;
    return matchQ && matchE && matchM;
  });

  const stats = {
    total: vehiculos.length,
    disponibles: vehiculos.filter(v => v.estado === 'Disponible').length,
    reservados: vehiculos.filter(v => v.estado === 'Reservado').length,
    vendidos: vehiculos.filter(v => v.estado === 'Vendido').length,
  };

  return (
    <div>
      {/* Estadísticas rápidas */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: stats.total, color: '#1d6aff', bg: '#eff6ff' },
          { label: 'Disponibles', value: stats.disponibles, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Reservados', value: stats.reservados, color: '#d97706', bg: '#fef3c7' },
          { label: 'Vendidos', value: stats.vendidos, color: '#2256a8', bg: '#dbeafe' },
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg,
            color: s.color,
            borderRadius: '10px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '14px',
          }}>
            <strong style={{ fontSize: '20px' }}>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Page header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>Inventario de vehículos</h2>
          <p>{filtered.length} vehículo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="page-header-actions">
          <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '7px 12px',
                background: viewMode === 'table' ? '#f1f5f9' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                borderRight: '1px solid #e2e8f0',
              }}
              title="Vista tabla"
            >
              ☰
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '7px 12px',
                background: viewMode === 'grid' ? '#f1f5f9' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              title="Vista tarjetas"
            >
              ⊞
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowNuevo(true)}>
            + Nuevo vehículo
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="search-filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por marca, modelo, placa o chasis…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
          {ESTADOS.map(e => <option key={e}>{e}</option>)}
        </select>
        <select className="filter-select" value={filterMarca} onChange={e => setFilterMarca(e.target.value)}>
          <option value="Todas">Todas las marcas</option>
          {MARCAS.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🚗</div>
            <div className="empty-title">Sin resultados</div>
            <div className="empty-desc">No se encontraron vehículos con esos filtros. Intenta con otros criterios.</div>
            <button className="btn btn-secondary" onClick={() => { setSearch(''); setFilterEstado('Todos'); setFilterMarca('Todas'); }}>
              Limpiar filtros
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="vehicle-grid">
          {filtered.map(v => (
            <VehicleCard key={v.id} v={v} onView={() => setSelectedVehiculo(v)} />
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Vehículo</th>
                  <th>Año</th>
                  <th>Color</th>
                  <th>Km</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <VehicleTableRow
                    key={v.id}
                    v={v}
                    onView={() => setSelectedVehiculo(v)}
                    onEdit={() => setSelectedVehiculo(v)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modales */}
      {selectedVehiculo && (
        <VehicleModal
          vehiculo={selectedVehiculo}
          onClose={() => setSelectedVehiculo(null)}
          navigate={navigate}
        />
      )}
      {showNuevo && (
        <NuevoVehiculoModal
          onClose={() => {
            setShowNuevo(false);
            if (currentRoute === RUTAS.VEHICULO_NUEVO) navigate(RUTAS.INVENTARIO);
          }}
          onSave={(newV) => {
            setVehiculos(vs => [newV, ...vs]);
          }}
        />
      )}
    </div>
  );
}
