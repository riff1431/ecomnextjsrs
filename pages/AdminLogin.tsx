
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DB } from '../store';
import { Input, Button, Field } from '../components/ui-components';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulated delay for professional feel
    setTimeout(() => {
      const success = DB.login(email, password);
      if (success) {
        const origin = (location.state as any)?.from?.pathname || '/admin';
        navigate(origin, { replace: true });
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#1C2434] flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#3C50E0] p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 backdrop-blur-md">
               <span className="text-white font-black text-3xl">LS</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Admin Portal</h1>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Management Access Only</p>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <Field label="Work Email">
                <div className="relative">
                  <i className="far fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                  <Input 
                    type="email" 
                    placeholder="admin@leathershop.com" 
                    required 
                    className="pl-11 h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Password">
                <div className="relative">
                  <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    className="pl-11 h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </Field>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-200 text-[#3C50E0]" />
                  <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-gray-600 transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-[10px] font-black uppercase text-[#3C50E0] hover:underline">Forgot password?</button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-500 animate-in slide-in-from-top-1">
                  <i className="fas fa-exclamation-circle"></i>
                  <p className="text-[10px] font-black uppercase tracking-tight">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-[#3C50E0] hover:bg-[#2A3BB7] text-lg rounded-xl shadow-lg shadow-blue-500/20"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Authenticate'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                Default Credentials: <br/> 
                <span className="text-[#3C50E0]">admin@leathershop.com / admin123</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center flex items-center justify-center gap-6">
           <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white text-[10px] font-black uppercase transition-colors tracking-widest">
             <i className="fas fa-arrow-left mr-2"></i> Back to Store
           </button>
           <span className="text-gray-700">|</span>
           <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">© 2025 LeatherShop System</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
