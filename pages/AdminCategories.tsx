
import React, { useEffect, useState } from 'react';
import { DB } from '../store';
import { Category } from '../types';
import { Input, Button, Field } from '../components/ui-components';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', image: '' });

  useEffect(() => {
    setCategories(DB.getCategories());
  }, []);

  const handleSave = () => {
    if (!formData.name || !formData.image) return;
    let updated: Category[];
    if (editing) {
      updated = categories.map(c => c.id === editing.id ? { ...c, ...formData } : c);
    } else {
      updated = [...categories, { id: `c${Date.now()}`, ...formData }];
    }
    setCategories(updated);
    DB.saveCategories(updated);
    setShowModal(false);
    setEditing(null);
    setFormData({ name: '', image: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const deleteCategory = (id: string) => {
    if (confirm('Delete this category?')) {
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      DB.saveCategories(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#1C2434] uppercase tracking-tight">Categories</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Organize your products</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="h-10 px-6 rounded-lg"
        >
          Add New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white border rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all">
            <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
              <img src={cat.image} className="max-w-full max-h-full object-contain mix-blend-multiply" alt="" />
            </div>
            <div className="p-4 flex flex-col items-center">
              <h3 className="font-black text-[#00424b] uppercase text-xs tracking-widest">{cat.name}</h3>
              <div className="flex gap-4 mt-3">
                <button onClick={() => { setEditing(cat); setFormData({ name: cat.name, image: cat.image }); setShowModal(true); }} className="text-[#3C50E0] text-[10px] font-black uppercase hover:underline">Edit</button>
                <button onClick={() => deleteCategory(cat.id)} className="text-red-500 text-[10px] font-black uppercase hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md p-8 animate-in zoom-in duration-200 border shadow-2xl">
            <h3 className="text-xl font-black text-[#1C2434] uppercase mb-6 tracking-tight">{editing ? 'Edit' : 'Add'} Category</h3>
            <div className="space-y-4">
              <Field label="Category Name">
                <Input 
                  placeholder="e.g. Formal Shoes"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </Field>
              <Field label="Category Image">
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-100 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <i className="fas fa-cloud-upload-alt text-2xl text-gray-300 mb-2"></i>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Select Image</p>
                      </div>
                      <input type="file" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                  {formData.image && (
                    <div className="flex justify-center">
                      <div className="relative w-20 h-20 border rounded-lg overflow-hidden bg-gray-50 p-2">
                        <img src={formData.image} className="w-full h-full object-contain mix-blend-multiply" />
                        <button 
                          onClick={() => setFormData({...formData, image: ''})}
                          className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px]"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Field>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1">Save</Button>
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
