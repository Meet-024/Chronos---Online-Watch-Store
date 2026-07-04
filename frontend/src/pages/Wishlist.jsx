import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  if (wishlistItems.length === 0) {
    return (
      <div className="empty-state" style={{ marginTop: '80px' }}>
        <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
        <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Your wishlist is empty</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Browse our collection and save watches you love
        </p>
        <Link to="/shop" className="btn">Browse Collection</Link>
      </div>
    );
  }
  return (
    <div style={{ padding: '40px 0' }}>
      <h2 style={{ marginBottom: '8px' }}>My Wishlist</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
      </p>
      <div className="product-grid">
        {wishlistItems.map((product) => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`}>
              <div className="product-img-wrapper">
                <img src={product.images?.[0] || product.image || 'https://placehold.co/400x300?text=Watch'} alt={product.name} className="product-img" />
              </div>
            </Link>
            <div className="product-info">
              <Link to={`/product/${product._id}`}>
                <h3 className="product-title">{product.name}</h3>
              </Link>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span className="product-price">{formatINR(product.price)}</span>
                <span style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>⭐ {product.rating}</span>
              </div>
              <div className="product-actions">
                <button
                  className="btn"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => addToCart(product, 1)}
                >
                  <ShoppingCart size={15} /> Add to Cart
                </button>
                <button
                  className="btn btn-outline"
                  style={{ padding: '8px 12px', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                  onClick={() => removeFromWishlist(product._id)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Wishlist;