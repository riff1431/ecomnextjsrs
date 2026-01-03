
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DB } from '../store';
import { Product, CartItem } from '../types';
import QuickOrderModal from '../components/QuickOrderModal';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when product changes
    const allProducts = DB.getProducts();
    const p = allProducts.find(item => item.id === id);
    if (p) {
      setProduct(p);
      if (p.variations.length > 0) setSelectedVariation(p.variations[0]);
      
      // Find related products in the same category
      const related = allProducts.filter(item => 
        item.category === p.category && 
        item.id !== p.id && 
        item.isVisible
      ).slice(0, 5);
      setRelatedProducts(related);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    setAddingToCart(true);
    
    const cartItem: CartItem = {
      id: `${product.id}-${selectedVariation}`,
      productId: product.id,
      name: product.name,
      variation: selectedVariation,
      quantity: quantity,
      price: product.price,
      image: product.images[0]
    };

    DB.addToCart(cartItem);
    
    setTimeout(() => {
      setAddingToCart(false);
    }, 500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (!product) return <div className="p-20 text-center font-black uppercase tracking-widest text-[#00424b]">Loading Product Details...</div>;

  const totalPrice = product.price * quantity;
  const remainingStock = Math.max(0, product.stock - quantity);

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 border rounded-2xl overflow-hidden relative group">
               <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all"></div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${selectedImage === idx ? 'border-[#f0b129]' : 'border-gray-200 opacity-60'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4 font-bold uppercase tracking-wider">
                <span className="hover:text-[#00424b] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <i className="fas fa-chevron-right text-[8px]"></i>
                <span className="hover:text-[#00424b] cursor-pointer" onClick={() => navigate(`/?search=${encodeURIComponent(product.category)}`)}>{product.category}</span>
              </nav>
              <h1 className="text-2xl md:text-3xl font-black text-[#00424b] leading-tight mb-2 uppercase tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#00424b]">Tk {product.price.toLocaleString()}</span>
                  {quantity > 1 && (
                    <span className="text-xs font-bold text-[#00a651] uppercase tracking-widest animate-in fade-in duration-300">
                      Total: Tk {totalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                   <div className="flex items-center gap-2">
                     <span className="text-gray-400 line-through">Tk {product.originalPrice.toLocaleString()}</span>
                     <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">20% OFF</span>
                   </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
               <div>
                 <div className="flex justify-between items-center mb-2">
                   <label className="text-xs font-black text-[#00424b] uppercase tracking-widest">Select Size</label>
                   <button className="text-[10px] text-[#00424b] underline font-bold uppercase">Size Chart</button>
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {product.variations.map(v => (
                     <button 
                       key={v}
                       onClick={() => setSelectedVariation(v)}
                       className={`w-12 h-10 border rounded flex items-center justify-center font-bold text-sm transition-all ${selectedVariation === v ? 'bg-[#00424b] text-white border-[#00424b]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-[#00424b]'}`}
                     >
                       {v}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden h-12">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="px-4 h-full hover:bg-gray-100 transition-colors"
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="px-6 font-bold text-lg w-16 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))} 
                        className={`px-4 h-full transition-colors ${quantity >= product.stock ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        disabled={quantity >= product.stock}
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        Total Inventory: {product.stock}
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${remainingStock < 5 ? 'text-red-500 animate-pulse' : 'text-[#00a651]'}`}>
                        Remaining After Order: {remainingStock}
                      </div>
                    </div>
                  </div>
                  {quantity >= product.stock && (
                    <p className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">* Maximum available stock reached</p>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4">
               <button 
                 onClick={() => setIsModalOpen(true)}
                 disabled={product.stock === 0}
                 className={`w-full text-white py-5 rounded-lg font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl transform active:scale-[0.98] ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00a651] hover:bg-[#008c44]'}`}
               >
                 <i className="fas fa-shopping-cart"></i>
                 {product.stock === 0 ? 'Out of Stock' : 'অর্ডার করতে ক্লিক করুন'}
               </button>
               <div className="flex gap-4">
                 <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0}
                  className={`flex-1 border-2 border-[#00424b] text-[#00424b] py-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${addingToCart || product.stock === 0 ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'hover:bg-[#00424b] hover:text-white active:scale-95'}`}
                 >
                   {addingToCart ? 'Adding...' : 'Add to Cart'}
                 </button>
                 <button 
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className={`flex-1 text-white py-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#002d33] hover:bg-[#00424b]'}`}
                 >
                   Buy Now
                 </button>
               </div>
            </div>

            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-gray-100">
               <div className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-[#00424b]"><i className="fas fa-shipping-fast"></i></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#00424b]">Fast Delivery</p>
               </div>
               <div className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-[#00424b]"><i className="fas fa-shield-alt"></i></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#00424b]">100% Genuine</p>
               </div>
               <div className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-[#00424b]"><i className="fas fa-undo"></i></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#00424b]">Easy Returns</p>
               </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
               <h3 className="text-[#00424b] font-black uppercase mb-4 tracking-widest text-sm">Product Description</h3>
               <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
               <ul className="mt-6 space-y-3">
                 <li className="flex items-center text-xs font-bold text-gray-600 uppercase tracking-wide">
                   <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0"><i className="fas fa-check text-[10px]"></i></div>
                   Premium high-quality genuine leather
                 </li>
                 <li className="flex items-center text-xs font-bold text-gray-600 uppercase tracking-wide">
                   <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0"><i className="fas fa-check text-[10px]"></i></div>
                   Durable anti-skid rubber sole
                 </li>
                 <li className="flex items-center text-xs font-bold text-gray-600 uppercase tracking-wide">
                   <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0"><i className="fas fa-check text-[10px]"></i></div>
                   Lightweight and flexible construction
                 </li>
               </ul>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100">
              <div className="relative">
                <h2 className="text-xl font-black text-[#00424b] uppercase tracking-tighter pb-3">
                  Related Products
                </h2>
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00424b]"></div>
              </div>
              <button 
                onClick={() => navigate(`/?search=${encodeURIComponent(product.category)}`)}
                className="text-xs font-bold text-[#00424b] uppercase tracking-widest hover:underline"
              >
                View Category <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>

      <QuickOrderModal 
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(id) => navigate(`/thank-you/${id}`)}
      />
    </div>
  );
};

export default ProductDetail;
