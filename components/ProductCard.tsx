
import React, { useState } from 'react';
import { Product } from '../types';
import QuickOrderModal from './QuickOrderModal';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Mock colors since they aren't in the types yet, for visual fidelity to the PRD image
  const mockColors = ['#000000', '#D4AF37', '#8B4513'];

  return (
    <>
      <div className="group relative bg-white rounded-lg transition-all duration-300 hover:z-20">
        {/* Main Card Container */}
        <div className="relative flex flex-col p-2 h-full border border-transparent group-hover:border-gray-200 group-hover:shadow-xl rounded-lg bg-white transition-all duration-300">
          
          {/* Image Section */}
          <div 
            className="relative aspect-square overflow-hidden cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {/* Brand Logo Placeholder */}
            <div className="absolute top-2 left-2 z-10 w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity">
               <div className="bg-[#f0b129] text-[#00424b] font-black text-[10px] w-full h-full flex items-center justify-center rounded-sm">NEXO</div>
            </div>

            {/* Discount Badge */}
            {discount > 0 && (
              <span className="absolute top-2 right-2 bg-[#00a651] text-white text-[11px] font-bold px-2 py-0.5 rounded z-10">
                -{discount}%
              </span>
            )}

            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />

            {/* SKU Tag */}
            <div className="absolute bottom-2 right-2 text-[9px] font-bold text-gray-400 tracking-tighter uppercase">
              CODE:{product.id.split('-')[1]?.toUpperCase() || 'C002B'}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="mt-4 text-center px-1 pb-2">
            <h3 
              className="text-sm font-medium text-gray-800 line-clamp-1 mb-1 cursor-pointer hover:text-[#00424b]"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {product.name}
            </h3>

            <div className="flex items-center justify-center gap-2">
              <span className="text-[#00424b] font-black text-sm">Tk {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-xs font-medium">Tk {product.originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* Hover Reveal Content */}
          <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
            <div className="pt-2 pb-2 space-y-3">
              {/* Size Selection Bubbles */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {product.variations.slice(0, 5).map(v => (
                  <div key={v} className="w-8 h-7 flex items-center justify-center border border-gray-200 rounded text-[10px] font-medium text-gray-500 hover:border-[#00424b] transition-colors cursor-pointer">
                    {v}
                  </div>
                ))}
              </div>

              {/* Color Dots */}
              <div className="flex justify-center gap-2">
                {mockColors.map((color, i) => (
                  <div 
                    key={i} 
                    className="w-3 h-3 rounded-full border border-gray-100 shadow-sm cursor-pointer hover:scale-110 transition-transform" 
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Order Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                className="w-full mt-2 border border-gray-200 text-gray-800 py-2.5 text-[11px] font-bold rounded uppercase tracking-wider hover:bg-[#00424b] hover:text-white hover:border-[#00424b] transition-all"
              >
                ORDER NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      <QuickOrderModal 
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(id) => navigate(`/thank-you/${id}`)}
      />
    </>
  );
};

export default ProductCard;
