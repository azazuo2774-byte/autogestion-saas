import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function MainLayout({ isAdminPanel, children }) {
  const { sidebarCollapsed, mobileSidebarOpen, closeMobileSidebar } = useApp();

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
      <div className={`mobile-backdrop ${mobileSidebarOpen ? 'active' : ''}`} onClick={closeMobileSidebar} />
      <Sidebar isAdminPanel={isAdminPanel} />
      <div className="main-content">
        <Topbar isAdminPanel={isAdminPanel} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
