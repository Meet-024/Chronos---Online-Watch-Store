import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Package, MapPin, CreditCard, CheckCircle, Clock,
  Truck, XCircle, ArrowLeft, ShoppingBag
} from 'lucide-react';
const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
const formatDateTime = (dateStr) =>
  new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
const STATUS_CONFIG = {
  Processing: { color: '#f59e0b', bg: '#fef3c7', icon: Clock,        label: 'Processing'  },
  Shipped:    { color: '#3b82f6', bg: '#dbeafe', icon: Truck,         label: 'Shipped'     },
  Delivered:  { color: '#10b981', bg: '#d1fae5', icon: CheckCircle,   label: 'Delivered'   },
  Cancelled:  { color: '#ef4444', bg: '#fee2e2', icon: XCircle,       label: 'Cancelled'   },
};
const STEPS = ['Processing', 'Shipped', 'Delivered'];
const OrderDetail = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setOrder(await res.json());
        } else {
          const data = await res.json();
          setError(data.message || 'Order not found.');
        }
      } catch {
        setError('Failed to load order. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user, token, navigate]);
  if (!user) return null;
  if (loading) return (
    <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
      <Package size={40} style={{ marginBottom: '16px', opacity: 0.4 }} />
      <p>Loading order details...</p>
    </div>
  );
  if (error) return (
    <div className="order-detail-error">
      <XCircle size={48} style={{ color: 'var(--danger-color)', marginBottom: '16px' }} />
      <h3>{error}</h3>
      <Link to="/dashboard" className="btn btn-outline" style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
    </div>
  );
  const status = order.status || 'Processing';
  const cfg    = STATUS_CONFIG[status] || STATUS_CONFIG.Processing;
  const StatusIcon = cfg.icon;
  const stepIdx = STEPS.indexOf(status);
  return (
    <div style={{ padding: '40px 0', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <Link to="/dashboard" className="order-back-link">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Order Details</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Order <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{String(order.id || order._id || id).toUpperCase()}</span>
              &nbsp;·&nbsp; Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <span className="order-status-badge" style={{ background: cfg.bg, color: cfg.color }}>
            <StatusIcon size={15} />
            {cfg.label}
          </span>
        </div>
      </div>
      {status !== 'Cancelled' && (
        <div className="order-progress-card">
          <div className="order-progress-track">
            {STEPS.map((step, i) => {
              const done    = i <= stepIdx;
              const SCfg    = STATUS_CONFIG[step];
              const SIcon   = SCfg.icon;
              return (
                <React.Fragment key={step}>
                  <div className="order-progress-step">
                    <div className="order-progress-dot" style={{
                      background: done ? 'var(--primary-color)' : 'var(--border-color)',
                      color:      done ? '#000' : 'var(--text-muted)',
                      border:     done ? '2px solid var(--primary-color)' : '2px solid var(--border-color)',
                    }}>
                      <SIcon size={16} />
                    </div>
                    <span className="order-progress-label" style={{ color: done ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: done ? 600 : 400 }}>
                      {step}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="order-progress-line" style={{ background: i < stepIdx ? 'var(--primary-color)' : 'var(--border-color)' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
      <div className="order-detail-grid">
        <div>
          <div className="order-detail-card">
            <div className="order-detail-card-header">
              <ShoppingBag size={18} style={{ color: 'var(--primary-color)' }} />
              <h4>Items Ordered ({order.orderItems?.length || 0})</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-item-img"
                    onError={(e) => { e.target.src = 'https://placehold.co/70x70?text=Watch'; }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Qty: {item.quantity || item.qty}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-color)', whiteSpace: 'nowrap' }}>
                    {formatINR(item.price * (item.quantity || item.qty))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-detail-card" style={{ marginTop: '20px' }}>
            <div className="order-detail-card-header">
              <MapPin size={18} style={{ color: 'var(--primary-color)' }} />
              <h4>Shipping Address</h4>
            </div>
            {(order.shippingAddress || order.address) ? (
              <address style={{ fontStyle: 'normal', color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.92rem' }}>
                {order.address ? (
                  <>
                    {order.address}<br />
                    {order.city} – {order.postalCode}<br />
                    {order.country || 'India'}
                  </>
                ) : (
                  <>
                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      {order.shippingAddress.fullName || order.shippingAddress.name || '—'}
                    </strong>
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country || 'India'}
                  </>
                )}
              </address>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No shipping address on record.</p>
            )}
          </div>
        </div>
        <div>
          <div className="order-detail-card">
            <div className="order-detail-card-header">
              <CreditCard size={18} style={{ color: 'var(--primary-color)' }} />
              <h4>Order Summary</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="order-summary-line">
                <span>Subtotal</span>
                <span>{formatINR(order.itemsPrice || order.totalPrice)}</span>
              </div>
              <div className="order-summary-line">
                <span>Shipping</span>
                <span style={{ color: 'var(--success-color)' }}>
                  {(!order.shippingPrice || order.shippingPrice === 0) ? 'Free' : formatINR(order.shippingPrice)}
                </span>
              </div>
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />
              <div className="order-summary-line order-summary-total">
                <span>Total Paid</span>
                <span>{formatINR(order.totalPrice)}</span>
              </div>
            </div>
            <div style={{ marginTop: '20px', padding: '14px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div className="order-meta-row">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Payment Method</span>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{order.paymentMethod || 'COD'}</span>
              </div>
              <div className="order-meta-row" style={{ marginTop: '10px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Ordered On</span>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{formatDateTime(order.createdAt)}</span>
              </div>
              {order.isDelivered && order.deliveredAt && (
                <div className="order-meta-row" style={{ marginTop: '10px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Delivered On</span>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--success-color)' }}>
                    {formatDateTime(order.deliveredAt)}
                  </span>
                </div>
              )}
            </div>
            <Link to="/dashboard" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', width: '100%' }}>
              <ArrowLeft size={15} /> Back to Dashboard
            </Link>
          </div>
          <div className="order-detail-card" style={{ marginTop: '20px', background: 'rgba(184,150,12,0.05)', border: '1px solid rgba(184,150,12,0.2)' }}>
            <h4 style={{ marginBottom: '8px', fontSize: '0.95rem' }}>Need Help?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '14px' }}>
              For any issue with this order, feel free to reach out to our support team.
            </p>
            <Link to="/contact" className="btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;