import { createContext, useContext, useState } from 'react';
import { DEMO_USER, DEMO_TENANT, DEMO_SUSCRIPCION, RUTAS } from '../data/demo';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentRoute, setCurrentRoute] = useState(RUTAS.LOGIN);
  const [routeParams, setRouteParams] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminPanel, setIsAdminPanel] = useState(false);
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [suscripcion, setSuscripcion] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, msg: 'Tu suscripción vence el 31 de octubre', tipo: 'warning', leida: false },
    { id: 2, msg: 'Nueva reserva registrada', tipo: 'info', leida: false },
  ]);

  const navigate = (route, params = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    setMobileSidebarOpen(false);
  };

  const login = (email, password, asAdmin = false) => {
    // Simulación de login — en producción llama al microservicio Administrador
    if (asAdmin) {
      setIsAdminPanel(true);
      setUser({ id: 0, nombre: 'Admin SaaS', email: 'admin@autogestion.bo', rol: 'Administrador SaaS', initials: 'AS' });
      setTenant(null);
      setIsLoggedIn(true);
      navigate(RUTAS.ADMIN_DASHBOARD);
      return { ok: true };
    }
    if (email && password.length >= 8) {
      setIsAdminPanel(false);
      setUser(DEMO_USER);
      setTenant(DEMO_TENANT);
      setSuscripcion(DEMO_SUSCRIPCION);
      setIsLoggedIn(true);
      navigate(RUTAS.DASHBOARD);
      return { ok: true };
    }
    return { ok: false, error: 'Correo o contraseña incorrectos.' };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setTenant(null);
    setSuscripcion(null);
    setIsAdminPanel(false);
    navigate(RUTAS.LOGIN);
  };

  const toggleSidebar = () => setSidebarCollapsed(c => !c);
  const toggleMobileSidebar = () => setMobileSidebarOpen(v => !v);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const markNotifRead = (id) =>
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, leida: true } : n));

  const addNotification = (msg, tipo = 'info') => {
    setNotifications(ns => [{ id: Date.now(), msg, tipo, leida: false }, ...ns]);
  };

  const updateSuscripcion = (plan) => {
    const now = new Date();
    const vencimiento = new Date();
    vencimiento.setDate(vencimiento.getDate() + (plan.duracionDias || 30));
    const nuevaSub = {
      id: suscripcion ? suscripcion.id + 1 : 1,
      usuarioId: user?.id || 1,
      tenantId: tenant?.id || 1,
      planNombre: plan.nombre,
      planId: plan.id,
      inicioUtc: now.toISOString(),
      vencimientoUtc: vencimiento.toISOString(),
      estado: 'Habilitada',
      resultado: 'Activa',
    };
    setSuscripcion(nuevaSub);
    if (tenant) {
      setTenant(t => ({ ...t, plan: plan.nombre }));
    }
    addNotification(`Has cambiado tu plan a ${plan.nombre}`, 'info');
  };

  const renewSuscripcion = (days = 30) => {
    if (!suscripcion) return;
    const currentVenc = new Date(suscripcion.vencimientoUtc);
    const baseDate = currentVenc > new Date() ? currentVenc : new Date();
    baseDate.setDate(baseDate.getDate() + days);
    setSuscripcion(s => ({
      ...s,
      vencimientoUtc: baseDate.toISOString(),
      resultado: 'Activa',
      estado: 'Habilitada'
    }));
    addNotification(`Suscripción renovada por ${days} días más`, 'info');
  };

  const updateUser = (data) => {
    setUser(u => ({ ...u, ...data }));
  };

  return (
    <AppContext.Provider value={{
      currentRoute,
      routeParams,
      navigate,
      isLoggedIn,
      isAdminPanel,
      user,
      tenant,
      suscripcion,
      sidebarCollapsed,
      mobileSidebarOpen,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar,
      login,
      logout,
      notifications,
      markNotifRead,
      addNotification,
      updateSuscripcion,
      renewSuscripcion,
      updateUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
