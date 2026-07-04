import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to send message. Please check your connection.');
    }
    setLoading(false);
  };
  return (
    <div style={{ paddingBottom: '60px' }}>
      <div style={{ textAlign: 'center', padding: '48px 20px 40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(184,150,12,0.1)', color: 'var(--primary-color)', padding: '6px 16px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <Info size={13} /> We're Here to Help
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Get in Touch</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>
          Have a question about our premium watches? Whether you're looking for a specific model or need
          help with a recent order, our CHRONOS team in Nadiad is here for you.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '40px', alignItems: 'start' }} className="contact-grid">
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            <div className="contact-info-card">
              <div className="contact-info-icon"><MapPin size={22} /></div>
              <div>
                <h4 style={{ marginBottom: '4px', fontSize: '1rem' }}>Visit Our Showroom</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  CHRONOS HQ<br />
                  College Road, Nadiad<br />
                  Gujarat 387001, India
                </p>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon"><Phone size={22} /></div>
              <div>
                <h4 style={{ marginBottom: '4px', fontSize: '1rem' }}>Call Us</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  +91 98765 43210<br />
                  +91 91234 56789 (WhatsApp)
                </p>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon"><Mail size={22} /></div>
              <div>
                <h4 style={{ marginBottom: '4px', fontSize: '1rem' }}>Email Us</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  support@chronoswatches.in<br />
                  sales@chronoswatches.in
                </p>
              </div>
            </div>
          </div>
          <div className="contact-about-cta">
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '14px' }}>
              Want to learn more about CHRONOS — our story, our team, and our mission?
            </p>
            <Link to="/about" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 20px', fontSize: '0.88rem' }}>
              Learn About Us →
            </Link>
          </div>
        </div>
        <div className="card" style={{ padding: '40px', background: 'var(--card-bg)' }}>
          <h3 style={{ marginBottom: '6px' }}>Send a Message</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '28px' }}>
            We typically respond promptly to all inquiries.
          </p>
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 20px', gap: '16px' }}>
              <Send size={48} style={{ color: 'var(--primary-color)' }} />
              <h4>Message Sent Successfully!</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Thank you for reaching out. Our Nadiad support team will get back to you shortly.</p>
              <button className="btn btn-outline" style={{ marginTop: '10px' }} onClick={() => setSent(false)}>Send Another</button>
            </div>
          ) : (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
              {error && <p style={{ color: 'var(--danger-color)', fontSize: '0.9rem' }}>{error}</p>}
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" className="form-control" placeholder="e.g. Meet Monani" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" className="form-control" placeholder="meet@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select name="subject" className="form-control" value={form.subject} onChange={handleChange} required style={{ cursor: 'pointer' }}>
                  <option value="">Select a topic...</option>
                  <option value="Order Inquiry">Order Inquiry</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Return / Exchange">Return / Exchange</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" className="form-control" rows="5" placeholder="How can we help you today?" value={form.message} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="btn" style={{ padding: '14px', fontSize: '1rem', marginTop: '4px' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
export default Contact;