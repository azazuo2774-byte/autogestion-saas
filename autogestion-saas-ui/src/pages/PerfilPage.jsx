import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USER, DEMO_TENANT } from '../data/demo';

export default function PerfilPage() {
  const { user, tenant } = useApp();
  const [activeTab, setActiveTab] = useState('perfil');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
  });
  const [pwForm, setPwForm] = useState({ actual: '', nueva: '', confirmar: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSuccess, setPwSuccess] = useState(false);

  const handlePwChange = () => {
    const e = {};
    if (!pwForm.actual) e.actual = 'Ingresa tu contraseña actual';
    if (pwForm.nueva.length < 8) e.nueva = 'La nueva contraseña debe tener al menos 8 caracteres';
    if (pwForm.nueva !== pwForm.confirmar) e.confirmar = 'Las contraseñas no coinciden';
    setPwErrors(e);
    if (Object.keys(e).length === 0) {
      setPwSuccess(true);
      setPwForm({ actual: '', nueva: '', confirmar: '' });
      setTimeout(() => setPwSuccess(false), 3000);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Mi Perfil</h2>
          <p>Gestiona tu información personal y de acceso</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Tarjeta de perfil */}
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', paddingTop: '32px' }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #163568, #1d6aff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '28px',
              margin: '0 auto 16px',
              boxShadow: '0 0 20px rgba(29,106,255,0.3)',
            }}>
              {user?.initials || '?'}
            </div>
            <div style={{ fontWeight: 700, fontSize: '18px', color: '#0f172a', marginBottom: '4px' }}>
              {user?.nombre}
            </div>
            <span className="badge badge-navy no-dot" style={{ marginBottom: '12px' }}>
              {user?.rol}
            </span>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{user?.email}</div>
            {tenant && (
              <div style={{ marginTop: '12px', padding: '10px', background: '#f0f6ff', borderRadius: '8px', fontSize: '12px', color: '#2256a8' }}>
                🏢 {tenant.nombre}<br />
                <span style={{ color: '#94a3b8' }}>Tenant #{tenant.id}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs de contenido */}
        <div>
          <div className="tabs">
            <div className={`tab-item${activeTab === 'perfil' ? ' active' : ''}`} onClick={() => setActiveTab('perfil')}>👤 Información</div>
            <div className={`tab-item${activeTab === 'seguridad' ? ' active' : ''}`} onClick={() => setActiveTab('seguridad')}>🔒 Seguridad</div>
          </div>

          {activeTab === 'perfil' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Datos personales</div>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(e => !e)}>
                  {editMode ? 'Cancelar' : '✏️ Editar'}
                </button>
              </div>
              <div className="card-body">
                {editMode ? (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Nombre completo <span className="required">*</span></label>
                      <input className="form-control" value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Correo electrónico <span className="required">*</span></label>
                      <input type="email" className="form-control" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                    </div>
                    <div className="alert alert-info" style={{ marginBottom: '16px' }}>
                      <span className="alert-icon">ℹ</span>
                      <div className="alert-content">El correo se usa para el inicio de sesión. Contacta al administrador para cambiarlo.</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => setEditMode(false)}>💾 Guardar cambios</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { label: 'Nombre completo', value: user?.nombre },
                      { label: 'Correo electrónico', value: user?.email },
                      { label: 'Rol en el sistema', value: user?.rol },
                      { label: 'Autoventa / Tenant', value: tenant ? `${tenant.nombre} (#${tenant.id})` : 'N/A' },
                    ].map(f => (
                      <div key={f.label} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                        <div style={{ width: '140px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>{f.label}</div>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Cambiar contraseña</div>
              </div>
              <div className="card-body">
                {pwSuccess && (
                  <div className="alert alert-success" style={{ marginBottom: '16px' }}>
                    <span className="alert-icon">✓</span>
                    <div className="alert-content"><strong>Contraseña actualizada</strong> correctamente.</div>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Contraseña actual <span className="required">*</span></label>
                  <input type="password" className={`form-control${pwErrors.actual ? ' error' : ''}`} value={pwForm.actual} onChange={e => setPwForm(f => ({...f, actual: e.target.value}))} placeholder="••••••••" />
                  {pwErrors.actual && <div className="form-error">⚠ {pwErrors.actual}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Nueva contraseña <span className="required">*</span></label>
                  <input type="password" className={`form-control${pwErrors.nueva ? ' error' : ''}`} value={pwForm.nueva} onChange={e => setPwForm(f => ({...f, nueva: e.target.value}))} placeholder="Mínimo 8 caracteres" />
                  {pwErrors.nueva && <div className="form-error">⚠ {pwErrors.nueva}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmar nueva contraseña <span className="required">*</span></label>
                  <input type="password" className={`form-control${pwErrors.confirmar ? ' error' : ''}`} value={pwForm.confirmar} onChange={e => setPwForm(f => ({...f, confirmar: e.target.value}))} placeholder="••••••••" />
                  {pwErrors.confirmar && <div className="form-error">⚠ {pwErrors.confirmar}</div>}
                </div>
                <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                  <span className="alert-icon">⚠</span>
                  <div className="alert-content">La contraseña se almacena con hash seguro (PasswordHasher de ASP.NET Core Identity) en el microservicio Administrador.</div>
                </div>
                <button className="btn btn-primary" onClick={handlePwChange}>🔒 Actualizar contraseña</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
