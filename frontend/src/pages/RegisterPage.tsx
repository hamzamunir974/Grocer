import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';

export function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      const loginRes = await api.post('/auth/login', { email: form.email, password: form.password });
      setAuth(loginRes.data.user, loginRes.data.token);
      toast.success('Account created! Welcome to GrocerX 🎉');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <span className="text-2xl">🛒</span>
          <span className="font-serif font-bold text-xl text-primary">GrocerX</span>
        </Link>

        <div className="card-bento">
          <div className="mb-6">
            <h1 className="text-2xl font-serif font-bold text-charcoal mb-1">Create Account</h1>
            <p className="text-charcoal-muted text-sm">Join thousands of happy customers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input type="text" placeholder="Full Name" value={form.fullName} onChange={update('fullName')} className="input-field pl-11" required />
            </div>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input type="email" placeholder="Email address" value={form.email} onChange={update('email')} className="input-field pl-11" required />
            </div>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input type="tel" placeholder="Phone number (optional)" value={form.phone} onChange={update('phone')} className="input-field pl-11" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={update('password')} className="input-field pl-11" required minLength={6} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="mt-4 text-center text-charcoal-muted text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
