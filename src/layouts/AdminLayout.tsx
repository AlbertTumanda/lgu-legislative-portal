import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected Route Check
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Legislative Management', path: '/admin/legislations', icon: FileText },
    { name: 'Session Management', path: '/admin/sessions', icon: Video },
    { name: 'Public Comments', path: '/admin/comments', icon: MessageSquare },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-lgu-blue-900 text-white transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 bg-lgu-blue-800 font-serif font-bold text-xl tracking-wider">
          <span className="text-lgu-gold-500 mr-2">SB</span> ADMIN
        </div>

        <div className="p-4">
          <div className="flex items-center mb-8 px-2">
            <div className="w-10 h-10 rounded-full bg-lgu-gold-500 flex items-center justify-center text-lgu-blue-900 font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-lgu-gold-500 text-lgu-blue-900"
                    : "text-slate-300 hover:bg-lgu-blue-800 hover:text-white"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 bg-lgu-blue-800">
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Mobile Only) */}
        <div className="md:hidden bg-white shadow-sm h-16 flex items-center justify-between px-4">
          <span className="font-serif font-bold text-lgu-blue-900">SB Admin Panel</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500">
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
