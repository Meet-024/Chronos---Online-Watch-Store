import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { X } from 'lucide-react';
const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
const PRICE_RANGES = [
  { label: 'Under ₹5,000',          value: '0-5000'         },
  { label: '₹5,000 – ₹25,000',      value: '5000-25000'     },
  { label: '₹25,000 – ₹1,00,000',   value: '25000-100000'   },
  { label: '₹1,00,000 – ₹5,00,000', value: '100000-500000'  },
  { label: 'Above ₹5,00,000',       value: '500000-99999999'},
];
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const activeBrand    = searchParams.get('brand') || '';
  const activePrice    = searchParams.get('price') || '';
  const activeSearch   = searchParams.get('search') || '';
  const priceLabel = PRICE_RANGES.find(p => p.value === activePrice)?.label || '';
  const activeFilters = [
    activeCategory && { key: 'category', label: activeCategory },
    activeBrand    && { key: 'brand',    label: activeBrand },
    activePrice    && { key: 'price',    label: priceLabel },
    activeSearch   && { key: 'search',   label: `Search: "${activeSearch}"` },
  ].filter(Boolean);
  const removeFilter = (key) => {
    const params = Object.fromEntries(searchParams.entries());
    delete params[key];
    setSearchParams(params);
  };
  const clearAll = () => setSearchParams({});
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        if (activeBrand)    params.set('brand', activeBrand);
        if (activePrice) {
          const [min, max] = activePrice.split('-');
          params.set('minPrice', min);
          params.set('maxPrice', max);
        }
        if (activeSearch) params.set('search', activeSearch);
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, activeBrand, activePrice, activeSearch]);
  const pageTitle = [
    activeCategory,
    activeBrand,
    activeSearch && `Search: "${activeSearch}"`
  ].filter(Boolean).join(' · ') || 'Our Collection';
  return (
    <div style={{ padding: '40px 0' }}>
      <div className="shop-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2>{pageTitle}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            {loading ? 'Loading...' : `${products.length} watches found`}
            {priceLabel && ` · ${priceLabel}`}
          </p>
        </div>
      </div>
      {activeFilters.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Filters:</span>
          {activeFilters.map(filter => (
            <div
              key={filter.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(184, 150, 12, 0.1)',
                border: '1px solid rgba(184, 150, 12, 0.25)',
                color: 'var(--text-main)',
                padding: '4px 10px',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}
            >
              <span>{filter.label}</span>
              <button
                onClick={() => removeFilter(filter.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                  transition: 'var(--transition)'
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={clearAll}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--danger-color)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600',
              padding: '4px 8px'
            }}
          >
            Clear All
          </button>
        </div>
      )}
      {loading ? (
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p style={{ marginBottom: '16px' }}>No watches match your filters.</p>
          <button className="btn" onClick={clearAll}>Clear Filters</button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
export default Shop;