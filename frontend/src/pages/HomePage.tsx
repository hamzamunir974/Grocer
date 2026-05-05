import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, ChevronRight, Plus, MapPin, User, LogOut } from 'lucide-react';
import { api, formatPrice } from '../lib/api';
import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { name: 'Fruits & Veg', icon: '🥬', color: 'bg-green-50 text-green-600' },
  { name: 'Bakery', icon: '🍞', color: 'bg-orange-50 text-orange-600' },
  { name: 'Dairy & Eggs', icon: '🥛', color: 'bg-blue-50 text-blue-600' },
  { name: 'Meat & Fish', icon: '🥩', color: 'bg-red-50 text-red-600' },
  { name: 'Snacks', icon: '🍿', color: 'bg-purple-50 text-purple-600' },
  { name: 'Beverages', icon: '🧃', color: 'bg-cyan-50 text-cyan-600' },
  { name: 'Pantry', icon: '🫙', color: 'bg-amber-50 text-amber-600' },
  { name: 'Frozen', icon: '🧊', color: 'bg-slate-50 text-slate-600' },
];

interface Product {
  id: string;
  name: string;
  priceInCents: number;
  imageUrl?: string;
  unit?: string;
  category?: { name: string; icon: string };
  stock: number;
}

export function HomePage() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addItem, totalItems } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products', {
        params: { search: search || undefined },
      });
      setProducts(res.data);
    } catch {
      // Use mock data if API not connected
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      priceInCents: product.priceInCents,
      imageUrl: product.imageUrl,
      unit: product.unit,
    });
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
  };

  return (
    <div className="min-h-screen bg-cream bg-hero-pattern">
      {/* ── Navbar ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-cream-dark">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🛒</span>
            <span className="font-serif font-bold text-xl text-primary">GrocerX</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-lg relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search for groceries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 pr-4 py-2.5 text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-primary/5 rounded-card transition-colors">
              <ShoppingCart size={22} className="text-charcoal" />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounceIn">
                  {totalItems()}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-pill">
                  <div className="w-6 h-6 bg-orange-gradient rounded-full flex items-center justify-center">
                    <User size={13} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-primary">{user?.fullName?.split(' ')[0]}</span>
                </div>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn-ghost text-sm py-1.5 px-4">Admin</Link>
                )}
                {user?.role === 'rider' && (
                  <Link to="/rider" className="btn-ghost text-sm py-1.5 px-4">Rider Panel</Link>
                )}
                <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-card text-red-400 hover:text-red-600 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* ── Hero ─────────────────────────────── */}
        <section className="relative overflow-hidden bg-orange-gradient rounded-bento p-8 md:p-12 text-white">
          <div className="relative z-10 max-w-lg">
            <div className="badge bg-white/20 text-white mb-4">⚡ 30-min delivery</div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4">
              Fresh Groceries,<br />
              <span className="italic">Right at Your Door</span>
            </h1>
            <p className="text-white/80 text-lg mb-6">
              From farm-fresh produce to artisan bakery items — delivered in minutes.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/20 rounded-pill px-4 py-2 text-sm font-medium">
                <MapPin size={15} />
                <span>Lahore, PK</span>
              </div>
              <span className="text-white/60 text-sm">Free delivery on orders over Rs 1,500</span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -right-8 -bottom-20 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute right-24 top-8 text-7xl select-none opacity-40">🛒</div>
        </section>

        {/* ── Categories ───────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-charcoal">Shop by Category</h2>
            <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
                className={`flex flex-col items-center gap-2 p-4 rounded-card border-2 transition-all duration-200 hover:-translate-y-1 animate-fadeIn ${
                  selectedCategory === cat.name
                    ? 'border-primary bg-primary/5 shadow-orange'
                    : 'border-transparent bg-white hover:border-primary/20'
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-charcoal-light text-center leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Trending Products ─────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal">Trending Now</h2>
              <p className="text-charcoal-muted text-sm mt-1">Our most popular items this week</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-card overflow-hidden">
                  <div className="skeleton h-44 w-full" />
                  <div className="p-3 space-y-2">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={handleAddToCart}
                  delay={i * 60}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Promo Banner ─────────────────────── */}
        <section className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-bento p-6 flex items-center gap-4 border border-green-100">
            <span className="text-5xl">🥬</span>
            <div>
              <div className="badge bg-green-100 text-green-700 mb-2">Fresh Today</div>
              <h3 className="font-serif font-bold text-charcoal text-lg">Farm to Table Produce</h3>
              <p className="text-charcoal-muted text-sm mt-1">Sourced from local farms daily</p>
            </div>
          </div>
          <div className="bg-amber-50 rounded-bento p-6 flex items-center gap-4 border border-amber-100">
            <span className="text-5xl">🍞</span>
            <div>
              <div className="badge bg-amber-100 text-amber-700 mb-2">Baked Fresh</div>
              <h3 className="font-serif font-bold text-charcoal text-lg">Artisan Bakery</h3>
              <p className="text-charcoal-muted text-sm mt-1">Baked every morning before 7am</p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="bg-charcoal text-white mt-16 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🛒</span>
              <span className="font-serif font-bold text-xl text-primary">GrocerX</span>
            </div>
            <p className="text-white/60 text-sm max-w-xs">Fresh groceries delivered to your door in 30 minutes or less.</p>
          </div>
          <div className="text-white/40 text-sm self-end">
            © {new Date().getFullYear()} GrocerX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, onAdd, delay }: { product: Product; onAdd: (p: Product) => void; delay: number }) {
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    onAdd(product);
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <div
      className="bg-white rounded-card overflow-hidden shadow-card hover:shadow-bento hover:-translate-y-1 transition-all duration-300 animate-fadeIn group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square bg-cream-dark overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl.startsWith('/images/') ? product.imageUrl : `http://localhost:3001${product.imageUrl}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {getCategoryEmoji(product.category?.name)}
          </div>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-2 left-2 badge bg-warning/10 text-warning text-xs">
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-primary font-semibold mb-1">{product.category?.icon} {product.category?.name}</p>
        <h3 className="font-semibold text-charcoal text-sm leading-snug mb-1 line-clamp-2">{product.name}</h3>
        {product.unit && <p className="text-xs text-charcoal-muted mb-2">{product.unit}</p>}

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-bold text-charcoal">{formatPrice(product.priceInCents)}</span>
          </div>
          <button
            onClick={handleAdd}
            className={`w-8 h-8 rounded-full bg-orange-gradient text-white flex items-center justify-center shadow-orange hover:shadow-orange-lg hover:scale-110 transition-all duration-200 ${adding ? 'scale-90' : ''}`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function getCategoryEmoji(name?: string): string {
  const map: Record<string, string> = {
    'Fruits & Vegetables': '🥬',
    'Bakery': '🍞',
    'Dairy & Eggs': '🥛',
    'Meat & Fish': '🥩',
    'Snacks': '🍿',
    'Beverages': '🧃',
    'Pantry': '🫙',
    'Frozen Foods': '🧊',
  };
  return map[name || ''] || '🛒';
}

function getMockProducts(): Product[] {
  return [
    { id: '1', name: 'Organic Bananas (1kg)', priceInCents: 18000, unit: 'kg', stock: 50, imageUrl: '/images/products/bananas.png', category: { name: 'Fruits & Vegetables', icon: '🥬' } },
    { id: '2', name: 'Red Apples (500g)', priceInCents: 32000, unit: '500g', stock: 30, imageUrl: '/images/products/red-apples.png', category: { name: 'Fruits & Vegetables', icon: '🥬' } },
    { id: '3', name: 'Sourdough Bread', priceInCents: 45000, unit: 'loaf', stock: 15, imageUrl: '/images/products/sourdough.png', category: { name: 'Bakery', icon: '🍞' } },
    { id: '4', name: 'Croissants (4pcs)', priceInCents: 38000, unit: '4 pcs', stock: 20, imageUrl: '/images/products/croissants.png', category: { name: 'Bakery', icon: '🍞' } },
    { id: '5', name: 'Full Cream Milk (1L)', priceInCents: 22000, unit: '1L', stock: 100, imageUrl: '/images/products/milk.png', category: { name: 'Dairy & Eggs', icon: '🥛' } },
    { id: '6', name: 'Farm Fresh Eggs', priceInCents: 35000, unit: 'dozen', stock: 60, imageUrl: '/images/products/eggs.png', category: { name: 'Dairy & Eggs', icon: '🥛' } },
    { id: '7', name: 'Mineral Water (1.5L)', priceInCents: 8000, unit: '1.5L', stock: 200, imageUrl: '/images/products/water.png', category: { name: 'Beverages', icon: '🧃' } },
    { id: '8', name: 'Mixed Nuts (250g)', priceInCents: 85000, unit: '250g', stock: 40, imageUrl: '/images/products/mixed-nuts.png', category: { name: 'Snacks', icon: '🍿' } },
  ];
}
