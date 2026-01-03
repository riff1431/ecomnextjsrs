
import React, { useState } from 'react';
import { DB } from '../store';
import { Order, OrderStatus } from '../types';
import { Input, Button, Field } from '../components/ui-components';

const OrderTracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const orders = DB.getOrders();
    const found = orders.find(o => 
      (o.id.toLowerCase() === orderId.toLowerCase() || o.id.toLowerCase() === `#${orderId.toLowerCase()}`) && 
      o.phone.includes(phone)
    );
    setResult(found || null);
    setSearched(true);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case OrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-700';
      case OrderStatus.SHIPPED: return 'bg-purple-100 text-purple-700';
      case OrderStatus.DELIVERED: return 'bg-green-100 text-green-700';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-[#00424b] uppercase tracking-tight mb-2">Track Your Order</h1>
        <p className="text-gray-500 font-medium text-sm">Enter your order ID and phone number to see the current status of your delivery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form onSubmit={handleTrack} className="bg-white p-6 rounded-2xl shadow-lg border space-y-4 sticky top-24">
            <Field label="Order ID">
              <Input 
                placeholder="ORD-123456" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </Field>
            <Field label="Phone Number">
              <Input 
                type="tel" 
                placeholder="017XXXXXXXX" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <Button type="submit" className="w-full h-12 shadow-lg">Track Now</Button>
          </form>
        </div>

        <div className="md:col-span-2">
          {searched ? (
            result ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border animate-in fade-in slide-in-from-bottom duration-500">
                <div className="bg-[#00424b] p-6 text-white flex justify-between items-center">
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Order ID</p>
                     <p className="text-xl font-black tracking-wider">#{result.id}</p>
                   </div>
                   <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(result.status)}`}>
                     {result.status}
                   </div>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Shipping Address</h4>
                      <p className="font-black text-[#00424b] uppercase text-sm tracking-tight">{result.customerName}</p>
                      <p className="text-sm text-gray-600 mt-1 font-medium">{result.address}</p>
                      <p className="text-sm text-gray-600 font-bold">{result.phone}</p>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Order Date</h4>
                       <p className="text-sm font-black text-[#00424b] uppercase tracking-tighter">{new Date(result.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="border-t pt-8">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Items</h4>
                    <div className="space-y-4">
                      {result.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-[10px] text-[#00424b] border uppercase">{item.variation}</div>
                            <div>
                               <p className="text-xs font-black text-[#00424b] uppercase tracking-tight">{item.name}</p>
                               <p className="text-[10px] text-gray-400 font-bold uppercase">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-black text-sm text-[#00424b]">Tk {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-8 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span>Shipping Fee</span>
                      <span>Tk {result.shippingFee}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-black text-[#00424b] uppercase tracking-widest">Grand Total</span>
                      <span className="text-2xl font-black text-[#00424b]">Tk {result.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50/50 border-2 border-dashed border-red-200 p-12 rounded-2xl text-center">
                 <i className="fas fa-exclamation-circle text-4xl text-red-400 mb-4"></i>
                 <h3 className="text-lg font-black text-red-700 uppercase tracking-tight">Order Not Found</h3>
                 <p className="text-red-600/70 text-sm mt-2 uppercase font-bold tracking-widest">Please check your Order ID and phone number again.</p>
              </div>
            )
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-12 rounded-2xl flex flex-col items-center justify-center text-gray-400">
               <i className="fas fa-box-open text-5xl mb-4"></i>
               <p className="font-black text-xs uppercase tracking-widest">Waiting for search...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
