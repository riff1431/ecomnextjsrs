
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ThankYou: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-check text-4xl"></i>
        </div>
        <h1 className="text-2xl font-black text-[#00424b] mb-2 uppercase tracking-tight">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-8">Thank you for shopping with us. We have received your order and will contact you shortly for confirmation.</p>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-dashed border-gray-300">
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Order Tracking ID</p>
           <p className="text-2xl font-black text-[#00424b] tracking-wider">#{id}</p>
        </div>

        <div className="space-y-4">
           <Link to="/track" className="block w-full bg-[#00424b] text-white py-3 rounded-lg font-bold hover:bg-[#005c68] transition-all">Track My Order</Link>
           <Link to="/" className="block w-full border-2 border-[#00424b] text-[#00424b] py-3 rounded-lg font-bold hover:bg-gray-50 transition-all">Continue Shopping</Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-4">
           <a href="#" className="text-gray-400 hover:text-[#00424b] transition-colors"><i className="fab fa-facebook text-xl"></i></a>
           <a href="#" className="text-gray-400 hover:text-[#00424b] transition-colors"><i className="fab fa-whatsapp text-xl"></i></a>
           <a href="#" className="text-gray-400 hover:text-[#00424b] transition-colors"><i className="fas fa-phone-alt text-lg"></i></a>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
