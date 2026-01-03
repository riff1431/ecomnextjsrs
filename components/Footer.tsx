
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#002d33] text-white pt-12 pb-6">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#f0b129] rounded flex items-center justify-center text-[#00424b] font-black">LS</div>
            <span className="text-xl font-bold">LeatherShop</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Step into style with LeatherShop. We offer a curated collection of the finest footwear, blending comfort, quality, and the latest trends.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[#f0b129] hover:border-transparent transition-colors">
              <i className="fab fa-facebook-f text-sm"></i>
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[#f0b129] hover:border-transparent transition-colors">
              <i className="fab fa-instagram text-sm"></i>
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[#f0b129] hover:border-transparent transition-colors">
              <i className="fab fa-youtube text-sm"></i>
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-[#f0b129]">Home</Link></li>
            <li><Link to="/track" className="hover:text-[#f0b129]">Track Order</Link></li>
            <li><Link to="/" className="hover:text-[#f0b129]">All Products</Link></li>
            <li><Link to="/admin" className="hover:text-[#f0b129]">Admin Panel</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6">Categories</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-[#f0b129]">Formal Shoes</Link></li>
            <li><Link to="/" className="hover:text-[#f0b129]">Casual Shoes</Link></li>
            <li><Link to="/" className="hover:text-[#f0b129]">Loafers</Link></li>
            <li><Link to="/" className="hover:text-[#f0b129]">Boots</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6">Get In Touch</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex gap-3">
              <i className="fas fa-map-marker-alt text-[#f0b129] mt-1"></i>
              <span>123 Leather Lane, Shoe District<br/>Dhaka, Bangladesh</span>
            </li>
            <li className="flex gap-3">
              <i className="fas fa-phone-alt text-[#f0b129]"></i>
              <span>+880 1709 306560</span>
            </li>
            <li className="flex gap-3">
              <i className="fas fa-envelope text-[#f0b129]"></i>
              <span>support@leathershop.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>&copy; 2025 LeatherShop. All rights reserved. | Designed for Excellence</p>
      </div>
    </footer>
  );
};

export default Footer;
