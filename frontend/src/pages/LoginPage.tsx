import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        if (!user.isVerified) {
          toast.error('Almost there! Please complete your registration and verify your PIN.');
          // Redirect to register with email pre-filled
          navigate(`/register?email=${user.email}&name=${user.fullName}`);
          return;
        }
        setAuth(user, token);
        toast.success(`Welcome back, ${user.fullName.split(' ')[0]}! 🎉`);
        navigate('/');
      } catch (err) {
        console.error('Failed to parse Google user', err);
      }
    }
  }, [navigate, setAuth]);

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

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/api/auth/google-demo';
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-dark"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-cream px-2 text-charcoal-muted font-semibold tracking-wider">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-cream-dark py-3 rounded-card text-charcoal font-semibold hover:bg-cream/50 transition-all shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285f4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34a853"/>
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.96H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.041l3.007-2.334z" fill="#fbbc05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048.957 4.959L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#ea4335"/>
            </svg>
            Google
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
