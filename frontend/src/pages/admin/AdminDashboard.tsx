import { useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminUsers } from './AdminUsers';
import toast from 'react-hot-toast';

const NAV = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/users', label: 'Users', icon: Users },
];

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-cream-dark flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-cream-dark">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🛒</span>
          <span className="font-serif font-bold text-xl text-primary">GrocerX</span>
        </div>
        <div className="bg-primary/5 rounded-card px-3 py-2">
          <p className="text-xs text-charcoal-muted">Logged in as</p>
          <p className="font-semibold text-sm text-charcoal truncate">{user?.fullName}</p>
          <span className="badge badge-orange text-xs mt-1">Admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path) && item.path !== '/admin';
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-cream-dark">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-error hover:bg-error/5 hover:text-error"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}

function DashboardHome() {
  const stats = [
    { label: 'Total Orders', value: '128', icon: '📦', trend: '+12%', color: 'bg-blue-50' },
    { label: 'Revenue Today', value: 'Rs 45,200', icon: '💰', trend: '+8%', color: 'bg-green-50' },
    { label: 'Active Riders', value: '5', icon: '🛵', trend: '+2', color: 'bg-orange-50' },
    { label: 'Products', value: '84', icon: '🥬', trend: '+3 new', color: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-charcoal">Dashboard</h1>
        <p className="text-charcoal-muted mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`card-bento ${stat.color} animate-fadeIn`} style={{ animationDelay: `${i * 100}ms` }}>
            <div className="text-3xl mb-3">{stat.icon}</div>
            <p className="text-2xl font-bold text-charcoal font-serif">{stat.value}</p>
            <p className="text-charcoal-muted text-sm mt-1">{stat.label}</p>
            <span className="badge bg-green-100 text-green-700 mt-2 text-xs">{stat.trend}</span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-bento">
          <h2 className="font-serif font-bold text-lg text-charcoal mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/admin/products" className="flex items-center justify-between p-3 bg-cream rounded-card hover:bg-primary/5 transition-colors group">
              <span className="font-medium text-sm">Add New Product</span>
              <ChevronRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link to="/admin/orders" className="flex items-center justify-between p-3 bg-cream rounded-card hover:bg-primary/5 transition-colors group">
              <span className="font-medium text-sm">Manage Orders</span>
              <ChevronRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
        <div className="card-bento">
          <h2 className="font-serif font-bold text-lg text-charcoal mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {['New order #A1F2 — Rs 450', 'Rider Ali assigned to #B3C4', 'Product "Bananas" low stock'].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                <p className="text-sm text-charcoal-light">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Access denied. Admins only!');
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Routes>
      </main>
    </div>
  );
}
