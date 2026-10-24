import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_PLANES, DEMO_SUSCRIPCION } from '../data/demo';

export default function PlanesPage() {
  const { navigate, updateSuscripcion } = useApp();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showContratacion, setShowContratacion] = useState(false);
  const [contratado, setContratado] = useState(false);

  const handleContratar = (plan) => {
    setSelectedPlan(plan);
    setShowContratacion(true);
  };

  const handleConfirmar = () => {
    if (selectedPlan && updateSuscripcion) {
      updateSuscripcion(selectedPlan);
    }
    setContratado(true);
    setTimeout(() => {
      setShowContratacion(false);
      setContratado(false);
      navigate('suscripciones');
    }, 1500);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Planes disponibles</h2>
          <p>Elige el plan que mejor se adapta a tu autoventa</p>
        </div>
      </div>

      <div className="demo-notice">
        <span>⚠️</span>
        <span>Los precios mostrados son <strong>referenciales y de demostración</strong>. No representan tarifas definitivas ni cobros reales. La pasarela de pagos no está implementada en esta versión.</span>
      </div>

      <div className="plans-grid">
        {DEMO_PLANES.map(plan => (
          <div key={plan.id} className={`plan-card${plan.destacado ? ' featured' : ''}`}>
            {plan.destacado && <div className="plan-featured-badge">Más popular</div>}
            <div className="plan-name">{plan.nombre}</div>
            <div className="plan-desc">{plan.descripcion}</div>
            <div className="plan-price">
              {plan.precio === 0 ? (
                <span className="amount">Gratis</span>
              ) : (
                <>
                  <span className="currency">Bs</span>
                  <span className="amount">{plan.precio}</span>
                  <span className="period"> /mes</span>
                </>
              )}
            </div>

            <ul className="plan-features">
              {plan.caracteristicas.map(f => (
                <li key={f.nombre}>
                  <div className={`feat-icon ${f.activo ? 'feat-ok' : 'feat-no'}`}>
                    {f.activo ? '✓' : '✕'}
                  </div>
                  <span style={{ color: f.activo ? '#334155' : '#94a3b8' }}>{f.nombre}</span>
                </li>
              ))}
            </ul>

            <button
              className={`btn w-full ${plan.destacado ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'center' }}
              onClick={() => handleContratar(plan)}
            >
              {plan.precio === 0 ? 'Comenzar gratis' : `Contratar plan ${plan.nombre}`}
            </button>
          </div>
        ))}
      </div>

      {showContratacion && selectedPlan && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowContratacion(false)}>
          <div className="modal" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Contratar Plan {selectedPlan.nombre}</div>
                <div className="modal-subtitle">Confirma tu suscripción mensual</div>
              </div>
              <button className="modal-close" onClick={() => setShowContratacion(false)}>✕</button>
            </div>
            <div className="modal-body">
              {contratado ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '60px', marginBottom: '16px' }}>⭐</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>¡Suscripción activada!</div>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>Plan {selectedPlan.nombre} contratado exitosamente.</div>
                </div>
              ) : (
                <>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>Plan {selectedPlan.nombre}</span>
                      <span style={{ fontWeight: 800, color: '#1d6aff', fontSize: '18px' }}>
                        {selectedPlan.precio === 0 ? 'Gratis' : `Bs ${selectedPlan.precio}/mes`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#475569' }}>
                      <div>✓ Duración: 30 días</div>
                      <div>✓ Se activa inmediatamente</div>
                    </div>
                  </div>

                  <div className="alert alert-warning">
                    <span className="alert-icon">⚠</span>
                    <div className="alert-content">
                      <strong>Versión académica</strong>
                      Esta plataforma no procesa pagos reales. La contratación es solo demostrativa.
                    </div>
                  </div>
                </>
              )}
            </div>
            {!contratado && (
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowContratacion(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleConfirmar}>
                  ✓ Confirmar contratación
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

