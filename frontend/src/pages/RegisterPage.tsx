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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-dark"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-charcoal-muted font-semibold tracking-wider">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:3001/api/auth/google'}
              className="w-full flex items-center justify-center gap-3 bg-white border border-cream-dark py-3 rounded-card text-charcoal font-semibold hover:bg-cream/50 transition-all shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285f4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34a853"/>
                <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.96H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.041l3.007-2.334z" fill="#fbbc05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048.957 4.959L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#ea4335"/>
              </svg>
              Continue with Google
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
