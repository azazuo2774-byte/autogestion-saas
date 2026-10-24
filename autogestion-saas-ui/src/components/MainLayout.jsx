import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function MainLayout({ isAdminPanel, children }) {
  const { sidebarCollapsed } = useApp();

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
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
