import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Search, Shield, Bike, User as UserIcon, Check, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'rider' });
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/users', form);
      toast.success(`${form.role.charAt(0).toUpperCase() + form.role.slice(1)} created!`);
      setShowModal(false);
      setForm({ fullName: '', email: '', password: '', role: 'rider' });
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
      toast.success(`User role updated to ${role}`);
    } catch {
      toast.error('Failed to update role');
    }
  };

  const filtered = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Users Management</h1>
          <p className="text-charcoal-muted mt-1">Manage user roles and permissions</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add New Rider/Admin
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted" />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="input-field pl-9 text-sm py-2.5" 
        />
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-bento shadow-bento w-full max-w-md animate-bounceIn">
            <div className="flex items-center justify-between p-6 border-b border-cream-dark">
              <h2 className="font-serif font-bold text-xl text-charcoal">Add New User</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-cream rounded-card transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-charcoal mb-1 block">Full Name</label>
                <input 
                  type="text" required className="input-field" value={form.fullName}
                  onChange={e => setForm({...form, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-charcoal mb-1 block">Email Address</label>
                <input 
                  type="email" required className="input-field" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-charcoal mb-1 block">Password</label>
                <input 
                  type="password" required minLength={6} className="input-field" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-charcoal mb-1 block">Role</label>
                <select 
                  className="input-field" value={form.role}
                  onChange={e => setForm({...form, role: e.target.value})}
                >
                  <option value="rider">🛵 Rider</option>
                  <option value="admin">🛡️ Admin</option>
                  <option value="customer">👤 Customer</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary flex-1">
                  {creating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream border-b border-cream-dark">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-charcoal-muted uppercase">User</th>
              <th className="px-6 py-4 text-xs font-bold text-charcoal-muted uppercase">Current Role</th>
              <th className="px-6 py-4 text-xs font-bold text-charcoal-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={3} className="px-6 py-4"><div className="skeleton h-8 w-full" /></td>
                </tr>
              ))
            ) : filtered.map((user) => (
              <tr key={user.id} className="hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-charcoal text-sm">{user.fullName}</p>
                    <p className="text-xs text-charcoal-muted">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`badge text-xs ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'rider' ? 'badge-orange' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {user.role !== 'rider' && (
                      <button 
                        onClick={() => handleRoleChange(user.id, 'rider')}
                        className="btn-ghost py-1 px-3 text-xs flex items-center gap-1.5"
                      >
                        <Bike size={14} /> Make Rider
                      </button>
                    )}
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => handleRoleChange(user.id, 'admin')}
                        className="btn-ghost py-1 px-3 text-xs flex items-center gap-1.5"
                      >
                        <Shield size={14} /> Make Admin
                      </button>
                    )}
                    {user.role !== 'customer' && (
                      <button 
                        onClick={() => handleRoleChange(user.id, 'customer')}
                        className="btn-ghost py-1 px-3 text-xs flex items-center gap-1.5 text-charcoal-muted"
                      >
                        <UserIcon size={14} /> Make Customer
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && !loading && (
          <div className="py-20 text-center">
            <p className="text-charcoal-muted">No users found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
