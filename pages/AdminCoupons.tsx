
import React, { useEffect, useState } from 'react';
import { DB } from '../store';
import { Coupon } from '../types';
import { Input, Button, Select, Field } from '../components/ui-components';

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '', type: 'fixed', value: 0, expiryDate: '', usageLimit: 100, isActive: true
  });

  useEffect(() => {
    setCoupons(DB.getCoupons());
  }, []);

  const handleSave = () => {
    if (!formData.code || !formData.value) return;
    const newCoupon = { id: `cp${Date.now()}`, usedCount: 0, ...formData } as Coupon;
    const updated = [newCoupon, ...coupons];
    setCoupons(updated);
    DB.saveCoupons(updated);
    setShowModal(false);
    setFormData({ code: '', type: 'fixed', value: 0, expiryDate: '', usageLimit: 100, isActive: true });
  };

  const deleteCoupon = (id: string) => {
    if (confirm('Delete this coupon?')) {
      const updated = coupons.filter(c => c.id !== id);
      setCoupons(updated);
      DB.saveCoupons(updated);
    }
  };

  const toggleStatus = (id: string) => {
    const updated = coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    setCoupons(updated);
    DB.saveCoupons(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#1C2434] uppercase tracking-tight">Coupons</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manage discount offers</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="h-10 px-6 rounded-lg">Add Coupon</Button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Code</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Value</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Usage</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Expiry</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {coupons.map(cp => (
                <tr key={cp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-black text-[#3C50E0] text-sm tracking-widest">{cp.code}</td>
                  <td className="px-6 py-4 text-[10px] font-black uppercase text-gray-500">{cp.type}</td>
                  <td className="px-6 py-4 font-black text-sm text-[#00424b]">
                    {cp.type === 'fixed' ? `৳ ${cp.value}` : `${cp.value}%`}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-600">
                    <span className="text-[#3C50E0]">{cp.usedCount}</span> / {cp.usageLimit}
                  </td>
                  <td className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-tighter">{cp.expiryDate || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus(cp.id)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${cp.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                      {cp.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => deleteCoupon(cp.id)} className="text-gray-300 hover:text-red-500 transition-colors"><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {coupons.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] flex flex-col items-center gap-3">
            <i className="fas fa-ticket-alt text-4xl opacity-20"></i>
            No coupons created yet
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md p-8 animate-in zoom-in duration-200 border shadow-2xl">
            <h3 className="text-xl font-black text-[#1C2434] uppercase mb-6 tracking-tight">Create Coupon</h3>
            <div className="space-y-4">
              <Field label="Coupon Code">
                <Input placeholder="E.G. NEXT-SALE-20" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Type">
                  <Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}>
                    <option value="fixed">Fixed (Tk)</option>
                    <option value="percentage">Percentage (%)</option>
                  </Select>
                </Field>
                <Field label="Value">
                  <Input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Usage Limit">
                  <Input type="number" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: Number(e.target.value) })} />
                </Field>
                <Field label="Expiry Date">
                  <Input type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                </Field>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1">Create</Button>
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
