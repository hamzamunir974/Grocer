import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '../store/auth.store';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MapPin } from 'lucide-react';
import { api, formatPrice, formatPriceFull } from '../lib/api';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalCents } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);

  const deliveryFee = totalCents() >= 150000 ? 0 : 5000; // Free above Rs 1500
  const grandTotal = totalCents() + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    if (!address.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }
    setPlacing(true);
    try {
      const res = await api.post('/orders', {
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          priceInCents: i.priceInCents,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        })),
        totalInCents: grandTotal,
        deliveryAddress: address,
      });
      clearCart();
      toast.success('Order placed! Track your delivery 🚀');
      navigate(`/track/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 p-4">
        <div className="text-8xl">🛒</div>
        <h2 className="font-serif text-2xl font-bold text-charcoal">Your cart is empty</h2>
        <p className="text-charcoal-muted">Add some fresh groceries to get started!</p>
        <Link to="/" className="btn-primary mt-2">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-charcoal-light hover:text-primary transition-colors mb-6">
          <ArrowLeft size={18} /> Back to shopping
        </Link>

        <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">Your Cart</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-card p-4 flex items-center gap-4 shadow-card animate-fadeIn">
                <div className="w-16 h-16 bg-cream-dark rounded-lg overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    <img src={`http://localhost:3001${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🛒</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-charcoal text-sm truncate">{item.name}</h3>
                  {item.unit && <p className="text-xs text-charcoal-muted">{item.unit}</p>}
                  <p className="text-primary font-bold mt-1">{formatPrice(item.priceInCents)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border-2 border-cream-dark flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-orange-gradient text-white flex items-center justify-center hover:shadow-orange transition-all"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-charcoal-muted hover:text-error transition-colors ml-2">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="card-bento">
              <h2 className="font-serif font-bold text-charcoal text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Subtotal</span>
                  <span className="font-medium">{formatPriceFull(totalCents())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-success' : ''}`}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-charcoal-muted bg-cream rounded-lg p-2">
                    Add {formatPrice(150000 - totalCents())} more for free delivery
                  </p>
                )}
                <div className="border-t border-cream-dark pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary text-lg">{formatPriceFull(grandTotal)}</span>
                </div>
              </div>

              {/* Address */}
              <div className="mt-4">
                <label className="text-sm font-semibold text-charcoal mb-2 flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" /> Delivery Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address..."
                  className="input-field text-sm h-20 resize-none"
                />
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
              >
                {placing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><ShoppingBag size={18} /> Place Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
