import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, Package, LogOut, ChevronRight, Eye } from 'lucide-react';
const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const statusColor = (status) => {
  const map = {
    Delivered: '#10b981',
    Shipped: '#3b82f6',
    Processing: '#f59e0b',
    Cancelled: '#ef4444',
  };
  return map[status] || '#9ca3af';
};
const UserDashboard = () => {
  const { user, token, logout, updateUser } = useContext(AuthContext);
  const { wishlistItems } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', oldPassword: '', password: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        const data = await res.json();
        updateUser(data);
        alert('Profile updated successfully!');
        setProfileForm({ ...profileForm, oldPassword: '', password: '' });
      } else {
        const err = await res.json();
        alert(`Update failed: ${err.message}`);
      }
    } catch (err) {
      alert('Network error during update.');
    } finally {
      setUpdatingProfile(false);
    }
  };
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, token, navigate]);
  if (!user) return null;
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div style={{ padding: '40px 0', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="dashboard-banner">
        <div className="dashboard-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h2 style={{ marginBottom: '4px' }}>Welcome back, {user.name ? user.name.split(' ')[0] : 'Customer'} 👋</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
      <div className="dashboard-stats">
        <div className="stat-card">
          <ShoppingBag size={28} style={{ color: 'var(--primary-color)' }} />
          <div>
            <div className="stat-num">{orders.length}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-card">
          <Heart size={28} style={{ color: '#e53e3e' }} />
          <div>
            <div className="stat-num">{wishlistItems.length}</div>
            <div className="stat-label">Wishlist Items</div>
          </div>
        </div>
        <div className="stat-card">
          <Package size={28} style={{ color: '#3b82f6' }} />
          <div>
            <div className="stat-num">
              {orders.filter((o) => o.status === 'Delivered').length}
            </div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>
      </div>
      <div className="dashboard-tabs">
        <button
          className={`dash-tab ${activeTab === 'orders' ? 'dash-tab--active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={16} /> My Orders
        </button>
        <button
          className={`dash-tab ${activeTab === 'wishlist' ? 'dash-tab--active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          <Heart size={16} /> Wishlist
        </button>
        <button
          className={`dash-tab ${activeTab === 'profile' ? 'dash-tab--active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} /> Profile
        </button>
      </div>
      {activeTab === 'orders' && (
        <div className="dashboard-section">
          {loading ? (
            <p style={{ color: 'var(--text-muted)', padding: '30px 0' }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="empty-state" style={{ padding: '50px 20px' }}>
              <ShoppingBag size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <p style={{ marginBottom: '16px' }}>You haven't placed any orders yet.</p>
              <Link to="/shop" className="btn">Browse Watches</Link>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const oId = order.id || order._id || '';
                  const oIdStr = String(oId);
                  return (
                    <tr key={oIdStr}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        #{oIdStr.length > 10 ? oIdStr.substring(0, 10).toUpperCase() : oIdStr.toUpperCase()}
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                        {formatINR(order.totalPrice)}
                      </td>
                      <td>
                        <span style={{
                          background: `${statusColor(order.status)}22`,
                          color: statusColor(order.status),
                          padding: '3px 10px',
                          borderRadius: '50px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}>
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/order/${oId}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.82rem' }}
                        >
                          <Eye size={14} /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
      {/* ── Wishlist Tab ── */}
      {activeTab === 'wishlist' && (
        <div className="dashboard-section">
          {wishlistItems.length === 0 ? (
            <div className="empty-state" style={{ padding: '50px 20px' }}>
              <Heart size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <p style={{ marginBottom: '16px' }}>No items in your wishlist.</p>
              <Link to="/shop" className="btn">Browse Watches</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {wishlistItems.map((item) => {
                const wId = item.id || item._id;
                return (
                  <div key={wId} className="wishlist-row">
                    <img src={item.images?.[0] || item.image || 'https://placehold.co/400x300?text=Watch'} alt={item.name} className="wishlist-row-img" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{item.brand}</div>
                      <div style={{ fontWeight: 600, marginTop: '2px' }}>{item.name}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-color)', whiteSpace: 'nowrap' }}>{formatINR(item.price)}</div>
                    <Link to={`/product/${wId}`} className="btn" style={{ padding: '7px 16px', fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      View <ChevronRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {/* ── Profile Tab ── */}
      {activeTab === 'profile' && (
        <div className="dashboard-section">
          <div className="profile-card">
            <div className="dashboard-avatar" style={{ width: '72px', height: '72px', fontSize: '2rem', marginBottom: '16px' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="profile-field">
              <label>Full Name</label>
              <input className="form-control" type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} required />
            </div>
            <div className="profile-field">
              <label>Email Address</label>
              <input className="form-control" type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} required />
            </div>
            <div className="profile-field">
              <label>Current Password</label>
              <input className="form-control" type="password" placeholder="Required if changing password" value={profileForm.oldPassword} onChange={(e) => setProfileForm({...profileForm, oldPassword: e.target.value})} />
            </div>
            <div className="profile-field">
              <label>New Password (Optional)</label>
              <input className="form-control" type="password" placeholder="Leave blank to keep current password" value={profileForm.password} onChange={(e) => setProfileForm({...profileForm, password: e.target.value})} />
            </div>
            <button className="btn" onClick={handleProfileUpdate} disabled={updatingProfile} style={{ width: '100%', marginTop: '10px' }}>
              {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserDashboard;