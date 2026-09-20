import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Edit2, Trash2, Plus, X, Mail, MailOpen } from 'lucide-react';

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
    <div style={{ background: 'var(--card-bg)', width: '500px', maxWidth: '90%', borderRadius: '8px', padding: '20px', position: 'relative' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}><X size={20} /></button>
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>{title}</h3>
      {children}
    </div>
  </div>
);

const UsersAdmin = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if(res.ok) setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => { fetchUsers(); }, []);
  const deleteUser = async (id) => {
    if(!window.confirm('Are you sure you want to delete this user?')) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if(res.ok) fetchUsers();
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const uId = editingUser.id || editingUser._id;
    const res = await fetch(`/api/users/${uId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: editingUser.name, email: editingUser.email, role: editingUser.role })
    });
    if(res.ok) {
      setEditingUser(null);
      fetchUsers();
    } else {
      const err = await res.json();
      alert(`Update failed: ${err.message}`);
    }
  };
  return (
    <div>
      <h2>Manage Users</h2>
      <table className="table" style={{ marginTop: '20px' }}>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u => {
            const uId = u.id || u._id || '';
            const uIdStr = String(uId);
            return (
              <tr key={uIdStr}>
                <td>{uIdStr.length > 8 ? uIdStr.substring(0,8) : uIdStr}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                <td style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setEditingUser(u)} className="btn btn-outline" style={{ padding: '5px' }} title="Edit"><Edit2 size={16} /></button>
                  <button onClick={() => deleteUser(uId)} className="btn btn-danger" style={{ padding: '5px' }} title="Delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {editingUser && (
        <Modal title="Edit User" onClose={() => setEditingUser(null)}>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input className="form-control" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} placeholder="Name" required />
            <input className="form-control" type="email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} placeholder="Email" required />
            <select className="form-control" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn btn-primary" type="submit">Save Changes</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const ProductsAdmin = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if(res.ok) setProducts(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); }
  };
  useEffect(() => { fetchProducts(); }, []);
  const deleteProduct = async (id) => {
    if(!window.confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if(res.ok) fetchProducts();
  };
  const openAddModal = () => {
    setEditingProduct({ name: '', price: '', category: '', brand: '', description: '', images: [] });
    setIsModalOpen(true);
  };
  const openEditModal = (p) => {
    setEditingProduct({ ...p });
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const pId = editingProduct.id || editingProduct._id;
    const url = pId ? `/api/products/${pId}` : '/api/products';
    const method = pId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(editingProduct)
    });
    if(res.ok) {
      setIsModalOpen(false);
      fetchProducts();
    }
  };
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if(res.ok) {
        const data = await res.json();
        setEditingProduct(prev => ({ ...prev, images: [data.image] }));
      } else {
        alert('Upload failed');
      }
    } catch(err) {
      console.error(err);
      alert('Upload failed');
    }
    setUploading(false);
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Manage Products</h2>
        <button onClick={openAddModal} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Plus size={16} /> Add Product</button>
      </div>
      <table className="table" style={{ marginTop: '20px' }}>
        <thead><tr><th>Name</th><th>Brand</th><th>Price</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map(p => {
            const pId = p.id || p._id;
            return (
              <tr key={pId}>
                <td>{p.name}</td><td>{p.brand}</td><td>₹{p.price}</td>
                <td style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => openEditModal(p)} className="btn btn-outline" style={{ padding: '5px' }}><Edit2 size={16} /></button>
                  <button onClick={() => deleteProduct(pId)} className="btn btn-danger" style={{ padding: '5px' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {isModalOpen && (
        <Modal title={(editingProduct.id || editingProduct._id) ? "Edit Product" : "Add Product"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input className="form-control" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="Name" required />
            <input className="form-control" value={editingProduct.brand} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} placeholder="Brand" required />
            <input className="form-control" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} placeholder="Category" required />
            <input className="form-control" type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} placeholder="Price" required />
            <textarea className="form-control" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} placeholder="Description" rows={3}></textarea>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input className="form-control" value={editingProduct.images?.join(', ')} onChange={e => setEditingProduct({...editingProduct, images: e.target.value.split(',').map(s=>s.trim())})} placeholder="Image URLs" style={{ flex: 1 }} />
              <input type="file" id="image-file" onChange={uploadFileHandler} disabled={uploading} style={{ padding: '8px' }} />
            </div>
            {uploading && <small style={{ color: 'var(--primary-color)' }}>Uploading image...</small>}
            <button className="btn btn-primary" type="submit">Save Product</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const OrdersAdmin = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if(res.ok) setOrders(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); }
  };
  useEffect(() => { fetchOrders(); }, []);
  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(status)
    });
    if(res.ok) fetchOrders();
  };
  const deleteOrder = async (id) => {
    if(!window.confirm('Delete this order permanently?')) return;
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if(res.ok) fetchOrders();
  };
  return (
    <div>
      <h2>Manage Orders</h2>
      <table className="table" style={{ marginTop: '20px' }}>
        <thead><tr><th>Order ID</th><th>User</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {orders.map(o => {
            const oId = o.id || o._id || '';
            const oIdStr = String(oId);
            return (
              <tr key={oIdStr}>
                <td>{oIdStr.length > 8 ? oIdStr.substring(0,8) : oIdStr}</td>
                <td>{o.user?.name || 'Unknown'}</td>
                <td>₹{o.totalPrice}</td>
                <td>
                  <select 
                    value={o.status} 
                    onChange={(e) => updateStatus(oId, e.target.value)}
                    style={{ padding: '4px', borderRadius: '4px' }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => deleteOrder(oId)} className="btn btn-danger" style={{ padding: '5px' }} title="Delete Order"><Trash2 size={16} /></button>
                </td>
              </tr>
            );
          })}
          {orders.length === 0 && <tr><td colSpan="5" style={{textAlign:'center'}}>No orders found</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

const CategoriesAdmin = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if(res.ok) setCategories(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); }
  };
  useEffect(() => { fetchCategories(); }, []);
  const deleteCategory = async (id) => {
    if(!window.confirm('Delete this category permanently?')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if(res.ok) fetchCategories();
  };
  const openAddModal = () => {
    setEditingCategory({ name: '' });
    setIsModalOpen(true);
  };
  const openEditModal = (c) => {
    setEditingCategory({ ...c });
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const cId = editingCategory.id || editingCategory._id;
    const url = cId ? `/api/categories/${cId}` : '/api/categories';
    const method = cId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: editingCategory.name })
    });
    if(res.ok) {
      setIsModalOpen(false);
      fetchCategories();
    }
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Manage Categories</h2>
        <button className="btn" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Plus size={16} /> Add Category
        </button>
      </div>
      <table className="table" style={{ marginTop: '20px' }}>
        <thead><tr><th>Category Name</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {categories.map((c) => {
            const cId = c.id || c._id;
            return (
              <tr key={cId || c.name}>
                <td>{c.name}</td>
                <td style={{ color: 'var(--primary-color)' }}>Active</td>
                <td style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => openEditModal(c)} className="btn btn-outline" style={{ padding: '5px' }}><Edit2 size={16} /></button>
                  <button onClick={() => deleteCategory(cId)} className="btn btn-danger" style={{ padding: '5px' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            );
          })}
          {categories.length === 0 && <tr><td colSpan="3" style={{textAlign:'center'}}>No categories found</td></tr>}
        </tbody>
      </table>
      {isModalOpen && (
        <Modal title={(editingCategory.id || editingCategory._id) ? "Edit Category" : "Add Category"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input className="form-control" value={editingCategory.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} placeholder="Category Name (e.g. Mechanical)" required />
            <button className="btn btn-primary" type="submit">Save Category</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const MessagesAdmin = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setMessages(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); }
  };
  useEffect(() => { fetchMessages(); }, []);
  const markRead = async (id) => {
    await fetch(`/api/messages/${id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    fetchMessages();
  };
  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    const mId = selected.id || selected._id;
    await fetch(`/api/messages/${mId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setSelected(null);
    fetchMessages();
  };
  const openMessage = (msg) => {
    setSelected(msg);
    const mId = msg.id || msg._id;
    if (!msg.isRead) markRead(mId);
  };
  const unreadCount = messages.filter(m => !m.isRead).length;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Messages {unreadCount > 0 && <span style={{ fontSize: '1rem', background: 'var(--primary-color)', color: '#000', borderRadius: '12px', padding: '2px 10px', marginLeft: '10px' }}>{unreadCount} new</span>}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
          {messages.length === 0 && (
            <p style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No messages yet.</p>
          )}
          {messages.map(msg => {
            const mId = msg.id || msg._id;
            const selId = selected ? (selected.id || selected._id) : null;
            return (
              <div
                key={mId}
                onClick={() => openMessage(msg)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  background: selId === mId ? 'rgba(212,175,55,0.08)' : msg.isRead ? 'transparent' : 'rgba(212,175,55,0.04)',
                  display: 'flex', gap: '12px', alignItems: 'center',
                }}
              >
                <div style={{ color: msg.isRead ? 'var(--text-muted)' : 'var(--primary-color)', flexShrink: 0 }}>
                  {msg.isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ fontWeight: msg.isRead ? '400' : '700', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.subject}</p>
                </div>
                <p style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                  {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            );
          })}
        </div>
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '28px', minHeight: '300px' }}>
          {selected ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ marginBottom: '6px' }}>{selected.subject}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    From: <strong>{selected.name}</strong> ({selected.email})
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(selected.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <button onClick={() => deleteMessage(selected.id || selected._id)} className="btn btn-danger" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
              <hr style={{ borderColor: 'var(--border-color)', marginBottom: '20px' }} />
              <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{selected.message}</p>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '12px', paddingTop: '60px' }}>
              <Mail size={48} style={{ opacity: 0.3 }} />
              <p>Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);
  if (!user || user.role !== 'admin') return null;
  return (
    <div style={{ padding: '30px 0' }}>
      <Routes>
        <Route path="/" element={<Navigate to="users" replace />} />
        <Route path="users" element={<UsersAdmin token={token} />} />
        <Route path="products" element={<ProductsAdmin token={token} />} />
        <Route path="orders" element={<OrdersAdmin token={token} />} />
        <Route path="categories" element={<CategoriesAdmin token={token} />} />
        <Route path="messages" element={<MessagesAdmin token={token} />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;