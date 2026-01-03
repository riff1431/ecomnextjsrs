
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DB } from '../store';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Select, Button } from '../components/ui-components';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [currentPrice, setCurrentPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  
  const offers = [
    { label: 'Best Price', id: 'best-price' },
    { label: 'Hot Deals', id: 'hot-deals' },
    { label: 'Hot Offers', id: 'hot-offers' },
    { label: 'New Arrival', id: 'new-arrival' },
    { label: 'Trending Products', id: 'trending' }
  ];

  useEffect(() => {
    const allProducts = DB.getProducts().filter(p => p.isVisible);
    setProducts(allProducts);
    
    // Find max price to set range slider
    if (allProducts.length > 0) {
      const max = Math.max(...allProducts.map(p => p.price));
      setPriceRange([0, max + 1000]);
      setCurrentPrice(max + 1000);
    }
  }, []);

  const handleOfferToggle = (id: string) => {
    setSelectedOffers(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Search Query (if any)
    const searchQuery = searchParams.get('q')?.toLowerCase();
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery) || 
        p.category.toLowerCase().includes(searchQuery)
      );
    }

    // Filter by Price
    result = result.filter(p => p.price <= currentPrice);

    // Filter by Offers (mock logic for demo)
    if (selectedOffers.length > 0) {
      if (selectedOffers.includes('hot-deals')) {
        result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
      }
      if (selectedOffers.includes('new-arrival')) {
        // Just mock some logic
        result = result.slice(0, Math.ceil(result.length / 2));
      }
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Assume ID or array order is newest
        break;
    }

    return result;
  }, [products, currentPrice, sortBy, selectedOffers, searchParams]);

  const clearAll = () => {
    setCurrentPrice(priceRange[1]);
    setSortBy('newest');
    setSelectedOffers([]);
  };

  return (
    <div className="bg-[#FDFDFD] min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filter */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="flex items-center gap-2 text-[#00424b] mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#f0b129]/10 flex items-center justify-center">
                <i className="fas fa-filter text-[#f0b129]"></i>
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest">Filters</h2>
            </div>

            {/* Sort By */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#00424b] uppercase tracking-[0.2em] block">Sort By</label>
              <Select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="font-bold text-xs uppercase h-11 border-gray-200"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Popularity</option>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#00424b] uppercase tracking-[0.2em] block">
                <i className="fas fa-lira-sign mr-1"></i> Price Range (৳)
              </label>
              <div className="relative pt-2">
                <input 
                  type="range" 
                  min={priceRange[0]} 
                  max={priceRange[1]} 
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f0b129]"
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded text-[10px] font-black text-[#00424b]">৳{priceRange[0]}</div>
                  <div className="bg-[#f0b129]/10 border border-[#f0b129]/20 px-3 py-1.5 rounded text-[10px] font-black text-[#f0b129]">৳{currentPrice}</div>
                </div>
              </div>
            </div>

            {/* Offers Checkboxes */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <label className="text-[10px] font-black text-[#00424b] uppercase tracking-[0.2em] block">
                <i className="fas fa-tags mr-1"></i> Offers
              </label>
              <div className="space-y-3">
                {offers.map(offer => (
                  <label key={offer.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer h-4 w-4 appearance-none rounded border-2 border-gray-200 checked:bg-[#f0b129] checked:border-[#f0b129] transition-all cursor-pointer"
                        checked={selectedOffers.includes(offer.id)}
                        onChange={() => handleOfferToggle(offer.id)}
                      />
                      <i className="fas fa-check absolute scale-0 peer-checked:scale-100 transition-transform left-0.5 text-[8px] text-[#00424b] font-black pointer-events-none"></i>
                    </div>
                    <span className="text-xs font-bold text-gray-500 group-hover:text-[#00424b] transition-colors uppercase tracking-tight">{offer.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Actions */}
            <div className="space-y-3 pt-6">
              <Button className="w-full h-11 bg-[#f0b129] text-[#00424b] hover:bg-[#d9a024] shadow-lg shadow-yellow-500/10">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearAll} className="w-full h-11 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500">
                Clear All
              </Button>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <div>
                <h1 className="text-2xl font-black text-[#00424b] uppercase tracking-tighter">Collections</h1>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Showing {filteredProducts.length} Results</p>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                  <i className="fas fa-search-minus text-3xl"></i>
                </div>
                <h3 className="text-xl font-black text-[#00424b] uppercase tracking-tight">No Items Found</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 max-w-xs">We couldn't find any products matching your current filters.</p>
                <button onClick={clearAll} className="mt-8 text-[#f0b129] font-black uppercase text-xs tracking-[0.2em] border-b-2 border-[#f0b129] pb-1 hover:text-[#00424b] hover:border-[#00424b] transition-all">Reset Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
