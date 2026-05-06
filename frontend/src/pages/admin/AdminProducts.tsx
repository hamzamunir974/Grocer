import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Pencil, Trash2, X, Upload, Loader2, AlertCircle } from 'lucide-react';
import { api, formatPrice } from '../../lib/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description?: string;
  priceInCents: number;
  stock: number;
  unit?: string;
  imageUrl?: string;
  isAvailable: boolean;
  category?: { id: string; name: string; icon: string };
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}





export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        api.get('/products/admin'),
        api.get('/categories'),
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch {
      toast.error('Failed to load real products from server');
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Products</h1>
          <p className="text-charcoal-muted mt-1">{products.length} products in inventory</p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9 text-sm py-2.5"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-bento shadow-bento overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cream-dark bg-cream/50">
              <th className="text-left p-4 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">Product</th>
              <th className="text-left p-4 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">Category</th>
              <th className="text-left p-4 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">Price</th>
              <th className="text-left p-4 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">Stock</th>
              <th className="text-left p-4 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">Status</th>
              <th className="text-right p-4 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="p-4"><div className="flex items-center gap-3"><div className="skeleton w-12 h-12 rounded-lg" /><div className="skeleton h-4 w-32 rounded" /></div></td>
                  {[...Array(4)].map((__, j) => <td key={j} className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>)}
                  <td className="p-4"><div className="skeleton h-8 w-16 rounded ml-auto" /></td>
                </tr>
              ))
            ) : filtered.map((product) => (
              <tr key={product.id} className="hover:bg-cream/50 transition-colors animate-fadeIn">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* 1:1 thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream-dark shrink-0 border border-cream-dark">
                      {product.imageUrl ? (
                        <img
                          src={`http://localhost:3001${product.imageUrl}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          {product.category?.icon || '🛒'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal text-sm">{product.name}</p>
                      {product.unit && <p className="text-xs text-charcoal-muted">{product.unit}</p>}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm">{product.category?.icon} {product.category?.name}</span>
                </td>
                <td className="p-4">
                  <span className="font-semibold text-charcoal">{formatPrice(product.priceInCents)}</span>
                </td>
                <td className="p-4">
                  <span className={`badge text-xs ${product.stock < 10 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="p-4">
                  <span className={`badge text-xs ${product.isAvailable ? 'badge-success' : 'bg-error/10 text-error'}`}>
                    {product.isAvailable ? 'Available' : 'Hidden'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => { setEditProduct(product); setShowModal(true); }}
                      className="p-2 hover:bg-primary/5 rounded-card text-charcoal-muted hover:text-primary transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-error/5 rounded-card text-charcoal-muted hover:text-error transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && !loading && (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-charcoal-muted">No products found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSaved={(p) => {
            if (editProduct) {
              setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
            } else {
              setProducts((prev) => [p, ...prev]);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function ProductModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (p: Product) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    priceInCents: product ? Math.round(product.priceInCents / 100) : 0,
    stock: product?.stock || 0,
    unit: product?.unit || '',
    categoryId: product?.categoryId || categories[0]?.id || '',
    isAvailable: product?.isAvailable ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl ? `http://localhost:3001${product.imageUrl}` : null);
  const [loading, setLoading] = useState(false);
  const [cropWarning, setCropWarning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setCropWarning(img.width !== img.height);
        setImagePreview(ev.target?.result as string);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('priceInCents', String(form.priceInCents * 100));
      formData.append('stock', String(form.stock));
      formData.append('unit', form.unit);
      formData.append('categoryId', form.categoryId);
      formData.append('isAvailable', String(form.isAvailable));
      if (imageFile) formData.append('image', imageFile);

      let res;
      if (product) {
        res = await api.patch(`/products/${product.id}`, formData);
      } else {
        res = await api.post('/products', formData);
      }
      toast.success(product ? 'Product updated!' : 'Product created!');
      onSaved(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-bento shadow-bento w-full max-w-xl animate-bounceIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream-dark">
          <h2 className="font-serif font-bold text-xl text-charcoal">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-card transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload - Square enforced */}
          <div>
            <label className="text-sm font-semibold text-charcoal mb-2 block">
              Product Image
              <span className="ml-2 badge badge-orange text-xs">1:1 Square Required</span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-card cursor-pointer hover:border-primary transition-colors overflow-hidden ${
                imagePreview ? 'border-primary' : 'border-cream-dark'
              }`}
              style={{ paddingBottom: '100%' }} // Forces 1:1 aspect ratio container
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center center' }}
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload size={32} className="text-charcoal-muted mx-auto mb-2" />
                    <p className="text-sm text-charcoal-muted font-medium">Click to upload image</p>
                    <p className="text-xs text-charcoal-muted/70 mt-1">Will be center-cropped to 1:1 WebP</p>
                  </div>
                )}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

            {/* Square crop warning */}
            {cropWarning && (
              <div className="mt-2 flex items-start gap-2 bg-warning/5 rounded-card px-3 py-2 border border-warning/20">
                <AlertCircle size={15} className="text-warning mt-0.5 shrink-0" />
                <p className="text-xs text-warning font-medium">
                  This image isn't square. It will be <strong>center-cropped to 1:1</strong> and converted to WebP (&lt;1MB) on the server.
                </p>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-charcoal mb-1 block">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="input-field"
              placeholder="e.g., Organic Bananas (1kg)"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-charcoal mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="input-field h-20 resize-none"
              placeholder="Brief product description..."
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-charcoal mb-1 block">Price (Rs) *</label>
              <input
                type="number"
                value={form.priceInCents}
                onChange={(e) => setForm((p) => ({ ...p, priceInCents: Number(e.target.value) }))}
                className="input-field"
                min="1"
                required
              />
              <p className="text-xs text-charcoal-muted mt-1">Stored as: {form.priceInCents * 100} paisa</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-charcoal mb-1 block">Stock *</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                className="input-field"
                min="0"
                required
              />
            </div>
          </div>

          {/* Unit & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-charcoal mb-1 block">Unit</label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
                className="input-field"
                placeholder="e.g., kg, pcs, 500g"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-charcoal mb-1 block">Category *</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                className="input-field"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Available toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm((p) => ({ ...p, isAvailable: !p.isAvailable }))}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${form.isAvailable ? 'bg-primary' : 'bg-cream-dark'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.isAvailable ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm font-medium text-charcoal">Available for purchase</span>
          </label>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
