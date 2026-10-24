import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_SUSCRIPCION, RUTAS } from '../data/demo';

export default function SuscripcionesPage() {
  const { suscripcion: ctxSub, renewSuscripcion, navigate } = useApp();
  const [activeTab, setActiveTab] = useState('actual');
  const [showRenovadoToast, setShowRenovadoToast] = useState(false);

  const sub = ctxSub || DEMO_SUSCRIPCION;

  const handleRenovar = () => {
    renewSuscripcion(30);
    setShowRenovadoToast(true);
    setTimeout(() => setShowRenovadoToast(false), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Mi Suscripción</h2>
          <p>Estado y detalles de tu plan activo</p>
        </div>
      </div>

      {showRenovadoToast && (
        <div className="alert alert-success" style={{ marginBottom: '16px' }}>
          <span className="alert-icon">✓</span>
          <div className="alert-content">
            <strong>¡Suscripción renovada!</strong> Se han añadido 30 días adicionales de vigencia a tu cuenta.
          </div>
        </div>
      )}

      <div className="tabs">
        <div className={`tab-item${activeTab === 'actual' ? ' active' : ''}`} onClick={() => setActiveTab('actual')}>📋 Suscripción actual</div>
        <div className={`tab-item${activeTab === 'historial' ? ' active' : ''}`} onClick={() => setActiveTab('historial')}>🕐 Historial</div>
      </div>

      {activeTab === 'actual' && (
        <div>
          {/* Estado principal */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>
                  ⭐
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    Plan {sub.planNombre}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span className="badge badge-green" style={{ fontSize: '13px', padding: '4px 10px' }}>
                      {sub.resultado}
                    </span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Estado: {sub.estado}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#1d6aff' }}>Bs 149</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>por mes (referencial)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="grid-2" style={{ marginBottom: '20px' }}>
            <div className="card">
              <div className="card-body">
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>PERÍODO DE VIGENCIA</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>Inicio</span>
                    <strong style={{ color: '#0f172a' }}>{new Date(sub.inicioUtc).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>Vencimiento</span>
                    <strong style={{ color: '#d97706' }}>{new Date(sub.vencimientoUtc).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>REGLA DE VIGENCIA</div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#15803d' }}>
                  inicio ≤ ahora UTC &lt; vencimiento<br />
                  AND estado = "Habilitada"
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                  Esta lógica se evalúa en el microservicio <strong>Administrador</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleRenovar}>🔄 Renovar suscripción (+30 días)</button>
            <button className="btn btn-secondary" onClick={() => navigate(RUTAS.PLANES)}>📦 Cambiar de plan</button>
          </div>
        </div>
      )}

      {activeTab === 'historial' && (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Inicio (UTC)</th>
                  <th>Vencimiento (UTC)</th>
                  <th>Estado</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="cell-bold">Profesional</td>
                  <td className="cell-mono">{new Date(DEMO_SUSCRIPCION.inicioUtc).toLocaleDateString('es-BO')}</td>
                  <td className="cell-mono">{new Date(DEMO_SUSCRIPCION.vencimientoUtc).toLocaleDateString('es-BO')}</td>
                  <td><span className="badge badge-green">Habilitada</span></td>
                  <td><span className="badge badge-green">Activa</span></td>
                </tr>
                <tr>
                  <td style={{ color: '#94a3b8' }}>Básico</td>
                  <td className="cell-mono" style={{ color: '#94a3b8' }}>01/09/2026</td>
                  <td className="cell-mono" style={{ color: '#94a3b8' }}>30/09/2026</td>
                  <td><span className="badge badge-gray">Vencida</span></td>
                  <td><span className="badge badge-gray">Vencida</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
