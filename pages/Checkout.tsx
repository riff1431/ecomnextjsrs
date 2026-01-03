
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DB } from '../store';
import { CartItem, OrderStatus, Order } from '../types';
import { Input, Textarea, Button, Field } from '../components/ui-components';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    shippingFee: 70,
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const items = DB.getCart();
    if (items.length === 0) {
      navigate('/');
    }
    setCartItems(items);
  }, [navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + formData.shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        variation: item.variation,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: total,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      shippingFee: formData.shippingFee,
      note: formData.note
    };

    try {
      DB.saveOrder(newOrder);
      DB.clearCart();
      navigate(`/thank-you/${orderId}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-center gap-4 mb-10 text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400">
           <Link to="/" className="hover:text-[#00424b]">Cart</Link>
           <i className="fas fa-chevron-right text-[8px]"></i>
           <span className="text-[#00424b] border-b-2 border-[#f0b129] pb-1">Checkout</span>
           <i className="fas fa-chevron-right text-[8px]"></i>
           <span>Confirmation</span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl md:text-2xl font-black text-[#00424b] uppercase tracking-tight mb-8 flex items-center gap-3">
                 <i className="fas fa-truck-loading text-[#f0b129]"></i>
                 Shipping Information
              </h2>

              <div className="space-y-6">
                <Field label="Full Name *">
                  <Input 
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </Field>

                <Field label="Phone Number *">
                  <Input 
                    type="tel" 
                    required
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </Field>

                <Field label="Delivery Address *">
                  <Textarea 
                    required
                    placeholder="Enter your detailed house address, road, area..."
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </Field>

                <div className="space-y-4">
                  <label className="text-xs font-black text-[#00424b] uppercase tracking-widest ml-1">Shipping Area</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, shippingFee: 70})}
                      className={`flex items-center justify-between p-5 border-2 rounded-xl transition-all ${formData.shippingFee === 70 ? 'border-[#00424b] bg-[#00424b]/5 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                    >
                      <div className="text-left">
                        <p className="font-bold text-[#00424b] text-sm">Inside Dhaka</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">1-2 Days Delivery</p>
                      </div>
                      <span className="font-black text-[#00424b]">৳ 70</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, shippingFee: 120})}
                      className={`flex items-center justify-between p-5 border-2 rounded-xl transition-all ${formData.shippingFee === 120 ? 'border-[#00424b] bg-[#00424b]/5 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                    >
                      <div className="text-left">
                        <p className="font-bold text-[#00424b] text-sm">Outside Dhaka</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">3-5 Days Delivery</p>
                      </div>
                      <span className="font-black text-[#00424b]">৳ 120</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="bg-green-50/50 p-4 rounded-xl flex items-center gap-4 border border-green-100">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <i className="fas fa-hand-holding-usd text-lg"></i>
                    </div>
                    <div>
                      <p className="font-black text-xs text-[#00424b] uppercase tracking-widest">Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-[#00424b]/60 font-medium">Pay only after receiving your product at your doorstep.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Field label="Order Notes (Optional)" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <Textarea 
                placeholder="Special instructions for delivery (e.g. deliver after 4 PM)"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
              />
            </Field>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#00424b] px-6 py-4 text-white">
                   <h3 className="text-sm font-black uppercase tracking-[0.2em]">Order Summary</h3>
                </div>
                
                <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                   {cartItems.map((item) => (
                     <div key={item.id} className="flex gap-4 items-center">
                        <div className="relative shrink-0">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border bg-white" />
                          <span className="absolute -top-2 -right-2 bg-[#00424b] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-[#00424b] uppercase truncate tracking-tight">{item.name}</h4>
                          <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase">SIZE: {item.variation}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-[#00424b]">৳ {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-6 bg-gray-50 border-t space-y-3">
                   <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                     <span>Subtotal</span>
                     <span className="text-[#00424b]">৳ {subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                     <span>Shipping</span>
                     <span className="text-[#00424b]">৳ {formData.shippingFee}</span>
                   </div>
                   <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="text-sm font-black text-[#00424b] uppercase tracking-[0.2em]">Grand Total</span>
                      <span className="text-2xl font-black text-[#00424b]">৳ {total.toLocaleString()}</span>
                   </div>
                </div>

                <div className="p-6 bg-white space-y-4">
                   <div className="flex gap-2">
                     <Input 
                      placeholder="Coupon Code"
                      className="flex-1 font-bold uppercase"
                     />
                     <Button variant="secondary" className="px-6 h-10">Apply</Button>
                   </div>

                   {error && (
                     <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-50 p-3 rounded-lg border border-red-100">
                       <i className="fas fa-exclamation-circle mr-2"></i> {error}
                     </p>
                   )}

                   <Button 
                     type="submit" 
                     disabled={isSubmitting}
                     className={`w-full h-14 bg-[#00a651] hover:bg-[#008c44] text-lg rounded-xl shadow-xl flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                   >
                     {isSubmitting ? (
                       <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                     ) : (
                       <><i className="fas fa-check-circle"></i> Confirm Order</>
                     )}
                   </Button>
                </div>
              </div>

              <div className="text-center space-y-4">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                   By placing your order, you agree to our <br/> 
                   <span className="underline cursor-pointer hover:text-[#00424b]">Terms of Service</span> and <span className="underline cursor-pointer hover:text-[#00424b]">Privacy Policy</span>
                 </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
