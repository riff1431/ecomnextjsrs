
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DB } from '../store';
import { Product } from '../types';
import { Input, Textarea, Select, Button, Field } from '../components/ui-components';

interface ProductModalProps {
  product?: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
  title: string;
}

const ProductFormModal: React.FC<ProductModalProps> = ({ product, onClose, onSave, title }) => {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: `p${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      category: '',
      images: [],
      variations: [],
      stock: 0,
      isVisible: true,
      isFeatured: false,
    }
  );
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    onSave(formData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [...formData.images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      newImages.push(base64);
    }

    setFormData({ ...formData, images: newImages });
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-20">
          <div>
            <h2 className="text-xl font-black text-[#1C2434] uppercase tracking-tight">{title}</h2>
            <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-widest">Inventory Management</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-[#1C2434] uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-images"></i> Product Gallery
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square border-2 border-gray-100 rounded-lg overflow-hidden bg-gray-50 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="bg-white text-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform"
                    >
                      <i className="fas fa-trash-alt text-sm"></i>
                    </button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#3C50E0] text-white text-[8px] font-black uppercase text-center py-0.5">Thumbnail</span>
                  )}
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#3C50E0] hover:bg-[#3C50E0]/5 transition-all group">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
                <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'} text-2xl text-gray-300 group-hover:text-[#3C50E0] transition-colors`}></i>
                <span className="text-[9px] font-black text-gray-400 uppercase mt-2 group-hover:text-[#3C50E0]">Upload Images</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Product Name">
              <Input 
                required
                placeholder="Premium Loafer..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <Select 
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="Casual Shoes">Casual Shoes</option>
                <option value="Formal Shoes">Formal Shoes</option>
                <option value="Loafers">Loafers</option>
                <option value="Boots">Boots</option>
                <option value="Sandal">Sandal</option>
                <option value="Cycle Shoes">Cycle Shoes</option>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="Sale Price (Tk)">
              <Input 
                type="number" 
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </Field>
            <Field label="Regular Price">
              <Input 
                type="number" 
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
              />
            </Field>
            <Field label="Stock">
              <Input 
                type="number" 
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              />
            </Field>
          </div>

          <Field label="Description">
            <Textarea 
              className="min-h-[120px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-[#3C50E0]" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Featured Item</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-[#3C50E0]" checked={formData.isVisible} onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Visible on Store</span>
            </label>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={uploading}
              className="w-full h-14 bg-[#1C2434] hover:bg-[#3C50E0]"
            >
              {uploading ? 'Processing...' : product ? 'Update Product' : 'Create Product Listing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    setProducts(DB.getProducts());
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchParams(val ? { q: val } : {});
  };

  const toggleVisibility = (id: string) => {
    const updated = products.map(p => p.id === id ? {...p, isVisible: !p.isVisible} : p);
    setProducts(updated);
    DB.saveProducts(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this product?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      DB.saveProducts(updated);
    }
  };

  const handleSaveProduct = (productData: Product) => {
    let updated: Product[];
    if (editingProduct) {
      updated = products.map(p => p.id === productData.id ? productData : p);
    } else {
      updated = [productData, ...products];
    }
    setProducts(updated);
    DB.saveProducts(updated);
    setEditingProduct(null);
    setShowAddModal(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#1C2434] uppercase tracking-tight">Products Catalog</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{products.length} Items Total</p>
          </div>
        </div>

        <Button 
          onClick={() => setShowAddModal(true)}
          className="px-10 h-12 rounded-xl"
        >
          <i className="fas fa-plus-circle mr-2"></i> Add Product
        </Button>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div className="relative group">
          <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3C50E0] transition-colors"></i>
          <input 
            type="text" 
            placeholder="Search products by name, category or ID..." 
            className="w-full pl-14 pr-14 py-5 rounded-xl bg-transparent text-lg font-bold text-[#1C2434] focus:outline-none placeholder:text-gray-300 transition-all"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => handleSearchChange('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
             <div className="relative aspect-square overflow-hidden bg-gray-50">
               <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                 <button 
                  onClick={() => toggleVisibility(product.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-all ${product.isVisible ? 'bg-white text-[#10B981]' : 'bg-[#FB4D4D] text-white'}`}
                 >
                   <i className={product.isVisible ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                 </button>
               </div>
               {product.isFeatured && (
                 <div className="absolute top-4 left-4">
                   <span className="bg-[#f0b129] text-[#00424b] text-[10px] font-black px-3 py-1 rounded-full shadow-lg border border-white/20 uppercase tracking-widest">Featured</span>
                 </div>
               )}
               {!product.isVisible && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                   <span className="bg-white/90 text-[#FB4D4D] px-4 py-2 rounded-lg font-black uppercase tracking-widest text-xs">Hidden</span>
                 </div>
               )}
             </div>
             <div className="p-6 space-y-5">
                <div>
                   <h3 className="font-black text-[#1C2434] text-sm line-clamp-1 uppercase tracking-tight">{product.name}</h3>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{product.category}</p>
                </div>

                <div className="flex justify-between items-end border-y border-gray-50 py-4">
                   <div>
                     <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Stock</p>
                     <p className={`text-sm font-black ${product.stock < 10 ? 'text-[#FB4D4D]' : 'text-[#1C2434]'}`}>{product.stock} items</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Price</p>
                     <p className="text-lg font-black text-[#3C50E0]">Tk {product.price}</p>
                   </div>
                </div>

                <div className="flex gap-3">
                   <Button variant="outline" onClick={() => setEditingProduct(product)} className="flex-[2] h-9 text-[10px]">Edit</Button>
                   <Button variant="outline" onClick={() => handleDelete(product.id)} className="flex-1 h-9 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50">Del</Button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4 border border-[#E2E8F0]">
              <i className="fas fa-search text-3xl"></i>
           </div>
           <h3 className="text-xl font-black text-[#1C2434] uppercase tracking-tight">No results found</h3>
           <p className="text-gray-400 text-sm mt-2 max-w-xs uppercase font-bold tracking-widest">We couldn't find any products matching "{searchQuery}".</p>
           <Button variant="ghost" onClick={() => handleSearchChange('')} className="mt-6 text-xs">Clear Search</Button>
        </div>
      )}

      {(editingProduct || showAddModal) && (
        <ProductFormModal 
          product={editingProduct || undefined} 
          onClose={() => { setEditingProduct(null); setShowAddModal(false); }} 
          onSave={handleSaveProduct} 
          title={editingProduct ? "Update Product" : "Create Product"}
        />
      )}
    </div>
  );
};

export default AdminProducts;
