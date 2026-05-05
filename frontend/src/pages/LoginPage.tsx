import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.fullName.split(' ')[0]}! 🎉`);
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'rider') navigate('/rider');
      else navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left — form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 max-w-md mx-auto w-full">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <span className="text-2xl">🛒</span>
          <span className="font-serif font-bold text-xl text-primary">GrocerX</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">Welcome back</h1>
          <p className="text-charcoal-muted">Sign in to your account to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-11"
              required
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-11 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        {/* Quick logins */}
        <div className="mt-6 p-4 bg-white rounded-card border border-cream-dark">
          <p className="text-xs text-charcoal-muted font-semibold mb-3 uppercase tracking-wide">Quick Test Logins</p>
          <div className="space-y-2">
            {[
              { label: '👤 Customer', email: 'customer@grocerx.com' },
              { label: '🛡️ Admin', email: 'admin@grocerx.com' },
              { label: '🛵 Rider', email: 'rider@grocerx.com' },
            ].map((q) => (
              <button
                key={q.email}
                onClick={() => { setEmail(q.email); setPassword('password123'); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/5 text-sm font-medium text-charcoal-light transition-colors"
              >
                {q.label} — <span className="text-charcoal-muted">{q.email}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-charcoal-muted text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
        </p>
      </div>

      {/* Right — visual */}
      <div className="hidden lg:flex flex-1 bg-orange-gradient items-center justify-center relative overflow-hidden">
        <div className="text-center text-white relative z-10 px-12">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="font-serif text-4xl font-bold mb-4">Fresh. Fast. Always.</h2>
          <p className="text-white/80 text-lg max-w-sm">Premium groceries delivered to your doorstep in 30 minutes or less.</p>
          <div className="mt-8 flex justify-center gap-4">
            {['🥬 Fresh Produce', '🍞 Daily Bakery', '🥛 Dairy & Eggs'].map((tag) => (
              <div key={tag} className="bg-white/20 rounded-pill px-4 py-2 text-sm font-medium">{tag}</div>
            ))}
          </div>
        </div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}
