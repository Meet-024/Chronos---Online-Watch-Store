import React from 'react';
import { Link } from 'react-router-dom';
import { Watch, Award, Users, MapPin, ShieldCheck, Zap, Heart } from 'lucide-react';
const TEAM = [
  { initials: 'MM', name: 'Meet Monani', role: 'Founder, CEO & Head Developer', bio: 'Visionary founder and lead developer of CHRONOS, combining a passion for horology with full-stack expertise to build the ultimate watch shopping experience.' },
  { initials: 'JS', name: 'Jiya Shah',   role: 'Head of Design',               bio: 'Creative force behind CHRONOS\'s visual identity, bringing an elegant aesthetic sensibility and a deep love for luxury product design.' },
];
const VALUES = [
  { icon: Award,       title: 'Craftsmanship',  desc: 'Every watch we carry is hand-selected for its exceptional build quality, movement precision, and heritage brand legacy.' },
  { icon: ShieldCheck, title: 'Authenticity',   desc: 'We guarantee 100% genuine timepieces, sourced directly from authorized distributors and verified manufacturers.' },
  { icon: Users,       title: 'Community',      desc: 'More than a store — we\'re a community of watch lovers, horology enthusiasts, and style connoisseurs.' },
  { icon: Zap,         title: 'Innovation',     desc: 'From mechanical marvels to cutting-edge smartwatches, we stay ahead of the curve in watchmaking trends.' },
  { icon: Heart,       title: 'Passion',        desc: 'We don\'t just sell watches — we share stories. Every piece in our collection has a soul and a history.' },
  { icon: MapPin,      title: 'Local Roots',    desc: 'Proudly based in Nadiad, Gujarat — bringing world-class watches to passionate collectors across India.' },
];
const About = () => {
  return (
    <div style={{ paddingBottom: '60px' }}>
      <div className="about-hero">
        <div className="about-hero-content">
          <div className="about-hero-badge">
            <Watch size={16} /> Est. 2018 · Nadiad, India
          </div>
          <h1 className="about-hero-title">Timeless Elegance,<br />Modern Precision</h1>
          <p className="about-hero-sub">
            At CHRONOS, we believe a watch is more than an instrument of time — it's a statement of character,
            a mark of craftsmanship, and a companion for life's defining moments.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
            <Link to="/shop" className="btn" style={{ padding: '14px 36px', fontSize: '1rem' }}>Explore Collection</Link>
            <Link to="/contact" className="btn btn-outline" style={{ padding: '14px 36px', fontSize: '1rem' }}>Get in Touch</Link>
          </div>
        </div>
      </div>
      <div className="about-stats-strip">
        {[
          { num: '500+', label: 'Watches in Stock' },
          { num: '30+',  label: 'Premium Brands'   },
          { num: '5K+',  label: 'Happy Customers'  },
          { num: '8',    label: 'Years of Trust'   },
        ].map(s => (
          <div key={s.label} className="about-stat-item">
            <span className="about-stat-num">{s.num}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
      <section className="about-section">
        <div className="about-section-label">Our Story</div>
        <h2 className="about-section-title">A Love for Timepieces,<br />Born in Nadiad</h2>
        <div className="about-story-grid">
          <div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', fontSize: '1rem', marginBottom: '20px' }}>
              CHRONOS was born in 2018 out of a simple frustration: finding a premium watch in India meant either
              overpaying at a mall or settling for imitations online. Our founder, a lifelong watch enthusiast,
              decided to change that.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', fontSize: '1rem', marginBottom: '20px' }}>
              Starting with a hand-curated selection of 20 watches in a small showroom on College Road, Nadiad,
              CHRONOS quickly became the go-to destination for discerning buyers who understood the difference
              between a timepiece and a watch.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', fontSize: '1rem' }}>
              Today, we carry over 500 models from 30+ prestigious brands — from the intricate mechanics of
              Swiss automatics to the smart precision of modern wearables — all verified authentic and backed
              by our CHRONOS guarantee.
            </p>
          </div>
          <div className="about-story-visual">
            <div className="about-story-card">
              <Watch size={64} style={{ color: 'var(--primary-color)', marginBottom: '16px' }} />
              <blockquote style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: '1.7', color: 'var(--text-main)', fontStyle: 'italic', margin: 0 }}>
                "We don't just sell watches. We connect people with moments — the kind that last a lifetime."
              </blockquote>
              <cite style={{ display: 'block', marginTop: '16px', fontSize: '0.85rem', color: 'var(--primary-color)', fontStyle: 'normal', fontWeight: 600 }}>
                — Meet Vaghasiya, Founder
              </cite>
            </div>
          </div>
        </div>
      </section>
      <section className="about-section" style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '48px' }}>
        <div className="about-section-label">What We Stand For</div>
        <h2 className="about-section-title" style={{ textAlign: 'center' }}>Our Core Values</h2>
        <div className="about-values-grid">
          {VALUES.map(v => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="about-value-card">
                <div className="about-value-icon">
                  <Icon size={22} />
                </div>
                <h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>{v.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.7', margin: 0 }}>{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="about-section">
        <div className="about-section-label">The People</div>
        <h2 className="about-section-title">Meet the Team</h2>
        <div className="about-team-grid">
          {TEAM.map(member => (
            <div key={member.name} className="about-team-card">
              <div className="about-team-avatar">{member.initials}</div>
              <h4 style={{ marginBottom: '4px' }}>{member.name}</h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '12px', textTransform: 'uppercase' }}>
                {member.role}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="about-cta">
        <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Ready to Find Your Perfect Watch?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 32px' }}>
          Browse our curated collection of premium timepieces, each selected by experts who live and breathe horology.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/shop" className="btn" style={{ padding: '14px 36px', fontSize: '1rem' }}>Shop Collection</Link>
          <Link to="/contact" className="btn btn-outline" style={{ padding: '14px 36px', fontSize: '1rem' }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
};
export default About;