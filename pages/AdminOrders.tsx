
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DB } from '../store';
import { Order, OrderStatus } from '../types';
// Fixed: Removed unused Badge import which was causing a compilation error
import { Button, Select, Input } from '../components/ui-components';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const search = searchParams.get('q') || '';

  useEffect(() => {
    setOrders(DB.getOrders());
  }, []);

  const handleStatusUpdate = (orderId: string, status: OrderStatus) => {
    DB.updateOrderStatus(orderId, status);
    const updatedOrders = DB.getOrders();
    setOrders(updatedOrders);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updatedOrders.find(o => o.id === orderId) || null);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      const allOrders = DB.getOrders().filter(o => o.id !== orderId);
      localStorage.setItem('shop_orders', JSON.stringify(allOrders));
      setOrders(allOrders);
      setSelectedOrder(null);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchParams(val ? { q: val } : {});
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'All' || o.status === filter;
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          o.phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.PENDING: return 'bg-amber-50 text-amber-600 border-amber-100';
      case OrderStatus.CONFIRMED: return 'bg-blue-50 text-blue-600 border-blue-100';
      case OrderStatus.SHIPPED: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case OrderStatus.DELIVERED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case OrderStatus.CANCELLED: return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1C2434] uppercase tracking-tight">Orders Center</h2>
          <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-widest">Manage fulfillment & logistics</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
            <input 
              type="text" 
              placeholder="Order ID, Name, Phone..."
              className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#3C50E0] focus:border-transparent outline-none transition-all"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <select 
            className="bg-white border border-gray-200 rounded-lg py-2 px-4 text-sm font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#3C50E0]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Order Details</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Summary</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedOrder(o)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#3C50E0] font-black text-xs">#{o.id.slice(-2)}</div>
                      <div>
                        <h5 className="font-black text-[#1C2434] text-sm group-hover:text-[#3C50E0] transition-colors">#{o.id}</h5>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{new Date(o.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-[#1C2434] uppercase tracking-tight">{o.customerName}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{o.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-[#3C50E0]">Tk {o.totalAmount.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{o.items.length} item(s)</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusStyle(o.status)}`}>
                      <span className={`w-1 h-1 rounded-full mr-1.5 ${o.status === OrderStatus.PENDING ? 'bg-amber-500' : o.status === OrderStatus.DELIVERED ? 'bg-emerald-500' : 'bg-current'}`}></span>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(o)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-[#3C50E0] hover:border-[#3C50E0] transition-all shadow-sm"
                    >
                      <i className="far fa-eye text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="p-24 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4 border border-gray-100">
               <i className="fas fa-inbox text-2xl"></i>
            </div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching orders</h3>
            <button onClick={() => handleSearchChange('')} className="mt-4 text-[#3C50E0] text-xs font-black uppercase hover:underline">Clear Filters</button>
          </div>
        )}
      </div>

      {/* Order Detail Slide-over Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-[#1C2434] text-white">
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest">Order Details</h3>
                <p className="text-xs text-gray-400 font-bold uppercase mt-1">#{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              {/* Status & Quick Actions */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Change Current Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.values(OrderStatus).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${selectedOrder.status === status ? 'bg-[#3C50E0] text-white border-[#3C50E0] shadow-md' : 'bg-white text-gray-400 border-gray-200 hover:border-[#3C50E0] hover:text-[#3C50E0]'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <button className="flex flex-col items-center gap-1 group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#3C50E0] group-hover:border-[#3C50E0] transition-all">
                        <i className="fas fa-print text-sm"></i>
                      </div>
                      <span className="text-[8px] font-black uppercase text-gray-400">Invoice</span>
                   </button>
                   <button onClick={() => handleDeleteOrder(selectedOrder.id)} className="flex flex-col items-center gap-1 group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-rose-500 group-hover:border-rose-500 transition-all">
                        <i className="fas fa-trash-alt text-sm"></i>
                      </div>
                      <span className="text-[8px] font-black uppercase text-gray-400">Delete</span>
                   </button>
                </div>
              </div>

              {/* Customer Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-[#1C2434] uppercase tracking-[0.2em] flex items-center gap-2">
                    <i className="fas fa-user text-[#3C50E0]"></i> Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</p>
                      <p className="text-sm font-black text-[#1C2434] mt-0.5">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                      <p className="text-sm font-black text-[#3C50E0] mt-0.5">{selectedOrder.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-[#1C2434] uppercase tracking-[0.2em] flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-[#3C50E0]"></i> Delivery Address
                  </h4>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Address</p>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed mt-1">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-[#1C2434] uppercase tracking-[0.2em] flex items-center gap-2 border-b pb-4">
                  <i className="fas fa-shopping-basket text-[#3C50E0]"></i> Order Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-5 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="w-16 h-16 rounded-lg bg-white border border-gray-100 flex items-center justify-center font-black text-[10px] text-[#3C50E0] shadow-sm uppercase shrink-0">
                        {item.variation}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h5 className="text-sm font-black text-[#1C2434] uppercase truncate tracking-tight">{item.name}</h5>
                         <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">|</span>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit: Tk {item.price}</span>
                         </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-[#1C2434]">Tk {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.note && (
                <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 space-y-2">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Customer Note</p>
                  <p className="text-sm font-medium text-amber-800 leading-relaxed italic">"{selectedOrder.note}"</p>
                </div>
              )}

              {/* Totals */}
              <div className="pt-8 border-t space-y-3">
                <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-[#1C2434]">Tk {(selectedOrder.totalAmount - selectedOrder.shippingFee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                  <span>Shipping Fee</span>
                  <span className="text-[#1C2434]">Tk {selectedOrder.shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-gray-100 mt-2">
                   <span className="text-sm font-black text-[#1C2434] uppercase tracking-[0.2em]">Total Amount</span>
                   <div className="text-right">
                     <p className="text-3xl font-black text-[#3C50E0]">Tk {selectedOrder.totalAmount.toLocaleString()}</p>
                     <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Payment Method: COD</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t flex justify-end gap-4">
               <Button variant="outline" onClick={() => setSelectedOrder(null)} className="h-12 px-8">Close Panel</Button>
               <Button onClick={() => window.print()} className="h-12 px-10 shadow-lg bg-[#3C50E0] hover:bg-[#2A3BB7]">Print Order</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
