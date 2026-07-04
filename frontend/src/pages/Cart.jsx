import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShoppingBag, Lock, ArrowRight, CheckCircle, X } from 'lucide-react';
const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
const CheckoutModal = ({ subtotal, onConfirm, onClose, loading }) => {
  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'Cash on Delivery',
  });
  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.postalCode.trim()) e.postalCode = 'PIN code is required';
    if (!/^\d{6}$/.test(form.postalCode.trim())) e.postalCode = 'Enter a valid 6-digit PIN';
    return e;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onConfirm(form);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Complete Your Order</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-summary">
            <span>Order Total</span>
            <span className="modal-total">{formatINR(subtotal)}</span>
          </div>
          <h4 style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Shipping Details
          </h4>
          <div className="form-group">
            <label>Full Address</label>
            <input
              type="text"
              className={`form-control ${errors.address ? 'input-error' : ''}`}
              placeholder="House/Flat No., Street, Area"
              value={form.address}
              onChange={(e) => { setForm({ ...form, address: e.target.value }); setErrors({ ...errors, address: '' }); }}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                className={`form-control ${errors.city ? 'input-error' : ''}`}
                placeholder="e.g. Mumbai"
                value={form.city}
                onChange={(e) => { setForm({ ...form, city: e.target.value }); setErrors({ ...errors, city: '' }); }}
              />
              {errors.city && <span className="field-error">{errors.city}</span>}
            </div>
            <div className="form-group">
              <label>PIN Code</label>
              <input
                type="text"
                className={`form-control ${errors.postalCode ? 'input-error' : ''}`}
                placeholder="6-digit PIN"
                maxLength={6}
                value={form.postalCode}
                onChange={(e) => { setForm({ ...form, postalCode: e.target.value }); setErrors({ ...errors, postalCode: '' }); }}
              />
              {errors.postalCode && <span className="field-error">{errors.postalCode}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select
              className="form-control"
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            >
              <option>Cash on Delivery</option>
              <option>UPI</option>
              <option>Net Banking</option>
              <option>Credit / Debit Card</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn"
            style={{ width: '100%', padding: '14px', marginTop: '8px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : <><CheckCircle size={18} /> Place Order</>}
          </button>
        </form>
      </div>
    </div>
  );
};
const OrderSuccess = ({ orderId }) => {
  const navigate = useNavigate();
  return (
    <div className="order-success">
      <CheckCircle size={56} style={{ color: 'var(--success-color)', marginBottom: '16px' }} />
      <h2 style={{ marginBottom: '8px' }}>Order Placed! 🎉</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '6px' }}>Thank you for shopping with CHRONOS.</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '28px' }}>
        Order ID: <span style={{ fontFamily: 'monospace', color: 'var(--primary-color)' }}>#{orderId?.substring(0, 12).toUpperCase()}</span>
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn" onClick={() => navigate('/dashboard')}>View My Orders</button>
        <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
};
const Cart = () => {
  const { cartItems, removeFromCart, addToCart, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const handleCheckout = () => {
    if (!user) { navigate('/login'); return; }
    setShowModal(true);
  };
  const handlePlaceOrder = async (shippingForm) => {
    setPlacing(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        shippingAddress: {
          address: shippingForm.address,
          city: shippingForm.city,
          postalCode: shippingForm.postalCode,
          country: shippingForm.country,
        },
        paymentMethod: shippingForm.paymentMethod,
        totalPrice: subtotal,
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const data = await res.json();
        clearCart();
        setShowModal(false);
        setPlacedOrderId(data._id);
      } else {
        const err = await res.json();
        alert(`Failed to place order: ${err.message}`);
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setPlacing(false);
    }
  };
  if (placedOrderId) return <OrderSuccess orderId={placedOrderId} />;
  if (cartItems.length === 0) {
    return (
      <div className="empty-state" style={{ marginTop: '60px' }}>
        <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
        <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Your cart is empty</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Add some watches to get started
        </p>
        <Link to="/shop" className="btn">Browse Collection</Link>
      </div>
    );
  }
  return (
    <>
      {showModal && (
        <CheckoutModal
          subtotal={subtotal}
          onConfirm={handlePlaceOrder}
          onClose={() => setShowModal(false)}
          loading={placing}
        />
      )}
      <div style={{ padding: '40px 0' }}>
        <h2 style={{ marginBottom: '4px' }}>Shopping Cart</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
        {!user && (
          <div className="auth-banner" style={{ marginBottom: '24px' }}>
            <Lock size={16} />
            <span>
              You are browsing as a guest.{' '}
              <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Login</Link>{' '}
              to complete your purchase.
            </span>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '30px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item">
                <Link to={`/product/${item.product}`}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                </Link>
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item.product}`} style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {item.name}
                  </Link>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '3px' }}>
                    {formatINR(item.price)} each
                  </div>
                </div>
                <select
                  value={item.quantity}
                  onChange={(e) => addToCart({ _id: item.product, images: [item.image], ...item }, Number(e.target.value))}
                  className="qty-select"
                >
                  {[...Array(10).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
                <div style={{ fontWeight: 700, color: 'var(--primary-color)', minWidth: '100px', textAlign: 'right' }}>
                  {formatINR(item.price * item.quantity)}
                </div>
                <button onClick={() => removeFromCart(item.product)} className="cart-remove-btn" title="Remove">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="order-summary-box">
            <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>
            <div className="summary-row">
              <span>Items ({totalItems})</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: 'var(--success-color)' }}>FREE</span>
            </div>
            <hr style={{ borderColor: 'var(--border-color)', margin: '14px 0' }} />
            <div className="summary-row" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary-color)' }}>{formatINR(subtotal)}</span>
            </div>
            <button
              className="btn"
              style={{ width: '100%', marginTop: '20px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem' }}
              onClick={handleCheckout}
            >
              {user ? <><ArrowRight size={18} /> Proceed to Checkout</> : <><Lock size={18} /> Login to Checkout</>}
            </button>
            <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '14px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cart;