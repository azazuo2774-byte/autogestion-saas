import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_VENTAS, DEMO_VEHICULOS, DEMO_CLIENTES } from '../data/demo';

function NuevaVentaModal({ onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [form, setForm] = useState({ precio: '', moneda: 'Bs', metodoPago: 'Efectivo', nota: '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const vehiculosDisponibles = DEMO_VEHICULOS.filter(v => v.estado === 'Disponible' || v.estado === 'Reservado');

  const validate = () => {
    const e = {};
    if (!form.precio || parseFloat(form.precio) <= 0) e.precio = 'El precio debe ser mayor a 0';
    return e;
  };

  const handleConfirm = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (onSave) {
      onSave({
        id: Date.now(),
        vehiculoId: selectedVehiculo?.id,
        vehiculo: `${selectedVehiculo?.marca} ${selectedVehiculo?.modelo} ${selectedVehiculo?.anio}`,
        clienteId: selectedCliente?.id,
        cliente: selectedCliente?.nombre,
        precioFinal: parseFloat(form.precio),
        moneda: form.moneda,
        estado: 'Completada',
        fecha: new Date().toISOString().split('T')[0],
        reservaId: null,
        vendedor: 'Carlos Mendoza',
        metodoPago: form.metodoPago,
      });
    }
    setSaved(true);
    setTimeout(onClose, 1400);
  };

  if (saved) return (
    <div className="modal-overlay">
      <div className="modal" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉</div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>¡Venta registrada!</div>
        <div style={{ color: '#64748b', fontSize: '14px' }}>
          {selectedVehiculo?.marca} {selectedVehiculo?.modelo} vendido a {selectedCliente?.nombre} por {form.moneda} {parseFloat(form.precio).toLocaleString()}.
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div>
            <div className="modal-title">Registrar nueva venta</div>
            <div className="modal-subtitle">Paso {step} de 4 — {['Vehículo', 'Cliente', 'Precio y pago', 'Confirmar'][step-1]}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '0 24px 16px', display: 'flex', gap: '8px' }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: s <= step ? '#16a34a' : '#e2e8f0', transition: 'background 300ms' }} />
          ))}
        </div>

        <div className="modal-body">
          {step === 1 && (
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Selecciona el vehículo a vender. Se incluyen los disponibles y reservados.</p>
              {vehiculosDisponibles.map(v => (
                <div
                  key={v.id}
                  onClick={() => { setSelectedVehiculo(v); setForm(f => ({...f, precio: v.precio.toString()})); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px',
                    border: `2px solid ${selectedVehiculo?.id === v.id ? '#16a34a' : '#e2e8f0'}`,
                    borderRadius: '10px', marginBottom: '8px', cursor: 'pointer',
                    background: selectedVehiculo?.id === v.id ? '#f0fdf4' : 'white',
                    transition: 'all 150ms',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>🚗</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{v.marca} {v.modelo} {v.anio}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {v.placa} · Precio base: Bs {v.precio.toLocaleString()}
                      {v.estado === 'Reservado' && <span className="badge badge-amber" style={{ marginLeft: '8px' }}>Reservado</span>}
                    </div>
                  </div>
                  {selectedVehiculo?.id === v.id && <span style={{ color: '#16a34a', fontSize: '20px' }}>✓</span>}
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Selecciona el cliente comprador.</p>
              {DEMO_CLIENTES.filter(c => c.estado === 'Activo').map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCliente(c)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px',
                    border: `2px solid ${selectedCliente?.id === c.id ? '#16a34a' : '#e2e8f0'}`,
                    borderRadius: '10px', marginBottom: '8px', cursor: 'pointer',
                    background: selectedCliente?.id === c.id ? '#f0fdf4' : 'white',
                    transition: 'all 150ms',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #2256a8, #1d6aff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                    {c.nombre.split(' ').slice(0,2).map(w=>w[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.nombre}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>📞 {c.telefono}</div>
                  </div>
                  {selectedCliente?.id === c.id && <span style={{ color: '#16a34a', fontSize: '20px' }}>✓</span>}
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#15803d', fontWeight: 600 }}>
                  🚗 {selectedVehiculo?.marca} {selectedVehiculo?.modelo} · 👤 {selectedCliente?.nombre}
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Precio final <span className="required">*</span></label>
                  <input type="number" className={`form-control${errors.precio ? ' error' : ''}`} value={form.precio} onChange={e => setForm(f => ({...f, precio: e.target.value}))} placeholder="65000" min="0" />
                  {errors.precio && <div className="form-error">⚠ {errors.precio}</div>}
                  <div className="form-hint">Precio base del vehículo: Bs {selectedVehiculo?.precio.toLocaleString()}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Moneda</label>
                  <select className="form-control" value={form.moneda} onChange={e => setForm(f => ({...f, moneda: e.target.value}))}>
                    <option value="Bs">Bs (Boliviano)</option>
                    <option value="USD">USD (Dólar)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Método de pago</label>
                <select className="form-control" value={form.metodoPago} onChange={e => setForm(f => ({...f, metodoPago: e.target.value}))}>
                  <option>Efectivo</option>
                  <option>Transferencia bancaria</option>
                  <option>Cheque</option>
                  <option>Financiamiento</option>
                  <option>Pago mixto</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notas adicionales</label>
                <textarea className="form-control" value={form.nota} onChange={e => setForm(f => ({...f, nota: e.target.value}))} placeholder="Observaciones sobre la venta…" rows={3} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="alert alert-info" style={{ marginBottom: '20px' }}>
                <span className="alert-icon">ℹ</span>
                <div className="alert-content">
                  <strong>Confirmar venta</strong>
                  El vehículo pasará a estado <strong>Vendido</strong> y no podrá revertirse fácilmente.
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Vehículo', value: `${selectedVehiculo?.marca} ${selectedVehiculo?.modelo} ${selectedVehiculo?.anio}` },
                  { label: 'Placa', value: selectedVehiculo?.placa },
                  { label: 'Cliente', value: selectedCliente?.nombre },
                  { label: 'Precio final', value: `${form.moneda} ${parseFloat(form.precio || 0).toLocaleString()}`, highlight: true },
                  { label: 'Método de pago', value: form.metodoPago },
                  { label: 'Notas', value: form.nota || '—' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{f.label}</span>
                    <strong style={{ fontSize: '13px', color: f.highlight ? '#16a34a' : '#0f172a' }}>{f.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}>
            {step > 1 ? '← Anterior' : 'Cancelar'}
          </button>
          {step < 4 ? (
            <button
              className="btn btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={(step === 1 && !selectedVehiculo) || (step === 2 && !selectedCliente)}
            >
              Siguiente →
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleConfirm}>
              💰 Confirmar venta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function VentaDetalleModal({ venta, onClose }) {
  if (!venta) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Comprobante de Venta</div>
            <div className="modal-subtitle">VTA-{String(venta.id).padStart(3, '0')}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🧾</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#16a34a' }}>
              {venta.moneda} {venta.precioFinal.toLocaleString()}
            </div>
            <span className={`badge ${venta.estado === 'Completada' ? 'badge-green' : venta.estado === 'Anulada' ? 'badge-red' : 'badge-amber'}`}>
              {venta.estado}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Vehículo</div>
              <strong style={{ color: '#0f172a', fontSize: '13px' }}>{venta.vehiculo}</strong>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Cliente</div>
              <strong style={{ color: '#0f172a', fontSize: '13px' }}>{venta.cliente}</strong>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Método de Pago</div>
              <div style={{ color: '#0f172a', fontSize: '13px' }}>{venta.metodoPago}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Vendedor</div>
              <div style={{ color: '#0f172a', fontSize: '13px' }}>{venta.vendedor}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Fecha</div>
              <div style={{ color: '#0f172a', fontSize: '13px' }}>{new Date(venta.fecha).toLocaleDateString('es-BO')}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Estado de Pago</div>
              <div style={{ color: '#16a34a', fontWeight: 600, fontSize: '13px' }}>Cancelado</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
          <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Imprimir comprobante</button>
        </div>
      </div>
    </div>
  );
}

export default function VentasPage() {
  const [ventas, setVentas] = useState(DEMO_VENTAS);
  const [showNueva, setShowNueva] = useState(false);
  const [showAnular, setShowAnular] = useState(null);
  const [selectedVenta, setSelectedVenta] = useState(null);

  const totalVendido = ventas.filter(v => v.estado === 'Completada').reduce((s, v) => s + v.precioFinal, 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Ventas</h2>
          <p>{ventas.length} venta{ventas.length !== 1 ? 's' : ''} registrada{ventas.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNueva(true)}>+ Nueva venta</button>
      </div>

      {/* Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total ventas', value: ventas.length, icon: '🏁', color: 'blue', bg: '#eff6ff' },
          { label: 'Ingresos (demo)', value: `Bs ${totalVendido.toLocaleString()}`, icon: '💰', color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Completadas', value: ventas.filter(v => v.estado === 'Completada').length, icon: '✅', color: '#16a34a', bg: '#dcfce7' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 40, height: 40, background: s.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ventas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <div className="empty-title">Sin ventas registradas</div>
            <div className="empty-desc">Cuando registres una venta, aparecerá aquí con todos sus detalles.</div>
            <button className="btn btn-primary" onClick={() => setShowNueva(true)}>+ Registrar primera venta</button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Historial de ventas</div>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vehículo</th>
                  <th>Cliente</th>
                  <th>Precio Final</th>
                  <th>Método</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map(v => (
                  <tr key={v.id}>
                    <td className="cell-mono">VTA-{String(v.id).padStart(3, '0')}</td>
                    <td>
                      <div className="cell-bold">{v.vehiculo}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Vendedor: {v.vendedor}</div>
                    </td>
                    <td>{v.cliente}</td>
                    <td><strong style={{ color: '#16a34a', fontSize: '16px' }}>Bs {v.precioFinal.toLocaleString()}</strong></td>
                    <td>{v.metodoPago}</td>
                    <td>{new Date(v.fecha).toLocaleDateString('es-BO')}</td>
                    <td>
                      <span className={`badge ${v.estado === 'Completada' ? 'badge-green' : v.estado === 'Anulada' ? 'badge-red' : 'badge-amber'}`}>
                        {v.estado}
                      </span>
                    </td>
                    <td className="col-actions">
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedVenta(v)}>Ver</button>
                        {v.estado === 'Completada' && (
                          <button className="btn btn-danger btn-sm" onClick={() => setShowAnular(v)}>Anular</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedVenta && (
        <VentaDetalleModal venta={selectedVenta} onClose={() => setSelectedVenta(null)} />
      )}

      {showNueva && (
        <NuevaVentaModal
          onClose={() => setShowNueva(false)}
          onSave={(nuevaV) => setVentas(vs => [nuevaV, ...vs])}
        />
      )}

      {showAnular && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div className="modal-title">Anular venta</div>
              <button className="modal-close" onClick={() => setShowAnular(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                <span className="alert-icon">⚠</span>
                <div className="alert-content">
                  <strong>Acción irreversible</strong>
                  Solo se puede anular si está autorizado según las políticas de la autoventa.
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                ¿Confirmas la anulación de la venta de <strong>{showAnular.vehiculo}</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAnular(null)}>Cancelar</button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setVentas(vs => vs.map(x => x.id === showAnular.id ? { ...x, estado: 'Anulada' } : x));
                  setShowAnular(null);
                }}
              >
                Anular venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
