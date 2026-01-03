
import React, { useEffect, useState } from 'react';
// Added missing Link import from react-router-dom
import { Link } from 'react-router-dom';
import { DB } from '../store';
import { Order, OrderStatus, Product } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setOrders(DB.getOrders());
    setProducts(DB.getProducts());
  }, []);

  const totalRevenue = orders
    .filter(o => o.status === OrderStatus.DELIVERED)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;
  const lowStock = products.filter(p => p.stock < 10).length;

  const stats = [
    { label: 'Total Revenue', value: `Tk ${totalRevenue.toLocaleString()}`, icon: 'fas fa-eye', color: '#3C50E0', change: '+2.5%', isUp: true },
    { label: 'Total Orders', value: orders.length.toString(), icon: 'fas fa-shopping-cart', color: '#3C50E0', change: '+0.5%', isUp: true },
    { label: 'Pending Action', value: pendingOrders.toString(), icon: 'fas fa-clock', color: '#3C50E0', change: '-1.2%', isUp: false },
    { label: 'Low Stock', value: lowStock.toString(), icon: 'fas fa-exclamation-triangle', color: '#3C50E0', change: '+2 items', isUp: false },
  ];

  const chartData = [
    { name: 'Pending', count: orders.filter(o => o.status === OrderStatus.PENDING).length, color: '#FACC15' },
    { name: 'Confirmed', count: orders.filter(o => o.status === OrderStatus.CONFIRMED).length, color: '#3C50E0' },
    { name: 'Shipped', count: orders.filter(o => o.status === OrderStatus.SHIPPED).length, color: '#80CAEE' },
    { name: 'Delivered', count: orders.filter(o => o.status === OrderStatus.DELIVERED).length, color: '#10B981' },
    { name: 'Cancelled', count: orders.filter(o => o.status === OrderStatus.CANCELLED).length, color: '#FB4D4D' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-sm border border-[#E2E8F0] bg-white py-6 px-7.5 shadow-sm">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#EFF2F7] text-[#3C50E0] mb-4">
              <i className={stat.icon}></i>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h4 className="text-2xl font-bold text-black">{stat.value}</h4>
                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${stat.isUp ? 'text-[#10B981]' : 'text-[#FB4D4D]'}`}>
                {stat.change}
                <i className={`fas fa-arrow-${stat.isUp ? 'up' : 'down'}`}></i>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        {/* Chart */}
        <div className="col-span-12 rounded-sm border border-[#E2E8F0] bg-white px-5 pt-7.5 pb-5 shadow-sm xl:col-span-8">
           <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-6">
             <div className="flex w-full flex-wrap gap-3 sm:gap-5">
               <h3 className="text-xl font-semibold text-black">Order Analytics</h3>
             </div>
           </div>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <Tooltip 
                    cursor={{fill: '#F1F5F9'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Top Channels / Recent Orders */}
        <div className="col-span-12 rounded-sm border border-[#E2E8F0] bg-white px-5 pt-6 pb-2.5 shadow-sm xl:col-span-4">
           <h4 className="mb-6 text-xl font-semibold text-black">Recent Orders</h4>
           <div className="flex flex-col">
              <div className="grid grid-cols-3 rounded-sm bg-[#F7F9FC]">
                 <div className="p-2.5 xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Order</h5></div>
                 <div className="p-2.5 text-center xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Amt</h5></div>
                 <div className="p-2.5 text-center xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Stat</h5></div>
              </div>
              {orders.slice(0, 5).map((o, key) => (
                <div key={key} className={`grid grid-cols-3 ${key === orders.slice(0, 5).length - 1 ? '' : 'border-b border-[#E2E8F0]'}`}>
                   <div className="flex items-center gap-3 p-2.5 xl:p-5">
                      <div className="flex-shrink-0">
                         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">#{o.id.split('-')[1].slice(0,2)}</div>
                      </div>
                      <p className="hidden font-medium text-black sm:block text-sm">#{o.id}</p>
                   </div>
                   <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className="font-medium text-black text-sm">Tk {o.totalAmount}</p>
                   </div>
                   <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className={`font-medium text-xs px-2 py-1 rounded-full ${
                        o.status === OrderStatus.DELIVERED ? 'bg-[#10B981]/10 text-[#10B981]' : 
                        o.status === OrderStatus.PENDING ? 'bg-[#FACC15]/10 text-[#FACC15]' : 'bg-gray-100'
                      }`}>
                        {o.status.charAt(0)}
                      </p>
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-4 text-center">
              <Link to="/admin/orders" className="text-sm font-medium text-[#3C50E0] hover:underline">View All Orders</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
