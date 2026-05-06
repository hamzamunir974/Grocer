import { useState, useEffect } from 'react';
import { api, formatPriceFull } from '../../lib/api';
import { Search, RefreshCw, Bike } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-charcoal/10 text-charcoal',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-warning/10 text-warning',
  out_for_delivery: 'badge-orange',
  delivered: 'badge-success',
  cancelled: 'bg-error/10 text-error',
};

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];



export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { 
    loadOrders();
    loadRiders();
  }, []);

  const loadRiders = async () => {
    try {
      const res = await api.get('/users/riders');
      setRiders(res.data);
    } catch {}
  };

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch {
      toast.error('Failed to load real orders from server');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      toast.success('Status updated!');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAssignRider = async (orderId: string, riderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/assign-rider`, { riderId });
      toast.success('Rider assigned!');
      loadOrders(); // Refresh to show new rider and status
    } catch {
      toast.error('Failed to assign rider');
    }
  };

  const filtered = orders.filter((o) =>
    o.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Orders</h1>
          <p className="text-charcoal-muted mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={loadOrders} className="btn-ghost flex items-center gap-2 py-2">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted" />
        <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 text-sm py-2.5" />
      </div>

      <div className="space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-card" />)
        ) : filtered.map((order) => (
          <div key={order.id} className="bg-white rounded-card shadow-card p-5 animate-fadeIn">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-charcoal text-sm">#{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className={`badge text-xs ${STATUS_COLORS[order.status] || ''}`}>
                    {order.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  {order.rider && (
                    <span className="flex items-center gap-1 text-xs text-charcoal-muted">
                      <Bike size={12} /> {order.rider.fullName}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-charcoal">{order.customer?.fullName}</p>
                <p className="text-xs text-charcoal-muted">{order.deliveryAddress}</p>
                <p className="text-xs text-charcoal-muted mt-1">
                  {order.items?.map((i: any) => `${i.name} ×${i.quantity}`).join(', ')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-charcoal">{formatPriceFull(order.totalInCents)}</p>
                <p className="text-xs text-charcoal-muted mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                
                {/* Rider Assignment Dropdown */}
                <div className="mt-4">
                  <select 
                    className="input-field py-1 px-2 text-xs w-40"
                    value={order.riderId || ''}
                    onChange={(e) => handleAssignRider(order.id, e.target.value)}
                  >
                    <option value="">Assign Rider...</option>
                    {riders.map(r => (
                      <option key={r.id} value={r.id}>{r.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Status change buttons */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-cream-dark flex-wrap">
              <span className="text-xs text-charcoal-muted font-semibold">Update Status:</span>
              {STATUS_FLOW.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(order.id, s)}
                  className={`text-xs px-3 py-1.5 rounded-pill font-medium transition-all ${
                    order.status === s
                      ? 'bg-primary text-white shadow-orange'
                      : 'bg-cream text-charcoal-muted hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && !loading && (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-charcoal-muted">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
