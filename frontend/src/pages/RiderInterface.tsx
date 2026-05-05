import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { io, Socket } from 'socket.io-client';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth.store';
import { Navigation, CheckCircle2, Bike, Package, MapPin, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export function RiderInterface() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [riderPos, setRiderPos] = useState<[number, number]>([31.5204, 74.3587]);
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    loadOrders();
    setupSocket();
    return () => {
      socketRef.current?.disconnect();
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
      const active = res.data.find((o: any) => o.status === 'out_for_delivery');
      if (active) setActiveOrder(active);
    } catch {
      const mockOrders = [
        {
          id: 'mock-001', status: 'confirmed',
          customer: { fullName: 'Sara Ahmed', phone: '+92-300-1234567' },
          deliveryAddress: 'DHA Phase 5, Lahore', totalInCents: 113000,
          items: [{ name: 'Bananas ×2' }, { name: 'Sourdough Bread ×1' }],
        },
      ];
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    const socket = io('http://localhost:3001/tracking', { withCredentials: true });
    socketRef.current = socket;
  };

  const startTracking = () => {
    if (!activeOrder) return;

    setTracking(true);
    toast.success('📍 Live tracking started!');

    socketRef.current?.emit('joinOrderRoom', { orderId: activeOrder.id });

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setRiderPos([latitude, longitude]);

        socketRef.current?.emit('locationUpdate', {
          orderId: activeOrder.id,
          lat: latitude,
          lng: longitude,
          riderId: user?.id,
        });

        // Also persist to DB
        api.patch(`/orders/${activeOrder.id}/location`, { lat: latitude, lng: longitude }).catch(() => {});
      },
      () => {
        // Simulate movement around Lahore if GPS denied
        let i = 0;
        const basePos = { lat: 31.5204, lng: 74.3587 };
        const interval = setInterval(() => {
          const lat = basePos.lat + Math.sin(i * 0.1) * 0.005;
          const lng = basePos.lng + Math.cos(i * 0.1) * 0.005;
          setRiderPos([lat, lng]);
          socketRef.current?.emit('locationUpdate', { orderId: activeOrder.id, lat, lng, riderId: user?.id });
          i++;
        }, 3000);
        return () => clearInterval(interval);
      },
      { enableHighAccuracy: true, maximumAge: 5000 },
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    setTracking(false);
  };

  const markDelivered = async () => {
    if (!activeOrder) return;
    try {
      await api.patch(`/orders/${activeOrder.id}/status`, { status: 'delivered' });
    } catch {}

    socketRef.current?.emit('orderDelivered', { orderId: activeOrder.id, riderId: user?.id });
    stopTracking();
    setOrders((prev) =>
      prev.map((o) => o.id === activeOrder.id ? { ...o, status: 'delivered' } : o),
    );
    setActiveOrder(null);
    toast.success('🎉 Order marked as delivered!');
  };

  const acceptOrder = async (order: any) => {
    try {
      await api.patch(`/orders/${order.id}/status`, { status: 'out_for_delivery' });
    } catch {}
    const updated = { ...order, status: 'out_for_delivery' };
    setOrders((prev) => prev.map((o) => o.id === order.id ? updated : o));
    setActiveOrder(updated);
    toast.success('Order accepted! Start tracking to begin delivery.');
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-cream-dark px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-gradient rounded-full flex items-center justify-center text-white text-lg">🛵</div>
            <div>
              <h1 className="font-serif font-bold text-charcoal">Rider Panel</h1>
              <p className="text-xs text-charcoal-muted">Welcome, {user?.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadOrders} className="p-2 hover:bg-cream rounded-card transition-colors">
              <RefreshCw size={18} className="text-charcoal-muted" />
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="p-2 hover:bg-red-50 rounded-card transition-colors text-red-400 hover:text-red-600"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-4">
        {/* Active Order Card */}
        {activeOrder ? (
          <div className="bg-white rounded-bento shadow-bento p-6 border-2 border-primary animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <h2 className="font-serif font-bold text-charcoal">Active Delivery</h2>
              <span className="badge badge-orange ml-auto">#{activeOrder.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-charcoal-muted font-semibold uppercase tracking-wide">Delivery Address</p>
                  <p className="font-medium text-charcoal text-sm">{activeOrder.deliveryAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-charcoal-muted font-semibold uppercase tracking-wide">Customer</p>
                  <p className="font-medium text-charcoal text-sm">{activeOrder.customer?.fullName}</p>
                  {activeOrder.customer?.phone && (
                    <a href={`tel:${activeOrder.customer.phone}`} className="text-xs text-primary hover:underline">
                      {activeOrder.customer.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-card overflow-hidden mb-6" style={{ height: '220px' }}>
              <MapContainer center={riderPos} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={riderPos}>
                  <Popup>📍 Your Location</Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Track Location Button - Prominent */}
              <button
                onClick={tracking ? stopTracking : startTracking}
                className={`w-full py-4 rounded-pill font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                  tracking
                    ? 'bg-charcoal text-white shadow-lg hover:bg-charcoal/80'
                    : 'btn-primary shadow-orange-lg hover:scale-105'
                }`}
              >
                <Navigation size={22} className={tracking ? 'animate-spin' : ''} />
                {tracking ? '⏹ Stop Tracking' : '📍 Update Current Location'}
              </button>

              {/* Mark as Delivered */}
              <button
                onClick={markDelivered}
                className="w-full py-4 rounded-pill font-bold text-lg flex items-center justify-center gap-3 bg-success text-white hover:bg-success/90 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <CheckCircle2 size={22} />
                ✅ Mark as Delivered
              </button>
            </div>

            {tracking && (
              <div className="mt-3 text-center">
                <p className="text-xs text-primary font-medium animate-pulse">
                  🔴 Live — Broadcasting your location to customer...
                </p>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Position: [{riderPos[0].toFixed(4)}, {riderPos[1].toFixed(4)}]
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-orange-gradient rounded-bento p-6 text-white text-center">
            <div className="text-5xl mb-3">🛵</div>
            <h2 className="font-serif text-xl font-bold mb-1">Ready for Delivery?</h2>
            <p className="text-white/80 text-sm">Accept an order below to start delivering</p>
          </div>
        )}

        {/* Available Orders */}
        <div>
          <h2 className="font-serif font-bold text-charcoal text-lg mb-3">
            {activeOrder ? 'Other Orders' : 'Available Orders'}
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => <div key={i} className="skeleton h-28 rounded-card" />)}
            </div>
          ) : orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled' && o.id !== activeOrder?.id).length === 0 ? (
            <div className="bg-white rounded-card p-8 text-center shadow-card">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-charcoal-muted font-medium">No pending orders right now</p>
              <p className="text-charcoal-muted/70 text-sm mt-1">New orders will appear here automatically</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders
                .filter((o) => o.status !== 'delivered' && o.status !== 'cancelled' && o.id !== activeOrder?.id)
                .map((order) => (
                  <div key={order.id} className="bg-white rounded-card shadow-card p-4 animate-fadeIn">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-bold text-sm text-charcoal">#{order.id.slice(0, 8).toUpperCase()}</span>
                        <p className="text-sm text-charcoal-light mt-0.5">{order.customer?.fullName}</p>
                        <p className="text-xs text-charcoal-muted flex items-center gap-1 mt-1">
                          <MapPin size={11} /> {order.deliveryAddress}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`badge text-xs ${({
                          pending: 'bg-charcoal/10 text-charcoal',
                          confirmed: 'bg-blue-100 text-blue-700',
                          preparing: 'bg-warning/10 text-warning',
                          out_for_delivery: 'badge-orange',
                        } as Record<string, string>)[order.status] || 'bg-charcoal/10 text-charcoal'}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                    {(order.status === 'confirmed' || order.status === 'pending') && !activeOrder && (
                      <button
                        onClick={() => acceptOrder(order)}
                        className="w-full btn-primary py-2.5 text-sm flex items-center justify-center gap-2"
                      >
                        <Bike size={16} /> Accept & Deliver
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
