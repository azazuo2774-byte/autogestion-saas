import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('autoventa'); // 'autoventa' | 'admin'
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = login(email, password, mode === 'admin');
    if (!result.ok) setError(result.error);
    setLoading(false);
  };

  const handleQuickLogin = (asAdmin = false) => {
    setLoading(true);
    setTimeout(() => {
      login('demo@autogestion.bo', 'demo1234', asAdmin);
      setLoading(false);
    }, 600);
  };

  const handleRecovery = (e) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setRecoverySent(true);
  };

  return (
    <div className="login-page">
      {/* Left — Branding */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">🚀</div>
          <div>
            <h1>AutoGestión SaaS</h1>
            <p>Plataforma para autoventas de Bolivia</p>
          </div>
        </div>

        <div className="login-hero">
          <h2>Administra tu<br />autoventa desde<br />un solo lugar</h2>
          <p>
            Inventario, clientes, reservas y ventas de vehículos,
            organizados digitalmente para tu negocio en Tarija y todo Bolivia.
          </p>
        </div>

        <div className="login-features">
          <div className="login-feature-item">
            <div className="login-feature-icon">🚗</div>
            <div className="login-feature-text">
              <strong>Inventario inteligente</strong>
              <span>Gestiona tus vehículos con fotos y ficha completa</span>
            </div>
          </div>
          <div className="login-feature-item">
            <div className="login-feature-icon">👥</div>
            <div className="login-feature-text">
              <strong>CRM para clientes</strong>
              <span>Seguimiento comercial de compradores interesados</span>
            </div>
          </div>
          <div className="login-feature-item">
            <div className="login-feature-icon">📊</div>
            <div className="login-feature-text">
              <strong>Reportes y métricas</strong>
              <span>Visualiza el rendimiento de tu negocio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="login-right">
        <div className="login-form-card">
          {/* Mode switch */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '28px',
          }}>
            <button
              onClick={() => setMode('autoventa')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 200ms',
                background: mode === 'autoventa' ? 'white' : 'transparent',
                color: mode === 'autoventa' ? '#0f172a' : '#64748b',
                boxShadow: mode === 'autoventa' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              🏢 Autoventa
            </button>
            <button
              onClick={() => setMode('admin')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 200ms',
                background: mode === 'admin' ? 'white' : 'transparent',
                color: mode === 'admin' ? '#0f172a' : '#64748b',
                boxShadow: mode === 'admin' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              🛡️ Admin SaaS
            </button>
          </div>

          {!showRecovery ? (
            <>
              <h2 className="login-form-title">
                {mode === 'admin' ? 'Acceso Administrativo' : 'Bienvenido de vuelta'}
              </h2>
              <p className="login-form-sub">
                {mode === 'admin'
                  ? 'Ingresa al panel de administración general de AutoGestión SaaS.'
                  : 'Ingresa a tu panel de autoventa para gestionar tu negocio.'}
              </p>

              {/* Demo notice */}
              <div className="demo-notice">
                <span>🎯</span>
                <span>
                  <strong>Demostración:</strong> usa el botón de acceso rápido para explorar la plataforma.
                </span>
              </div>

              {error && (
                <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                  <span className="alert-icon">⚠</span>
                  <div className="alert-content">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">
                    Correo electrónico <span className="required">*</span>
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className={`form-control${error ? ' error' : ''}`}
                    placeholder="correo@autoventa.bo"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">
                    Contraseña <span className="required">*</span>
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    className={`form-control${error ? ' error' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="current-password"
                  />
                  <div className="form-hint" style={{ textAlign: 'right' }}>
                    <span
                      onClick={() => setShowRecovery(true)}
                      style={{ color: '#1d6aff', cursor: 'pointer', fontSize: '13px' }}
                    >
                      ¿Olvidaste tu contraseña?
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  style={{ justifyContent: 'center', padding: '12px', fontSize: '15px', marginBottom: '12px' }}
                  disabled={loading}
                >
                  {loading ? <span className="spinner" /> : 'Ingresar al sistema'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary w-full"
                  style={{ justifyContent: 'center', padding: '12px', fontSize: '14px' }}
                  onClick={() => handleQuickLogin(mode === 'admin')}
                  disabled={loading}
                >
                  ⚡ Acceso rápido (demo)
                </button>
              </form>

              <p style={{ marginTop: '24px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                ¿Nuevo en AutoGestión SaaS?{' '}
                <span style={{ color: '#1d6aff', cursor: 'pointer', fontWeight: 600 }}>
                  Contacta a un administrador
                </span>
              </p>
            </>
          ) : (
            /* Recovery screen */
            <>
              <h2 className="login-form-title">Recuperar contraseña</h2>
              <p className="login-form-sub">
                Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.
              </p>

              {recoverySent ? (
                <div className="alert alert-success">
                  <span className="alert-icon">✓</span>
                  <div className="alert-content">
                    <strong>Correo enviado</strong>
                    Revisa tu bandeja de entrada en {recoveryEmail} para continuar.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRecovery}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="recovery-email">
                      Correo electrónico <span className="required">*</span>
                    </label>
                    <input
                      id="recovery-email"
                      type="email"
                      className="form-control"
                      placeholder="correo@autoventa.bo"
                      value={recoveryEmail}
                      onChange={e => setRecoveryEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    style={{ justifyContent: 'center', padding: '12px' }}
                  >
                    Enviar instrucciones
                  </button>
                </form>
              )}

              <p style={{ marginTop: '16px', textAlign: 'center' }}>
                <span
                  onClick={() => { setShowRecovery(false); setRecoverySent(false); }}
                  style={{ color: '#1d6aff', cursor: 'pointer', fontSize: '14px' }}
                >
                  ← Volver al inicio de sesión
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
