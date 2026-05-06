import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPriceFull } from '../lib/api';
import { ArrowLeft, Package, Clock, Bike, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_ICONS: Record<string, any> = {
  pending: { icon: Clock, color: 'text-gold', label: 'Pending' },
  confirmed: { icon: Package, color: 'text-primary', label: 'Confirmed' },
  preparing: { icon: Package, color: 'text-gold', label: 'Preparing' },
  out_for_delivery: { icon: Bike, color: 'text-primary', label: 'Out for Delivery' },
  delivered: { icon: CheckCircle2, color: 'text-success', label: 'Delivered' },
};

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-charcoal-light hover:text-primary transition-colors mb-6">
          <ArrowLeft size={18} /> Back to home
        </Link>

        <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-bento p-12 text-center border border-cream-dark shadow-card">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-serif font-bold text-charcoal mb-2">No orders found</h2>
            <p className="text-charcoal-muted mb-6">You haven't placed any orders yet.</p>
            <Link to="/" className="btn-primary inline-flex">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_ICONS[order.status] || STATUS_ICONS.pending;
              const StatusIcon = status.icon;
              
              return (
                <Link
                  key={order.id}
                  to={`/track/${order.id}`}
                  className="block bg-white rounded-card p-5 border border-cream-dark hover:border-primary transition-all hover:shadow-bento group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-cream flex items-center justify-center ${status.color}`}>
                        <StatusIcon size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-charcoal group-hover:text-primary transition-colors">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <p className="text-xs text-charcoal-muted mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-charcoal">{formatPriceFull(order.totalInCents)}</p>
                      <span className={`text-xs font-bold uppercase tracking-wider flex items-center justify-end gap-1 mt-1 ${status.color}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {status.label}
                      </span>
                    </div>
                    
                    <ChevronRight size={20} className="text-cream-dark group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

