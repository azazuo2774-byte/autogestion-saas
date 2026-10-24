import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_PLANES } from '../data/demo';

export default function AdminPlanes() {
  const { navigate } = useApp();
  const [planes, setPlanes] = useState(DEMO_PLANES);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: 0,
    descripcion: '',
    duracionDias: 30,
    destacado: false,
    disponible: true,
  });

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      nombre: plan.nombre,
      precio: plan.precio,
      descripcion: plan.descripcion,
      duracionDias: plan.duracionDias || 30,
      destacado: !!plan.destacado,
      disponible: plan.disponible !== false,
    });
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingPlan(null);
    setFormData({
      nombre: '',
      precio: 0,
      descripcion: '',
      duracionDias: 30,
      destacado: false,
      disponible: true,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setPlanes(ps => ps.filter(p => p.id !== id));
  };

  const handleSave = (e) => {
    e?.preventDefault();
    if (!formData.nombre) return;
    if (editingPlan) {
      setPlanes(ps => ps.map(p => p.id === editingPlan.id ? {
        ...p,
        ...formData,
        precio: parseFloat(formData.precio) || 0,
        duracionDias: parseInt(formData.duracionDias, 10) || 30,
      } : p));
    } else {
      const nuevo = {
        id: Date.now(),
        ...formData,
        precio: parseFloat(formData.precio) || 0,
        duracionDias: parseInt(formData.duracionDias, 10) || 30,
        caracteristicas: [
          { nombre: 'Acceso a inventario', activo: true },
          { nombre: 'Gestión de clientes', activo: true },
          { nombre: 'Registro de ventas', activo: true },
        ],
      };
      setPlanes(ps => [...ps, nuevo]);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Planes</h1>
          <p className="page-subtitle">Administración de planes de suscripción SaaS</p>
        </div>
        <button className="btn btn-primary" onClick={handleNew}>
          + Nuevo Plan
        </button>
      </div>

      <div className="demo-notice">
        <span>🎯</span>
        <span>Conectado al catálogo de planes del microservicio <strong>AutoGestion.Administrador</strong>.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {planes.map(plan => (
          <div
            key={plan.id}
            className="card"
            style={{
              border: plan.destacado ? '2px solid #1d6aff' : '1px solid #e2e8f0',
              position: 'relative',
            }}
          >
            {plan.destacado && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '20px',
                background: '#1d6aff',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                Recomendado
              </div>
            )}
            <div className="card-header">
              <div className="card-title">{plan.nombre}</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#1d6aff' }}>
                Bs {plan.precio}
                <span style={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>/mes</span>
              </div>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                {plan.descripcion}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plan.caracteristicas?.map((carac, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <span style={{ color: carac.activo ? '#16a34a' : '#cbd5e1' }}>
                      {carac.activo ? '✓' : '✗'}
                    </span>
                    <span style={{ color: carac.activo ? '#475569' : '#94a3b8' }}>
                      {carac.nombre}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-footer">
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => handleEdit(plan)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ color: '#dc2626' }}
                  onClick={() => handleDelete(plan.id)}
                  title="Eliminar plan"
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Nombre del Plan <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nombre}
                    onChange={e => setFormData(f => ({ ...f, nombre: e.target.value }))}
                    placeholder="Ej: Profesional"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio Mensual (Bs) <span className="required">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.precio}
                    onChange={e => setFormData(f => ({ ...f, precio: e.target.value }))}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción <span className="required">*</span></label>
                  <textarea
                    className="form-control"
                    value={formData.descripcion}
                    onChange={e => setFormData(f => ({ ...f, descripcion: e.target.value }))}
                    placeholder="Descripción breve del plan..."
                    rows={3}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duración (días) <span className="required">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.duracionDias}
                    onChange={e => setFormData(f => ({ ...f, duracionDias: e.target.value }))}
                    placeholder="30"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.destacado}
                      onChange={e => setFormData(f => ({ ...f, destacado: e.target.checked }))}
                      style={{ marginRight: '8px' }}
                    />
                    Plan destacado (recomendado)
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-control"
                    value={formData.disponible ? 'activo' : 'inactivo'}
                    onChange={e => setFormData(f => ({ ...f, disponible: e.target.value === 'activo' }))}
                  >
                    <option value="activo">Activo (disponible)</option>
                    <option value="inactivo">Inactivo (no disponible)</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
