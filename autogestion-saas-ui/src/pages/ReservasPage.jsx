import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_RESERVAS, DEMO_VEHICULOS, DEMO_CLIENTES, RUTAS } from '../data/demo';

function ReservaCard({ reserva, onVer, onCancelar, onConvertir }) {
  const diasRestantes = Math.ceil((new Date(reserva.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24));
  const urgente = diasRestantes <= 3 && reserva.estado === 'Activa';

  return (
    <div style={{
      background: 'white',
      border: `1px solid ${urgente ? '#fde68a' : '#e2e8f0'}`,
      borderRadius: '12px',
      padding: '20px',
      boxShadow: urgente ? '0 0 0 2px #fef3c7' : '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      {urgente && (
        <div className="alert alert-warning" style={{ marginBottom: '12px', padding: '8px 12px' }}>
          <span className="alert-icon">⚠</span>
          <div>Reserva vence en {diasRestantes} día{diasRestantes !== 1 ? 's' : ''}</div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a', marginBottom: '4px' }}>
            {reserva.vehiculo}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>👤 {reserva.cliente}</div>
        </div>
        <span className={`badge ${
          reserva.estado === 'Activa' ? 'badge-amber' :
          reserva.estado === 'Convertida' ? 'badge-green' : 'badge-red'
        }`}>{reserva.estado}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {[
          { label: 'Fecha reserva', value: reserva.fechaReserva },
          { label: 'Vencimiento', value: reserva.fechaVencimiento },
          { label: 'Seña', value: `${reserva.moneda} ${reserva.senia.toLocaleString()}` },
          { label: 'Vendedor', value: reserva.vendedor },
        ].map(f => (
          <div key={f.label} style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</div>
            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px', marginTop: '2px' }}>{f.value}</div>
          </div>
        ))}
      </div>

      {reserva.notas && (
        <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', marginBottom: '12px' }}>
          💬 {reserva.notas}
        </p>
      )}

      {reserva.estado === 'Activa' && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={onConvertir}>
            💰 Convertir en venta
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onVer}>
            Ver detalle
          </button>
          <button className="btn btn-danger btn-sm" onClick={onCancelar}>
            ✕ Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

function NuevaReservaModal({ onClose, onSave, navigate }) {
  const [step, setStep] = useState(1); // 1=vehiculo, 2=cliente, 3=datos, 4=confirmar
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [form, setForm] = useState({ fechaVencimiento: '', senia: '', notas: '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const vehiculosDisponibles = DEMO_VEHICULOS.filter(v => v.estado === 'Disponible');

  const validate = () => {
    const e = {};
    if (!form.fechaVencimiento) e.fechaVencimiento = 'La fecha de vencimiento es requerida';
    return e;
  };

  const handleConfirm = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (onSave) {
      onSave({
        id: Date.now(),
        vehiculoId: selectedVehiculo?.id,
        vehiculo: `${selectedVehiculo?.marca} ${selectedVehiculo?.modelo} ${selectedVehiculo?.anio} — ${selectedVehiculo?.placa}`,
        clienteId: selectedCliente?.id,
        cliente: selectedCliente?.nombre,
        fechaReserva: new Date().toISOString().split('T')[0],
        fechaVencimiento: form.fechaVencimiento,
        senia: parseFloat(form.senia) || 0,
        moneda: 'Bs',
        estado: 'Activa',
        vendedor: 'Carlos Mendoza',
        notas: form.notas,
      });
    }
    setSaved(true);
    setTimeout(onClose, 1400);
  };

  if (saved) return (
    <div className="modal-overlay">
      <div className="modal" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>📋</div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Reserva registrada</div>
        <div style={{ color: '#64748b', fontSize: '14px' }}>
          {selectedVehiculo?.marca} {selectedVehiculo?.modelo} reservado para {selectedCliente?.nombre}.
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div>
            <div className="modal-title">Nueva reserva</div>
            <div className="modal-subtitle">Paso {step} de 4 — {['Seleccionar vehículo', 'Seleccionar cliente', 'Datos de reserva', 'Confirmar'][step-1]}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Progress */}
        <div style={{ padding: '0 24px 16px', display: 'flex', gap: '8px' }}>
          {[1,2,3,4].map(s => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: s <= step ? '#1d6aff' : '#e2e8f0',
                transition: 'background 300ms',
              }}
            />
          ))}
        </div>

        <div className="modal-body">
          {step === 1 && (
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                Selecciona el vehículo a reservar. Solo se muestran vehículos <strong>disponibles</strong>.
              </p>
              {vehiculosDisponibles.map(v => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehiculo(v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    border: `2px solid ${selectedVehiculo?.id === v.id ? '#1d6aff' : '#e2e8f0'}`,
                    borderRadius: '10px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    background: selectedVehiculo?.id === v.id ? '#eff6ff' : 'white',
                    transition: 'all 150ms',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>🚗</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{v.marca} {v.modelo} {v.anio}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{v.placa} · Bs {v.precio.toLocaleString()}</div>
                  </div>
                  {selectedVehiculo?.id === v.id && <span style={{ color: '#1d6aff', fontSize: '20px' }}>✓</span>}
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                Selecciona el cliente que realizará la reserva.
              </p>
              {DEMO_CLIENTES.filter(c => c.estado === 'Activo').map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCliente(c)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    border: `2px solid ${selectedCliente?.id === c.id ? '#1d6aff' : '#e2e8f0'}`,
                    borderRadius: '10px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    background: selectedCliente?.id === c.id ? '#eff6ff' : 'white',
                    transition: 'all 150ms',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2256a8, #1d6aff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '13px', flexShrink: 0,
                  }}>
                    {c.nombre.split(' ').slice(0,2).map(w=>w[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.nombre}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>📞 {c.telefono} · {c.ciudad}</div>
                  </div>
                  {selectedCliente?.id === c.id && <span style={{ color: '#1d6aff', fontSize: '20px' }}>✓</span>}
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ background: '#f0f6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#1e40af', fontWeight: 600, marginBottom: '4px' }}>
                  🚗 {selectedVehiculo?.marca} {selectedVehiculo?.modelo} {selectedVehiculo?.anio}
                </div>
                <div style={{ fontSize: '13px', color: '#3b82f6' }}>
                  👤 {selectedCliente?.nombre}
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Fecha de reserva</label>
                  <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} readOnly />
                  <div className="form-hint">Se usa la fecha actual automáticamente</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha de vencimiento <span className="required">*</span></label>
                  <input type="date" className={`form-control${errors.fechaVencimiento ? ' error' : ''}`} value={form.fechaVencimiento} onChange={e => setForm(f => ({...f, fechaVencimiento: e.target.value}))} />
                  {errors.fechaVencimiento && <div className="form-error">⚠ {errors.fechaVencimiento}</div>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Monto de seña (Bs)</label>
                <input type="number" className="form-control" value={form.senia} onChange={e => setForm(f => ({...f, senia: e.target.value}))} placeholder="5000" min="0" />
                <div className="form-hint">Opcional. Registro del monto entregado como señal.</div>
              </div>
              <div className="form-group">
                <label className="form-label">Notas adicionales</label>
                <textarea className="form-control" value={form.notas} onChange={e => setForm(f => ({...f, notas: e.target.value}))} placeholder="Observaciones sobre la reserva…" rows={3} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="alert alert-info" style={{ marginBottom: '20px' }}>
                <span className="alert-icon">ℹ</span>
                <div className="alert-content">
                  <strong>Confirmar reserva</strong>
                  Revisa los datos antes de registrar. El vehículo pasará a estado <strong>Reservado</strong>.
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Vehículo', value: `${selectedVehiculo?.marca} ${selectedVehiculo?.modelo} ${selectedVehiculo?.anio}` },
                  { label: 'Placa', value: selectedVehiculo?.placa },
                  { label: 'Cliente', value: selectedCliente?.nombre },
                  { label: 'Vencimiento', value: form.fechaVencimiento || 'No especificado' },
                  { label: 'Seña', value: form.senia ? `Bs ${parseInt(form.senia).toLocaleString()}` : 'Sin seña' },
                  { label: 'Notas', value: form.notas || '—' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{f.label}</span>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>{f.value}</strong>
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
              onClick={() => {
                if (step === 1 && !selectedVehiculo) return;
                if (step === 2 && !selectedCliente) return;
                setStep(s => s + 1);
              }}
              disabled={(step === 1 && !selectedVehiculo) || (step === 2 && !selectedCliente)}
            >
              Siguiente →
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleConfirm}>
              ✅ Confirmar reserva
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReservaDetalleModal({ reserva, onClose, onConvertir, onCancelar }) {
  if (!reserva) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Detalle de Reserva #{reserva.id}</div>
            <div className="modal-subtitle">{reserva.vehiculo}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Cliente</div>
              <strong style={{ color: '#0f172a' }}>{reserva.cliente}</strong>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Estado</div>
              <span className={`badge ${reserva.estado === 'Activa' ? 'badge-amber' : reserva.estado === 'Cancelada' ? 'badge-red' : 'badge-green'}`}>
                {reserva.estado}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Seña</div>
              <strong style={{ color: '#16a34a', fontSize: '15px' }}>{reserva.moneda} {reserva.senia.toLocaleString()}</strong>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Vendedor</div>
              <div>{reserva.vendedor}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Fecha Reserva</div>
              <div>{reserva.fechaReserva}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Fecha Vencimiento</div>
              <div style={{ color: '#d97706', fontWeight: 600 }}>{reserva.fechaVencimiento}</div>
            </div>
          </div>
          {reserva.notas && (
            <div style={{ marginTop: '12px', padding: '12px', background: '#fffbeb', borderRadius: '8px', fontSize: '13px', color: '#92400e' }}>
              💬 {reserva.notas}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
          {reserva.estado === 'Activa' && (
            <>
              <button className="btn btn-danger" onClick={() => { onClose(); onCancelar(reserva); }}>✕ Cancelar reserva</button>
              <button className="btn btn-primary" onClick={() => { onClose(); onConvertir(reserva); }}>💰 Convertir en venta</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReservasPage() {
  const { navigate } = useApp();
  const [reservas, setReservas] = useState(DEMO_RESERVAS);
  const [showNueva, setShowNueva] = useState(false);
  const [showCancelar, setShowCancelar] = useState(null);
  const [selectedReserva, setSelectedReserva] = useState(null);

  const activasCount = reservas.filter(r => r.estado === 'Activa').length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Reservas</h2>
          <p>{activasCount} reserva{activasCount !== 1 ? 's' : ''} activa{activasCount !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNueva(true)}>
          + Nueva reserva
        </button>
      </div>

      <div className="demo-notice">
        <span>💡</span>
        <span>Un vehículo solo puede tener una reserva activa a la vez. Al convertir en venta, la reserva se cierra automáticamente.</span>
      </div>

      {reservas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">Sin reservas activas</div>
            <div className="empty-desc">Cuando un cliente reserve un vehículo, aparecerá aquí.</div>
            <button className="btn btn-primary" onClick={() => setShowNueva(true)}>+ Crear primera reserva</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reservas.map(r => (
            <ReservaCard
              key={r.id}
              reserva={r}
              onVer={() => setSelectedReserva(r)}
              onConvertir={() => navigate(RUTAS.VENTAS)}
              onCancelar={() => setShowCancelar(r)}
            />
          ))}
        </div>
      )}

      {selectedReserva && (
        <ReservaDetalleModal
          reserva={selectedReserva}
          onClose={() => setSelectedReserva(null)}
          onConvertir={() => navigate(RUTAS.VENTAS)}
          onCancelar={(r) => setShowCancelar(r)}
        />
      )}

      {showNueva && (
        <NuevaReservaModal
          onClose={() => setShowNueva(false)}
          onSave={(nuevaR) => setReservas(rs => [nuevaR, ...rs])}
          navigate={navigate}
        />
      )}

      {showCancelar && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div className="modal-title">Cancelar reserva</div>
              <button className="modal-close" onClick={() => setShowCancelar(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                <span className="alert-icon">⚠</span>
                <div className="alert-content">
                  <strong>¿Confirmar cancelación?</strong>
                  El vehículo <strong>{showCancelar.vehiculo}</strong> volverá a estado Disponible.
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                Esta acción no se puede deshacer. La seña registrada no será procesada automáticamente.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowCancelar(null)}>No cancelar</button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setReservas(rs => rs.map(x => x.id === showCancelar.id ? { ...x, estado: 'Cancelada' } : x));
                  setShowCancelar(null);
                }}
              >
                Sí, cancelar reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
