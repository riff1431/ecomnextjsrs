
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DB } from '../store';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    let allProducts = DB.getProducts().filter(p => p.isVisible);
    if (searchQuery) {
      allProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery) || 
        p.category.toLowerCase().includes(searchQuery)
      );
    }
    setProducts(allProducts);
    setCategories(DB.getCategories());
  }, [searchQuery]);

  const featured = products.filter(p => p.isFeatured);
  const displayedCategories = showAllCategories ? categories : categories.slice(0, 10);

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between mb-8 border-b border-gray-200">
      <div className="relative">
        <h2 className="text-sm md:text-lg font-black text-[#00424b] uppercase tracking-tighter pb-2">
          {title}
        </h2>
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00424b]"></div>
      </div>
      <button 
        onClick={() => navigate('/')}
        className="bg-[#002d33] text-white px-4 py-1.5 rounded text-[10px] md:text-xs font-bold uppercase flex items-center gap-2 hover:bg-[#00424b] transition-colors mb-2"
      >
        See More <i className="fas fa-chevron-right text-[8px]"></i>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Hero Section */}
      {!searchQuery && (
        <section className="relative h-[300px] md:h-[500px] bg-gradient-to-r from-[#00424b] to-[#005c68] overflow-hidden">
          <div className="absolute inset-0 bg-black/20 z-0"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-start relative z-10">
             <div className="max-w-xl">
               <span className="text-[#f0b129] font-bold text-sm md:text-lg mb-2 block uppercase tracking-widest animate-in slide-in-from-left duration-500">New Arrivals 2025</span>
               <h1 className="text-3xl md:text-6xl font-black text-white leading-tight mb-4 animate-in slide-in-from-left duration-700">
                PREMIUM GENUINE <br/> LEATHER SHOES
               </h1>
               <p className="text-gray-300 text-sm md:text-lg mb-8 animate-in slide-in-from-left duration-1000">
                 Experience unmatched comfort and timeless style with our hand-crafted collection. FLAT 20% OFF on all winter collections.
               </p>
               <button className="bg-[#f0b129] text-[#00424b] px-8 py-3 rounded-md font-bold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl animate-in fade-in duration-1000">
                 Shop Now
               </button>
             </div>
          </div>
          <img 
            src="https://picsum.photos/seed/hero/1200/800" 
            alt="Hero" 
            className="absolute top-0 right-0 h-full w-full md:w-1/2 object-cover opacity-30 md:opacity-100 z-[-1] md:z-0" 
          />
        </section>
      )}

      {/* Featured Categories Grid (Refined View) */}
      {!searchQuery && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
               <div className="relative">
                <h2 className="text-sm md:text-lg font-black text-[#00424b] uppercase tracking-tighter pb-2">
                  Featured Categories
                </h2>
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00424b]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayedCategories.map(cat => (
                <div 
                  key={cat.id} 
                  onClick={() => navigate(`/?search=${encodeURIComponent(cat.name)}`)}
                  className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col items-center group cursor-pointer hover:border-[#00424b] hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-full aspect-square bg-[#FEFAF3] rounded-lg p-4 mb-3 flex items-center justify-center relative overflow-hidden">
                    {/* Brand Mark Icon */}
                    <div className="absolute top-3 left-3 text-[#f0b129] opacity-80">
                      <i className="fas fa-registered text-xs font-black"></i>
                    </div>
                    
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <h3 className="text-xs md:text-sm font-black text-[#00424b] text-center uppercase tracking-tighter line-clamp-1 px-1">
                    {cat.name}
                  </h3>
                </div>
              ))}
            </div>

            {categories.length > 10 && (
              <div className="mt-10 text-center">
                <button 
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="inline-flex items-center gap-2 text-xs font-black text-[#00424b] uppercase tracking-widest hover:text-[#f0b129] transition-colors group"
                >
                  {showAllCategories ? 'Show Less' : 'Show More'}
                  <i className={`fas fa-chevron-down transition-transform duration-300 ${showAllCategories ? 'rotate-180' : ''}`}></i>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <SectionHeader title={searchQuery ? `Search: ${searchQuery}` : "Casual Shoes"} />
          
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {products.map(prod => <ProductCard key={prod.id} product={prod} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <i className="fas fa-search-minus text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 font-medium">No products found for this search.</p>
              <button 
                onClick={() => setProducts(DB.getProducts())} 
                className="mt-4 text-[#00424b] font-bold underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured / Best Seller Section */}
      {featured.length > 0 && !searchQuery && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
             <SectionHeader title="Best Sellers" />
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
               {featured.map(prod => <ProductCard key={prod.id} product={prod} />)}
             </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      {!searchQuery && (
        <section className="py-8 container mx-auto px-4">
          <div className="w-full rounded-xl overflow-hidden shadow-sm h-32 md:h-48 relative">
            <img src="https://picsum.photos/seed/promo/1200/300" alt="Promo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col text-white p-4">
               <h2 className="text-xl md:text-3xl font-black uppercase tracking-widest">Premium Quality, Unbeatable Price</h2>
               <p className="text-xs md:text-sm mt-2 opacity-80">Free shipping on orders above 5000 Tk</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
