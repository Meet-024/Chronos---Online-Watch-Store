import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import { Heart, ShoppingCart, ArrowLeft, Star, Package, Tag, Lock } from 'lucide-react';
const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthMsg, setShowAuthMsg] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const requireAuth = () => {
    if (!user) {
      setShowAuthMsg(true);
      setTimeout(() => {
        setShowAuthMsg(false);
        navigate('/login');
      }, 1800);
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
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };
  if (loading) return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
      Loading details...
    </div>
  );
  if (!product) return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
      Product not found. <Link to="/shop" style={{ color: 'var(--primary-color)' }}>Back to Shop</Link>
    </div>
  );
  const wishlisted = isInWishlist(product._id);
  return (
    <div style={{ padding: '40px 0' }}>
      {showAuthMsg && (
        <div className="auth-banner">
          <Lock size={16} />
          <span>You need to <strong>login</strong> to do that. Redirecting to login...</span>
        </div>
      )}
      <Link to="/shop" className="btn btn-outline" style={{ marginBottom: '28px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={16} /> Back to Shop
      </Link>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'start' }}>
        <div className="product-detail-img-box">
          <img
            src={product.images?.[0] || product.image || 'https://placehold.co/500x500?text=Watch'}
            alt={product.name}
            className="product-detail-img"
          />
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--primary-color)' }}>
            {product.brand}
          </span>
          <h1 style={{ fontSize: '1.8rem', margin: '8px 0 6px' }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={16} fill={s <= Math.round(product.rating) ? 'var(--primary-color)' : 'none'} stroke="var(--primary-color)" />
            ))}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({product.numReviews} reviews)</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '20px' }}>
            {formatINR(product.price)}
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '24px' }}>{product.description}</p>
          <hr style={{ borderColor: 'var(--border-color)', margin: '20px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Tag size={15} style={{ color: 'var(--text-muted)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Category:</span>
              <span style={{ fontWeight: 600 }}>{product.category}</span>
            </div>
          </div>
          {!user && (
            <div className="auth-note">
              <Lock size={14} />
              <span>Please <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>login</Link> to add to cart or wishlist.</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              className="btn"
              style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
              {user ? 'Add to Cart' : 'Login to Buy'}
            </button>
            <button
              className={`btn btn-outline ${wishlisted && user ? 'wishlisted-btn' : ''}`}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}
              onClick={handleWishlist}
            >
              <Heart size={18} fill={wishlisted && user ? 'currentColor' : 'none'} />
              {wishlisted && user ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;