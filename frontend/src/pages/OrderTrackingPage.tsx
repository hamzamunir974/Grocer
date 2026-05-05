import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io, Socket } from 'socket.io-client';
import { api, formatPriceFull } from '../lib/api';
import { ArrowLeft, Package, Bike, CheckCircle2, Clock, Phone } from 'lucide-react';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Orange rider marker
const riderIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:44px;height:44px;background:linear-gradient(135deg,#FF7A01,#FFA500);
    border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-size:22px;box-shadow:0 4px 16px rgba(255,122,1,0.5);
    border:3px solid white;animation:pulse 2s infinite
  ">🛵</div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', icon: Package, color: 'text-primary' },
  { key: 'preparing', label: 'Preparing', icon: Clock, color: 'text-gold' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Bike, color: 'text-primary' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-success' },
];

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1 });
  }, [lat, lng]);
  return null;
}

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [riderPos, setRiderPos] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  // Default Lahore coordinates
  const defaultPos: [number, number] = [31.5204, 74.3587];

  useEffect(() => {
    fetchOrder();
    setupSocket();
    return () => {
      socketRef.current?.disconnect();
    };
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
      if (res.data.riderLat && res.data.riderLng) {
        setRiderPos([res.data.riderLat, res.data.riderLng]);
      }
    } catch {
      // Use mock data
      setOrder(getMockOrder());
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    const socket = io('http://localhost:3001/tracking', {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinOrderRoom', { orderId });
    });

    socket.on('riderLocationUpdated', (data: any) => {
      setRiderPos([data.lat, data.lng]);
    });

    socket.on('orderStatusChanged', (data: any) => {
      setOrder((prev: any) => ({ ...prev, status: data.status }));
    });
  };

  const currentStepIndex = STEPS.findIndex((s) => s.key === order?.status);
  const mapCenter = riderPos || defaultPos;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-muted font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-cream-dark px-4 py-4 flex items-center gap-3">
        <Link to="/" className="hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif font-bold text-charcoal">Track Order</h1>
          <p className="text-xs text-charcoal-muted">#{orderId?.slice(0, 8).toUpperCase()}</p>
        </div>
        <div className="ml-auto">
          <span className={`badge ${
            order?.status === 'delivered' ? 'badge-success' :
            order?.status === 'out_for_delivery' ? 'badge-orange' : 'bg-charcoal/10 text-charcoal'
          }`}>
            {order?.status?.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
      </header>

      {/* Map - Full Screen */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={14}
          style={{ height: '100%', width: '100%', minHeight: '400px' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {riderPos && (
            <>
              <Marker position={riderPos} icon={riderIcon}>
                <Popup>
                  <div className="font-sans font-semibold">🛵 Your Rider</div>
                  <p className="text-sm text-gray-500">On the way to you!</p>
                </Popup>
              </Marker>
              <MapUpdater lat={riderPos[0]} lng={riderPos[1]} />
            </>
          )}
        </MapContainer>

        {/* Overlay card */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-[1000]">
          <div className="bg-white rounded-bento shadow-bento p-6 max-w-2xl mx-auto">
            {/* Progress Stepper */}
            <div className="flex items-center justify-between mb-6">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isComplete = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isComplete
                          ? 'bg-primary border-primary text-white shadow-orange'
                          : 'border-cream-dark text-charcoal-muted bg-cream'
                      } ${isCurrent ? 'scale-110' : ''}`}>
                        <Icon size={18} />
                      </div>
                      <p className={`text-xs mt-1.5 font-medium text-center leading-tight ${
                        isComplete ? 'text-primary' : 'text-charcoal-muted'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-500 ${
                        i < currentStepIndex ? 'bg-primary' : 'bg-cream-dark'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Order Info */}
            {order && (
              <div className="flex items-center justify-between pt-4 border-t border-cream-dark">
                <div>
                  <p className="text-sm text-charcoal-muted">Order Total</p>
                  <p className="font-bold text-charcoal">{formatPriceFull(order.totalInCents || 0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-charcoal-muted">Items</p>
                  <p className="font-bold text-charcoal">{order.items?.length || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-charcoal-muted">Est. Delivery</p>
                  <p className="font-bold text-primary">~25 mins</p>
                </div>
                {order.rider && (
                  <div className="flex items-center gap-2 bg-primary/5 rounded-card px-3 py-2">
                    <div className="w-8 h-8 bg-orange-gradient rounded-full flex items-center justify-center text-sm">🛵</div>
                    <div>
                      <p className="text-xs text-charcoal-muted">Your Rider</p>
                      <p className="text-sm font-semibold text-charcoal">{order.rider.fullName}</p>
                    </div>
                    {order.rider.phone && (
                      <a href={`tel:${order.rider.phone}`} className="text-primary hover:text-primary/70">
                        <Phone size={16} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getMockOrder() {
  return {
    id: 'mock-order-id',
    status: 'out_for_delivery',
    totalInCents: 113000,
    items: [
      { name: 'Organic Bananas', quantity: 2 },
      { name: 'Sourdough Bread', quantity: 1 },
    ],
    rider: { fullName: 'Ali Khan', phone: '+92-300-1234567' },
  };
}
