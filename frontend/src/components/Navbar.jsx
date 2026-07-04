import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { ShoppingCart, Heart, User, LogOut, Watch, ChevronDown, SlidersHorizontal } from 'lucide-react';
const PRICE_RANGES = [
  { label: 'Under ₹5,000',          value: '0-5000'         },
  { label: '₹5,000 – ₹25,000',      value: '5000-25000'     },
  { label: '₹25,000 – ₹1,00,000',   value: '25000-100000'   },
  { label: '₹1,00,000 – ₹5,00,000', value: '100000-500000'  },
  { label: 'Above ₹5,00,000',       value: '500000-99999999'},
];
const MultiFilterDropdown = ({ activeBrand, activePrice, onBrandChange, onPriceChange, brands }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div className="nav-filter-wrap" ref={ref} style={{ position: 'relative' }}>
      <button
        className="nav-icon-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          color: (activeBrand || activePrice || isOpen) ? 'var(--primary-color)' : 'var(--text-muted)',
          background: (activeBrand || activePrice || isOpen) ? 'rgba(212,175,55,0.07)' : 'transparent',
          fontWeight: (activeBrand || activePrice || isOpen) ? '600' : '500',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <SlidersHorizontal size={20} />
        <span style={{ fontSize: '0.85rem' }}>Filter</span>
      </button>
      {isOpen && (
        <div className="nav-filter-dropdown" style={{ 
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '12px',
          background: 'var(--card-bg)',
          boxShadow: 'var(--shadow-hover)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          zIndex: 1000,
          width: '240px', 
          padding: '18px' 
        }}>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Brand</div>
            <select 
              value={activeBrand} 
              onChange={(e) => onBrandChange(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
            >
              <option value="">All Brands</option>
              {brands && brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Price</div>
            <select 
              value={activePrice} 
              onChange={(e) => onPriceChange(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
            >
              <option value="">All Prices</option>
              {PRICE_RANGES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products')
        ]);
        const [catData, prodData] = await Promise.all([catRes.json(), prodRes.json()]);
        if (prodData && prodData.length > 0) {
          const uniqueBrands = [...new Set(prodData.map(p => p.brand))].filter(Boolean).sort();
          setBrands(uniqueBrands);
        }
        const sortOrder = ['Mechanical', 'Luxury', 'Smart', 'For Him', 'For Her', 'For Kids'];
        const sortCats = (cats) => {
          return cats.sort((a, b) => {
            let ia = sortOrder.indexOf(a.name);
            let ib = sortOrder.indexOf(b.name);
            if(ia === -1) ia = 999;
            if(ib === -1) ib = 999;
            return ia - ib;
          });
        };
        if (catData.length === 0) {
          const defaults = ['Mechanical', 'Smart', 'For Him', 'For Her', 'Luxury'];
          setCategories(sortCats(defaults.map(n => ({ name: n }))));
          if (user?.role === 'admin') {
            for (let d of defaults) {
               await fetch('/api/categories', { method: 'POST', headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: d }) });
            }
          }
        } else {
          setCategories(sortCats(catData));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadFilters();
  }, [user]);
  const isShopPage = location.pathname === '/shop';
  const activeCategory = isShopPage ? (searchParams.get('category') || '') : '';
  const activeBrand    = isShopPage ? (searchParams.get('brand') || '')    : '';
  const activePrice    = isShopPage ? (searchParams.get('price') || '')    : '';
  const handleLogout = () => { logout(); navigate('/login'); };
  const goToShopWith = (key, value) => {
    const params = {};
    if (searchParams.get('category')) params.category = searchParams.get('category');
    if (searchParams.get('brand'))    params.brand    = searchParams.get('brand');
    if (searchParams.get('price'))    params.price    = searchParams.get('price');
    if (value) params[key] = value;
    else delete params[key];
    navigate(`/shop?${new URLSearchParams(params).toString()}`);
  };
  return (
    <nav className="navbar">
      <div className="nav-inner container">
        <Link to="/" className="navbar-brand">
          <Watch size={20} />
          CHRONOS
        </Link>
        <div className="nav-categories">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`nav-cat-btn ${activeCategory === cat.name ? 'nav-cat-btn--active' : ''}`}
              onClick={() => goToShopWith('category', cat.name === activeCategory ? '' : cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="nav-actions">
          <MultiFilterDropdown 
            activeBrand={activeBrand}
            activePrice={activePrice}
            onBrandChange={(val) => goToShopWith('brand', val)}
            onPriceChange={(val) => goToShopWith('price', val)}
            brands={brands}
          />
          <Link to="/contact" className="nav-icon-btn" title="Contact Us" style={{ fontSize: '0.82rem', fontWeight: 500, padding: '8px 10px' }}>
            Contact
          </Link>
          <div className="nav-divider" />
          <Link to="/about" className="nav-icon-btn" title="About Us" style={{ fontSize: '0.82rem', fontWeight: 500, padding: '8px 10px' }}>
            About
          </Link>
          <Link to="/wishlist" className="nav-icon-btn nav-cart" title="Wishlist">
            <Heart size={20} />
            {wishlistItems.length > 0 && <span className="nav-badge">{wishlistItems.length}</span>}
          </Link>
          <Link to="/cart" className="nav-icon-btn nav-cart" title="Cart">
            <ShoppingCart size={20} />
            {cartItems.length > 0 && <span className="nav-badge">{cartItems.length}</span>}
          </Link>
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="nav-icon-btn nav-profile" title={user.name}>
                <User size={20} />
                <span className="nav-username">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="nav-icon-btn nav-logout" title="Logout">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-signin-btn">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;