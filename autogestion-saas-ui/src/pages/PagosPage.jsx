import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_PAGOS, DEMO_VENTAS } from '../data/demo';

export default function PagosPage() {
  const [pagos, setPagos] = useState(DEMO_PAGOS);
  const [showNuevo, setShowNuevo] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [form, setForm] = useState({ ventaId: '', monto: '', moneda: 'Bs', metodo: 'Efectivo', referencia: '', nota: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!form.monto || parseFloat(form.monto) <= 0) return;
    const nuevo = {
      id: Date.now(),
      ventaId: form.ventaId ? parseInt(form.ventaId, 10) : 1,
      monto: parseFloat(form.monto),
      moneda: form.moneda,
      metodo: form.metodo,
      referencia: form.referencia || `PAG-${Date.now().toString().slice(-4)}`,
      fecha: new Date().toISOString().split('T')[0],
      nota: form.nota,
    };
    setPagos(ps => [nuevo, ...ps]);
    setSaved(true);
    setTimeout(() => {
      setShowNuevo(false);
      setSaved(false);
      setForm({ ventaId: '', monto: '', moneda: 'Bs', metodo: 'Efectivo', referencia: '', nota: '' });
    }, 1200);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Pagos comerciales</h2>
          <p>{pagos.length} pago{pagos.length !== 1 ? 's' : ''} registrado{pagos.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNuevo(true)}>+ Registrar pago</button>
      </div>

      <div className="demo-notice">
        <span>💳</span>
        <span>Este módulo registra <strong>pagos de vehículos</strong>, no pagos de suscripción al SaaS. Son operaciones independientes.</span>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Venta vinculada</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Fecha</th>
                <th>Nota</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map(p => (
                <tr key={p.id}>
                  <td className="cell-mono">{p.referencia}</td>
                  <td>VTA-{String(p.ventaId).padStart(3,'0')}</td>
                  <td><strong style={{ color: '#16a34a', fontSize: '15px' }}>{p.moneda} {p.monto.toLocaleString()}</strong></td>
                  <td>{p.metodo}</td>
                  <td>{new Date(p.fecha).toLocaleDateString('es-BO')}</td>
                  <td style={{ color: '#64748b', fontStyle: 'italic' }}>{p.nota}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelectedPago(p)}>
                      👁 Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNuevo && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowNuevo(false)}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="modal-title">Registrar pago</div>
                <div className="modal-subtitle">Vincula un pago a una venta registrada</div>
              </div>
              <button className="modal-close" onClick={() => setShowNuevo(false)}>✕</button>
            </div>
            <div className="modal-body">
              {saved ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>💳</div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>Pago registrado</div>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Venta vinculada</label>
                    <select className="form-control" value={form.ventaId} onChange={e => setForm(f => ({...f, ventaId: e.target.value}))}>
                      <option value="">Selecciona una venta</option>
                      {DEMO_VENTAS.map(v => (
                        <option key={v.id} value={v.id}>VTA-{String(v.id).padStart(3,'0')} — {v.vehiculo}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Monto <span className="required">*</span></label>
                      <input type="number" className="form-control" value={form.monto} onChange={e => setForm(f => ({...f, monto: e.target.value}))} placeholder="46000" min="0" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Moneda</label>
                      <select className="form-control" value={form.moneda} onChange={e => setForm(f => ({...f, moneda: e.target.value}))}>
                        <option value="Bs">Bs (Boliviano)</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Método de pago</label>
                    <select className="form-control" value={form.metodo} onChange={e => setForm(f => ({...f, metodo: e.target.value}))}>
                      <option>Efectivo</option>
                      <option>Transferencia bancaria</option>
                      <option>Cheque</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Referencia</label>
                    <input className="form-control cell-mono" value={form.referencia} onChange={e => setForm(f => ({...f, referencia: e.target.value}))} placeholder="VTA-001-2026" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nota</label>
                    <textarea className="form-control" value={form.nota} onChange={e => setForm(f => ({...f, nota: e.target.value}))} rows={2} placeholder="Observaciones…" />
                  </div>
                </>
              )}
            </div>
            {!saved && (
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowNuevo(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSave}>💾 Guardar pago</button>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedPago && (
        <div className="modal-overlay" onClick={() => setSelectedPago(null)}>
          <div className="modal" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Recibo de Pago</div>
                <div className="modal-subtitle">{selectedPago.referencia}</div>
              </div>
              <button className="modal-close" onClick={() => setSelectedPago(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>💳</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#16a34a' }}>
                  {selectedPago.moneda} {selectedPago.monto.toLocaleString()}
                </div>
                <span className="badge badge-green">Procesado</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Venta Vinculada</div>
                  <strong>VTA-{String(selectedPago.ventaId).padStart(3, '0')}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Método</div>
                  <div>{selectedPago.metodo}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Fecha</div>
                  <div>{new Date(selectedPago.fecha).toLocaleDateString('es-BO')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Referencia</div>
                  <div className="cell-mono">{selectedPago.referencia}</div>
                </div>
              </div>
              {selectedPago.nota && (
                <div style={{ marginTop: '12px', padding: '12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '13px', color: '#475569' }}>
                  📝 {selectedPago.nota}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedPago(null)}>Cerrar</button>
              <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Imprimir recibo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
