import { useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import InventarioPage from './pages/InventarioPage';
import ClientesPage from './pages/ClientesPage';
import ReservasPage from './pages/ReservasPage';
import VentasPage from './pages/VentasPage';
import PagosPage from './pages/PagosPage';
import PlanesPage from './pages/PlanesPage';
import SuscripcionesPage from './pages/SuscripcionesPage';
import AuditoriaPage from './pages/AuditoriaPage';
import PerfilPage from './pages/PerfilPage';
import MainLayout from './components/MainLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminTenants from './pages/AdminTenants';
import AdminPlanes from './pages/AdminPlanes';
import AdminSuscripciones from './pages/AdminSuscripciones';

function AppRouter() {
  const { currentRoute, isLoggedIn, isAdminPanel } = useApp();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  if (isAdminPanel) {
    return <AdminLayout />;
  }

  return <AutoventaLayout />;
}

function AdminLayout() {
  const { currentRoute } = useApp();

  return (
    <MainLayout isAdminPanel={true}>
      {currentRoute === 'admin-dashboard' && <AdminDashboard />}
      {currentRoute === 'admin-tenants' && <AdminTenants />}
      {currentRoute === 'admin-planes' && <AdminPlanes />}
      {currentRoute === 'admin-suscripciones' && <AdminSuscripciones />}
    </MainLayout>
  );
}

function AutoventaLayout() {
  const { currentRoute } = useApp();

  return (
    <MainLayout isAdminPanel={false}>
      {currentRoute === 'dashboard' && <Dashboard />}
      {currentRoute === 'inventario' && <InventarioPage />}
      {currentRoute === 'vehiculo-detalle' && <InventarioPage />}
      {currentRoute === 'vehiculo-nuevo' && <InventarioPage />}
      {currentRoute === 'clientes' && <ClientesPage />}
      {currentRoute === 'cliente-detalle' && <ClientesPage />}
      {currentRoute === 'reservas' && <ReservasPage />}
      {currentRoute === 'ventas' && <VentasPage />}
      {currentRoute === 'pagos' && <PagosPage />}
      {currentRoute === 'planes' && <PlanesPage />}
      {currentRoute === 'suscripciones' && <SuscripcionesPage />}
      {currentRoute === 'auditoria' && <AuditoriaPage />}
      {currentRoute === 'perfil' && <PerfilPage />}
    </MainLayout>
  );
}

export default AppRouter;
