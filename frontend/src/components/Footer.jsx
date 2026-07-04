import React from 'react';
import { Link } from 'react-router-dom';
import { Watch, MapPin, Phone, Mail } from 'lucide-react';
const Footer = () => {
  return (
    <footer style={{ marginTop: '60px', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', background: 'var(--card-bg)' }}>
      <div className="container" style={{ padding: '48px 20px 24px' }}>
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Watch size={20} style={{ color: 'var(--primary-color)' }} />
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-color)', letterSpacing: '3px' }}>CHRONOS</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.7', maxWidth: '240px', marginBottom: '16px' }}>
              Premium timepieces for the discerning collector. Authenticity guaranteed, elegance delivered.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={13} /> College Road, Nadiad, Gujarat 387001</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={13} /> +91 98765 43210</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={13} /> support@chronoswatches.in</span>
            </div>
          </div>
          <div>
            <h5 style={{ color: 'var(--text-main)', marginBottom: '16px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <Link to="/"        className="footer-link">Home</Link>
              <Link to="/shop"    className="footer-link">Shop</Link>
              <Link to="/about"   className="footer-link">About Us</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </div>
          <div>
            <h5 style={{ color: 'var(--text-main)', marginBottom: '16px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Account</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <Link to="/login"     className="footer-link">Sign In</Link>
              <Link to="/register"  className="footer-link">Register</Link>
              <Link to="/dashboard" className="footer-link">My Orders</Link>
              <Link to="/wishlist"  className="footer-link">Wishlist</Link>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '36px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem' }}>
          <p style={{ opacity: 0.7 }}>&copy; {new Date().getFullYear()} CHRONOS. All rights reserved.</p>
          <p style={{ opacity: 0.7 }}>Crafted with ❤️ in Nadiad, Gujarat, India</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;