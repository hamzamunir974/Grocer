import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [step, setStep] = useState(0); // 0: Details, 1: PIN Verification
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const nameParam = params.get('name');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam, fullName: nameParam || '' }));
    }
  }, []);

  const handleSendPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First, create the unverified account and trigger PIN
      await api.post('/auth/register/start', formData);
      toast.success('Confirmation PIN sent to your email! 📧');
      setStep(1);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register/verify', { email: formData.email, pin });
      setAuth(res.data.user, res.data.token);
      toast.success('Account verified! Welcome to GrocerX 🛒');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid PIN');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-cream-dark p-8 md:p-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-3xl mb-4">🛒</Link>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            {step === 0 ? 'Create an Account' : 'Verify Your Email'}
          </h1>
          <p className="text-charcoal-muted mt-2 text-sm">
            {step === 0 
              ? 'Join GrocerX for fresh groceries delivered fast' 
              : `Enter the 6-digit PIN sent to ${formData.email}`}
          </p>
        </div>

        {step === 0 ? (
          <form onSubmit={handleSendPin} className="space-y-4">
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input
                type="text"
                placeholder="Full name"
                value={formData.fullName}
                onChange={update('fullName')}
                className="input-field pl-11"
                required
              />
            </div>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={update('email')}
                className="input-field pl-11"
                required
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={update('password')}
                className="input-field pl-11"
                required
              />
            </div>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={update('phone')}
                className="input-field pl-11"
                required
              />
            </div>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input
                type="text"
                placeholder="Delivery address"
                value={formData.address}
                onChange={update('address')}
                className="input-field pl-11"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Next Step <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyPin} className="space-y-6">
            <div className="relative">
              <ShieldCheck size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <input
                type="text"
                placeholder="Enter 6-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="input-field pl-14 text-center tracking-[0.5em] font-mono text-xl"
                maxLength={6}
                required
                autoFocus
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Verify & Complete Sign Up <ArrowRight size={18} /></>
              )}
            </button>

            <button 
              type="button" 
              onClick={() => setStep(0)}
              className="w-full text-center text-sm text-charcoal-muted hover:text-primary transition-colors"
            >
              ← Back to details
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-cream-dark text-center">
          <p className="text-charcoal-muted text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
