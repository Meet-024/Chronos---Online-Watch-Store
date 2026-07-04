import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
const Home = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 4)); 
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <>
      <div style={{
        background: 'linear-gradient(to right, #000, #1a1d24)',
        padding: '100px 20px',
        textAlign: 'center',
        marginTop: '20px',
        borderRadius: '8px',
        border: '1px solid var(--primary-color)'
      }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>Timeless Elegance</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '20px auto 40px' }}>
          Discover our curated collection of premium mechanical and luxury watches. Masterpieces designed to elevate your style.
        </p>
        <Link to="/shop" className="btn" style={{ fontSize: '1.2rem', padding: '15px 40px' }}>Shop Now</Link>
      </div>
      <div style={{ marginTop: '60px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Featured Collection</h2>
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '45px' }}>
          <Link to="/shop" className="btn btn-outline" style={{ fontSize: '1.05rem', padding: '12px 35px' }}>
            View All Watches
          </Link>
        </div>
      </div>
    </>
  );
};
export default Home;