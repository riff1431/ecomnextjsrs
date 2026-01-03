
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import ThankYou from './pages/ThankYou';
import OrderTracking from './pages/OrderTracking';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminCoupons from './pages/AdminCoupons';
import AdminSettings from './pages/AdminSettings';
import AdminLogin from './pages/AdminLogin';
import { Order } from './types';
import { DB } from './store';

// Protection Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  if (!DB.isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [notifications, setNotifications] = useState<Order[]>([]);
  const [showNotificationToast, setShowNotificationToast] = useState<Order | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  };

  useEffect(() => {
    const handleNewOrder = (event: any) => {
      const order = event.detail as Order;
      setNotifications(prev => [order, ...prev]);
      setShowNotificationToast(order);
      playNotificationSound();
      setTimeout(() => setShowNotificationToast(null), 5000);
    };
    window.addEventListener('new-order-placed', handleNewOrder);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'shop_orders' && e.newValue) {
        const orders = JSON.parse(e.newValue) as Order[];
        if (orders.length > 0) {
          const newest = orders[0];
          setNotifications(prev => {
            if (prev.find(o => o.id === newest.id)) return prev;
            playNotificationSound();
            setShowNotificationToast(newest);
            setTimeout(() => setShowNotificationToast(null), 5000);
            return [newest, ...prev];
          });
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('new-order-placed', handleNewOrder);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    DB.logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: 'fas fa-th-large', path: '/admin' },
    { label: 'Orders', icon: 'fas fa-shopping-cart', path: '/admin/orders' },
    { label: 'Products', icon: 'fas fa-box', path: '/admin/products' },
    { label: 'Categories', icon: 'fas fa-tags', path: '/admin/categories' },
    { label: 'Coupons', icon: 'fas fa-ticket-alt', path: '/admin/coupons' },
    { label: 'Settings', icon: 'fas fa-cog', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9]">
      {showNotificationToast && (
        <div 
          onClick={() => { navigate('/admin/orders'); setShowNotificationToast(null); }}
          className="fixed top-4 right-4 z-[99999] w-80 bg-white border-l-4 border-[#10B981] shadow-2xl p-4 rounded-lg cursor-pointer animate-in slide-in-from-right fade-in duration-300 group"
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-green-50 text-[#10B981] rounded-full flex items-center justify-center shrink-0">
                <i className="fas fa-shopping-bag animate-bounce"></i>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-400 tracking-widest">New Order Received!</p>
                <p className="text-sm font-bold text-[#1C2434] mt-0.5">#{showNotificationToast.id}</p>
                <p className="text-[10px] text-gray-500 font-medium">From {showNotificationToast.customerName}</p>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setShowNotificationToast(null); }} className="text-gray-300 hover:text-gray-500">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>
      )}

      <aside className={`absolute left-0 top-0 z-[9999] flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#1C2434] duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64`}>
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 mt-2">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#3C50E0] rounded flex items-center justify-center text-white font-black text-xl">LS</div>
            <span className="text-2xl font-bold text-white tracking-tight">TailAdmin</span>
          </Link>
        </div>
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear p-4">
          <nav className="mt-5 px-4 lg:mt-9">
            <h3 className="mb-4 ml-4 text-sm font-semibold text-[#8A99AF]">MENU</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-[#DEE4EE] duration-300 ease-in-out hover:bg-[#333A48] ${location.pathname === item.path ? 'bg-[#333A48]' : ''}`}>
                    <i className={`${item.icon} text-lg ${location.pathname === item.path ? 'text-white' : 'text-[#8A99AF]'}`}></i>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-auto p-8">
           <button onClick={handleLogout} className="flex items-center gap-3 text-[#8A99AF] hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
             <i className="fas fa-sign-out-alt"></i> Logout
           </button>
        </div>
      </aside>

      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <header className="sticky top-0 z-40 flex w-full bg-white drop-shadow-1">
          <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="block rounded-sm border border-[#E2E8F0] bg-white p-1.5 shadow-sm">
                <i className="fas fa-bars"></i>
              </button>
            </div>
            <div className="hidden sm:block">
              <div className="relative">
                <i className="fas fa-search absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="text" placeholder="Search data..." className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125" value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                  <span className="hidden text-right lg:block">
                    <span className="block text-sm font-medium text-black">Admin User</span>
                    <span className="block text-xs font-medium text-gray-500">Store Manager</span>
                  </span>
                  <span className="h-12 w-12 rounded-full overflow-hidden border-2 border-[#E2E8F0]">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=3C50E0&color=fff" alt="User" />
                  </span>
                </button>
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-4 w-48 bg-white border rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                      <i className="fas fa-power-off"></i> Logout Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main><div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">{children}</div></main>
      </div>
    </div>
  );
};

const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/shop" element={<CustomerLayout><Shop /></CustomerLayout>} />
        <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
        <Route path="/thank-you/:id" element={<CustomerLayout><ThankYou /></CustomerLayout>} />
        <Route path="/track" element={<CustomerLayout><OrderTracking /></CustomerLayout>} />
        <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><AdminLayout><AdminCategories /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/coupons" element={<ProtectedRoute><AdminLayout><AdminCoupons /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
