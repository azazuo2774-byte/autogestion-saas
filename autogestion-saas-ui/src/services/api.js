// Conexión directa a microservicios (sin Gateway por ahora)
const ADMIN_BASE = 'http://localhost:5001';
const INVENTARIO_BASE = 'http://localhost:5002';
const CLIENTES_BASE = 'http://localhost:5003';
const VENTAS_BASE = 'http://localhost:5004';

// Headers comunes
const getHeaders = (tenantId) => ({
  'Content-Type': 'application/json',
  'X-Tenant-Id': tenantId?.toString() || '1'
});

// Servicios de Administrador (sin X-Tenant-Id para registro)
export const adminApi = {
  // Registro de tenant y usuario
  register: async (data) => {
    const response = await fetch(`${ADMIN_BASE}/api/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Login (simulado - en producción usaría endpoint real)
  login: async (email, password, asAdmin = false) => {
    if (asAdmin) {
      return { ok: true, user: { id: 0, nombre: 'Admin SaaS', email: 'admin@autogestion.bo', rol: 'Administrador SaaS', initials: 'AS' } };
    }
    // Simulación - en producción llamaría al endpoint de autenticación
    if (email && password.length >= 8) {
      return { ok: true, user: { id: 1, nombre: 'Usuario Demo', email, rol: 'Admin Autoventa', initials: 'UD' }, tenant: { id: 1, nombre: 'Autoventa Demo' } };
    }
    return { ok: false, error: 'Credenciales inválidas' };
  },

  // Planes
  getPlanes: async () => {
    const response = await fetch(`${ADMIN_BASE}/api/planes`);
    return response.json();
  },

  createPlan: async (data) => {
    const response = await fetch(`${ADMIN_BASE}/api/planes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updatePlan: async (id, data) => {
    const response = await fetch(`${ADMIN_BASE}/api/planes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  deletePlan: async (id) => {
    const response = await fetch(`${ADMIN_BASE}/api/planes/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  // Tenants
  getTenants: async () => {
    const response = await fetch(`${ADMIN_BASE}/api/tenants`);
    return response.json();
  },

  createTenant: async (data) => {
    const response = await fetch(`${ADMIN_BASE}/api/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Suscripciones
  getSuscripciones: async () => {
    const response = await fetch(`${ADMIN_BASE}/api/suscripciones`);
    return response.json();
  },

  createSuscripcion: async (data) => {
    const response = await fetch(`${ADMIN_BASE}/api/suscripciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

// Servicios de Inventario
export const inventarioApi = {
  getVehiculos: async (tenantId) => {
    const response = await fetch(`${INVENTARIO_BASE}/api/vehiculos`, {
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  getVehiculo: async (id, tenantId) => {
    const response = await fetch(`${INVENTARIO_BASE}/api/vehiculos/${id}`, {
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  createVehiculo: async (data, tenantId) => {
    const response = await fetch(`${INVENTARIO_BASE}/api/vehiculos`, {
      method: 'POST',
      headers: getHeaders(tenantId),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updateVehiculo: async (id, data, tenantId) => {
    const response = await fetch(`${INVENTARIO_BASE}/api/vehiculos/${id}`, {
      method: 'PUT',
      headers: getHeaders(tenantId),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  deleteVehiculo: async (id, tenantId) => {
    const response = await fetch(`${INVENTARIO_BASE}/api/vehiculos/${id}`, {
      method: 'DELETE',
      headers: getHeaders(tenantId)
    });
    return response.ok;
  }
};

// Servicios de Clientes
export const clientesApi = {
  getClientes: async (tenantId) => {
    const response = await fetch(`${CLIENTES_BASE}/api/clientes`, {
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  getCliente: async (id, tenantId) => {
    const response = await fetch(`${CLIENTES_BASE}/api/clientes/${id}`, {
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  createCliente: async (data, tenantId) => {
    const response = await fetch(`${CLIENTES_BASE}/api/clientes`, {
      method: 'POST',
      headers: getHeaders(tenantId),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updateCliente: async (id, data, tenantId) => {
    const response = await fetch(`${CLIENTES_BASE}/api/clientes/${id}`, {
      method: 'PUT',
      headers: getHeaders(tenantId),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  deleteCliente: async (id, tenantId) => {
    const response = await fetch(`${CLIENTES_BASE}/api/clientes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(tenantId)
    });
    return response.ok;
  }
};

// Servicios de Ventas
export const ventasApi = {
  getVentas: async (tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/ventas`, {
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  getVenta: async (id, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/ventas/${id}`, {
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  createVenta: async (data, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/ventas`, {
      method: 'POST',
      headers: getHeaders(tenantId),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updateVenta: async (id, data, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/ventas/${id}`, {
      method: 'PUT',
      headers: getHeaders(tenantId),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  deleteVenta: async (id, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/ventas/${id}`, {
      method: 'DELETE',
      headers: getHeaders(tenantId)
    });
    return response.ok;
  }
};

// Servicios de Reservas
export const reservasApi = {
  getReservas: async (tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/reservas`, {
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  getReserva: async (id, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/reservas/${id}`, {
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  createReserva: async (data, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/reservas`, {
      method: 'POST',
      headers: getHeaders(tenantId),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updateReserva: async (id, data, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/reservas/${id}`, {
      method: 'PUT',
      headers: getHeaders(tenantId),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  cancelarReserva: async (id, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/reservas/${id}/cancelar`, {
      method: 'PUT',
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  deleteReserva: async (id, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/reservas/${id}`, {
      method: 'DELETE',
      headers: getHeaders(tenantId)
    });
    return response.ok;
  }
};

// Servicios de Pagos
export const pagosApi = {
  getPagos: async (tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/pagos`, {
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  getPago: async (id, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/pagos/${id}`, {
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  getPagosPorVenta: async (ventaId, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/pagos/venta/${ventaId}`, {
      headers: getHeaders(tenantId)
    });
    return response.json();
  },

  createPago: async (data, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/pagos`, {
      method: 'POST',
      headers: getHeaders(tenantId),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updatePago: async (id, data, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/pagos/${id}`, {
      method: 'PUT',
      headers: getHeaders(tenantId),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  deletePago: async (id, tenantId) => {
    const response = await fetch(`${VENTAS_BASE}/api/pagos/${id}`, {
      method: 'DELETE',
      headers: getHeaders(tenantId)
    });
    return response.ok;
  }
};
