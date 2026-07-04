import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import { Heart, ShoppingCart, Lock } from 'lucide-react';
const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showAuthToast, setShowAuthToast] = useState(false);
  const wishlisted = isInWishlist(product._id);
  const requireAuth = (action) => {
    if (!user) {
      setShowAuthToast(true);
      setTimeout(() => {
        setShowAuthToast(false);
        navigate('/login');
      }, 1500);
      return false;
    }
    return true;
  };
  const handleAddToCart = () => {
    if (!requireAuth()) return;
    addToCart(product, 1);
    navigate('/cart');
  };
  const handleWishlist = () => {
    if (!requireAuth()) return;
    if (wishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };
  return (
    <div className="product-card">
      {showAuthToast && (
        <div className="auth-toast">
          <Lock size={14} /> Please login to continue
        </div>
      )}
      <button
        className={`card-wishlist-btn ${wishlisted ? 'card-wishlist-btn--active' : ''}`}
        onClick={handleWishlist}
        title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>
      <Link to={`/product/${product._id}`}>
        <div className="product-img-wrapper">
          <img
            src={product.images?.[0] || product.image || 'https://placehold.co/400x300?text=Watch'}
            alt={product.name}
            className="product-img"
          />
        </div>
      </Link>
      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span className="product-price">{formatINR(product.price)}</span>
          <span style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>⭐ {product.rating}</span>
        </div>
        <button
          className="btn"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
        >
          {product.countInStock > 0 ? (
            <><ShoppingCart size={15} /> {user ? 'Add to Cart' : 'Login to Buy'}</>
          ) : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};
export default ProductCard;