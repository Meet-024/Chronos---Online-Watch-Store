import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Watch, Users, Package, ShoppingBag, LayoutGrid, MessageSquare } from 'lucide-react';
const AdminNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navLinks = [
    { name: 'Users', path: '/admin/users', icon: <Users size={16} /> },
    { name: 'Watches', path: '/admin/products', icon: <Package size={16} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={16} /> },
    { name: 'Category', path: '/admin/categories', icon: <LayoutGrid size={16} /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare size={16} /> },
  ];
  return (
    <nav className="navbar" style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
      <div className="nav-inner container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/admin" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Watch size={20} />
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>CHRONOS | ADMIN</span>
        </Link>
        <div style={{ display: 'flex', gap: '30px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: location.pathname.includes(link.path) ? 'var(--primary-color)' : 'var(--text-color)',
                fontWeight: location.pathname.includes(link.path) ? '600' : '400',
                textDecoration: 'none',
                opacity: location.pathname.includes(link.path) ? 1 : 0.8,
              }}
            >
              {link.icon} {link.name}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user?.name || 'Admin'}</div>
          <button onClick={handleLogout} className="nav-icon-btn nav-logout" title="Logout" style={{ color: 'var(--text-color)', background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default AdminNavbar;