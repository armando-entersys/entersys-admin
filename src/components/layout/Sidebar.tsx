import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, LogOut, Mail, FolderOpen, ScrollText, AlertTriangle } from 'lucide-react';
import { authApi } from '../../api/auth';

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/posts', icon: FileText, label: 'Posts' },
    { to: '/posts/new', icon: PlusCircle, label: 'Crear Post' },
  ];

  const emailNavItems = [
    { to: '/email', icon: Mail, label: 'Email Dashboard' },
    { to: '/email/projects', icon: FolderOpen, label: 'Proyectos' },
    { to: '/email/logs', icon: ScrollText, label: 'Bitácora' },
    { to: '/email/escalation', icon: AlertTriangle, label: 'Escalamiento' },
  ];

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5">
            <img
              src="/imago-logo_entersys.png"
              alt="Entersys"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-white font-heading font-bold text-xl">
              Entersys
            </h1>
            <p className="text-gray-400 text-sm">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-entersys-primary text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}

        {/* Email Service Section */}
        <div className="mt-6 mb-2 px-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Service</p>
        </div>
        {emailNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/email'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-entersys-primary text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
