
import React, { useState, useEffect } from 'react';
import { Product, OrderStatus } from '../types';
import { DB } from '../store';
import { Input, Textarea, Button, Field } from './ui-components';

interface QuickOrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

const QuickOrderModal: React.FC<QuickOrderModalProps> = ({ product, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    variation: '',
    quantity: 1,
    shippingFee: 70,
    note: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (product.variations.length > 0) {
      setFormData(prev => ({ ...prev, variation: product.variations[0] }));
    }
  }, [product]);

  if (!isOpen) return null;

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      setError('Please fill in all required fields.');
      return;
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalAmount = (product.price * formData.quantity) + formData.shippingFee;

    const newOrder = {
      id: orderId,
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      items: [{
        productId: product.id,
        name: product.name,
        variation: formData.variation,
        quantity: formData.quantity,
        price: product.price
      }],
      totalAmount,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      shippingFee: formData.shippingFee,
      note: formData.note
    };

    DB.saveOrder(newOrder);
    onSuccess(orderId);
  };

  const subtotal = product.price * formData.quantity;
  const total = subtotal + formData.shippingFee;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-sm font-black text-[#00424b] text-center w-full uppercase tracking-tighter">ক্যাশ অন ডেলিভারিতে অর্ডার করতে আপনার তথ্য দিন</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors absolute right-4">
            <i className="fas fa-times text-gray-400"></i>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleOrder} className="space-y-4">
            <Field label="আপনার নাম *">
              <Input 
                placeholder="আপনার নাম লিখুন" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Field>

            <Field label="ফোন নাম্বার *">
              <Input 
                type="tel" 
                placeholder="ফোন নাম্বার লিখুন" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </Field>

            <Field label="আপনার ফুল অ্যাড্রেস *">
              <Textarea 
                placeholder="আপনার ফুল অ্যাড্রেস লিখুন" 
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </Field>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">শিপিং মেথড</label>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, shippingFee: 70})}
                  className={`flex items-center justify-between p-3 border-2 rounded-lg text-sm transition-all ${formData.shippingFee === 70 ? 'border-[#f0b129] bg-[#f0b129]/5' : 'border-gray-100'}`}
                >
                  <span className="font-medium">ঢাকা শহরের ভেতরে</span>
                  <span className="font-bold">৳ 70.00</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, shippingFee: 120})}
                  className={`flex items-center justify-between p-3 border-2 rounded-lg text-sm transition-all ${formData.shippingFee === 120 ? 'border-[#f0b129] bg-[#f0b129]/5' : 'border-gray-100'}`}
                >
                  <span className="font-medium">ঢাকা শহরের বাইরে</span>
                  <span className="font-bold">৳ 120.00</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
              <div className="flex gap-4">
                <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-lg border bg-white" />
                <div className="flex-1">
                  <h4 className="font-black text-xs text-[#00424b] line-clamp-1 uppercase tracking-tight">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-white border px-2 py-0.5 rounded font-black uppercase text-gray-500">{formData.variation}</span>
                    <span className="text-sm font-black text-[#00424b]">৳ {product.price}</span>
                  </div>
                </div>
                <div className="flex items-center border rounded-md overflow-hidden h-8 bg-white">
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, quantity: Math.max(1, prev.quantity - 1)}))}
                    className="px-2 hover:bg-gray-100 transition-colors"
                  >
                    <i className="fas fa-minus text-[10px]"></i>
                  </button>
                  <span className="px-3 text-sm font-bold">{formData.quantity}</span>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, quantity: prev.quantity + 1}))}
                    className="px-2 hover:bg-gray-100 transition-colors"
                  >
                    <i className="fas fa-plus text-[10px]"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-3 text-xs">
                <div className="flex justify-between text-gray-500 font-bold uppercase tracking-wider">
                  <span>সাবটোটাল</span>
                  <span>৳ {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-bold uppercase tracking-wider">
                  <span>ডেলিভারি</span>
                  <span>৳ {formData.shippingFee}</span>
                </div>
                <div className="flex justify-between font-black text-lg text-[#00424b] border-t border-gray-100 pt-2 uppercase">
                  <span>মোট</span>
                  <span>৳ {total}</span>
                </div>
              </div>
            </div>

            <Field label="অর্ডার নোট (ঐচ্ছিক)">
               <Input 
                placeholder="অর্ডার নোট লিখুন" 
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
              />
            </Field>

            {error && <p className="text-red-500 text-xs text-center font-bold uppercase tracking-tight">{error}</p>}

            <Button 
              type="submit" 
              className="w-full h-14 bg-[#00a651] hover:bg-[#008c44] text-lg rounded-xl shadow-lg"
            >
              অর্ডার কনফার্ম করুন
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuickOrderModal;
