
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DB } from '../store';
import { CartItem, Product } from '../types';

const Header: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCart = () => {
      setCartItems(DB.getCart());
    };
    updateCart();
    window.addEventListener('cart-updated', updateCart);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('cart-updated', updateCart);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (search.trim().length > 1) {
      const allProducts = DB.getProducts();
      const filtered = allProducts.filter(p => 
        p.isVisible && (
          p.name.toLowerCase().includes(search.toLowerCase()) || 
          p.category.toLowerCase().includes(search.toLowerCase())
        )
      ).slice(0, 6);
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setShowResults(false);
    }
  };

  const handleResultClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearch('');
    setShowResults(false);
  };

  const categories = [
    { name: 'Loafers', slug: 'Loafer' },
    { name: 'Boots', slug: 'Boot' },
    { name: 'Casuals', slug: 'Casual' },
    { name: 'Formal', slug: 'Formal' },
    { name: 'Sandal', slug: 'Sandal' },
  ];

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#00424b] text-white shadow-lg">
        <div className="bg-[#f0b129] text-[#00424b] text-[10px] md:text-xs py-1 text-center font-bold tracking-wider uppercase">
          Order with confidence - Easy exchange, No worries
        </div>
        
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                 <div className="w-8 h-8 md:w-10 md:h-10 bg-[#f0b129] rounded flex items-center justify-center text-[#00424b] font-black text-xl md:text-2xl">
                  LS
                 </div>
                 <span className="text-xl md:text-2xl font-bold tracking-tight hidden sm:inline">LeatherShop</span>
              </Link>
            </div>

            <div className="flex-1 max-w-xl hidden md:block relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search premium footwear..." 
                  className="w-full bg-white text-gray-900 rounded-full py-2 px-4 focus:outline-none pr-10 border-2 border-transparent focus:border-[#f0b129] transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => search.length > 1 && setShowResults(true)}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00424b]">
                  <i className="fas fa-search"></i>
                </button>
              </form>

              {/* Live Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                  <div className="p-2">
                    {searchResults.length > 0 ? (
                      <>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">Quick Results</p>
                        {searchResults.map(product => (
                          <div 
                            key={product.id} 
                            onClick={() => handleResultClick(product.id)}
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group"
                          >
                            <img src={product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg border bg-gray-50" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-[#00424b] truncate group-hover:text-[#f0b129] transition-colors">{product.name}</h4>
                              <p className="text-xs text-gray-400 font-bold uppercase">{product.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-[#00424b]">৳ {product.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={handleSearchSubmit}
                          className="w-full mt-2 py-3 text-center text-xs font-black text-[#00424b] uppercase tracking-widest bg-gray-50 hover:bg-gray-100 transition-colors border-t border-gray-100"
                        >
                          View all results for "{search}"
                        </button>
                      </>
                    ) : (
                      <div className="p-6 text-center">
                        <i className="fas fa-search-minus text-2xl text-gray-200 mb-2"></i>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No products found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <Link to="/track" className="flex flex-col items-center hover:text-[#f0b129] transition-colors group">
                <i className="fas fa-truck text-lg group-hover:translate-x-1 transition-transform"></i>
                <span className="text-[10px] mt-1 hidden sm:block">Track</span>
              </Link>
              <Link to="/admin" className="flex flex-col items-center hover:text-[#f0b129] transition-colors">
                <i className="fas fa-user-shield text-lg"></i>
                <span className="text-[10px] mt-1 hidden sm:block">Admin</span>
              </Link>
              <div 
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer group flex flex-col items-center hover:text-[#f0b129] transition-colors"
              >
                 <i className="fas fa-shopping-cart text-lg"></i>
                 <span className="text-[10px] mt-1 hidden sm:block">Cart</span>
                 {cartCount > 0 && (
                   <span className="absolute -top-2 -right-2 bg-[#f0b129] text-[#00424b] rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold animate-in zoom-in">
                     {cartCount}
                   </span>
                 )}
              </div>
            </div>
          </div>

          <div className="mt-3 md:hidden relative">
             <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full bg-white text-gray-900 rounded-full py-2 px-4 focus:outline-none pr-10 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <i className="fas fa-search"></i>
                </button>
             </form>
          </div>
        </div>

        <nav className="bg-[#00383f] border-t border-[#ffffff1a] hidden lg:block overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="container mx-auto px-4">
            <ul className="flex justify-center space-x-8 py-2 text-xs font-semibold uppercase tracking-widest">
              <li className="hover:text-[#f0b129] transition-colors">
                <Link to="/">Home</Link>
              </li>
              <li className="hover:text-[#f0b129] transition-colors">
                <Link to="/shop">Shop All</Link>
              </li>
              {categories.map(cat => (
                <li key={cat.slug} className="hover:text-[#f0b129] transition-colors">
                  <Link to={`/shop?q=${encodeURIComponent(cat.slug)}`}>{cat.name}</Link>
                </li>
              ))}
              <li className="text-[#f0b129] hover:text-white transition-colors">
                <Link to="/shop?q=Sale">Flash Sale</Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Cart Drawer */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isCartOpen ? 'bg-black/60 opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b flex justify-between items-center bg-[#00424b] text-white">
              <h2 className="text-xl font-black uppercase tracking-widest">Your Shopping Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-white hover:text-[#f0b129]">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                  <i className="fas fa-shopping-basket text-5xl"></i>
                  <p className="font-bold uppercase text-sm tracking-widest">Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-[#00424b] font-black underline uppercase text-xs"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-xl bg-gray-50 group hover:border-[#00424b] transition-colors">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-white border" />
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-black text-[#00424b] line-clamp-1">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-[#f0b129]/20 text-[#00424b] px-2 py-0.5 rounded uppercase">{item.variation}</span>
                        <span className="text-sm font-bold text-[#00424b]">৳ {item.price}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border rounded-lg bg-white h-7 overflow-hidden">
                          <button 
                            onClick={() => DB.updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2 hover:bg-gray-100 transition-colors"
                          >
                            <i className="fas fa-minus text-[8px] text-gray-500"></i>
                          </button>
                          <span className="px-3 text-xs font-bold text-[#00424b]">{item.quantity}</span>
                          <button 
                            onClick={() => DB.updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2 hover:bg-gray-100 transition-colors"
                          >
                            <i className="fas fa-plus text-[8px] text-gray-500"></i>
                          </button>
                        </div>
                        <button 
                          onClick={() => DB.removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t bg-gray-50 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>৳ {cartTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase italic text-right">Shipping calculated at checkout</p>
                </div>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-4 bg-[#00424b] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#002d33] transition-all shadow-xl"
                >
                  Checkout - ৳ {cartTotal.toLocaleString()}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
