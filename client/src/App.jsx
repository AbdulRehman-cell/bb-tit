import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Admin from './pages/Admin';

export default function App() {
  const [ticketTicker, setTicketTicker] = useState("CYBERPUNK RAVE LONDON: 94% SOLD OUT");
  const location = useLocation();

  // Rotate a fun real-time marquee message about ticket scarcity
  useEffect(() => {
    const tickers = [
      "🔥 TOKYO INDIE FESTIVAL: ONLY 12 TICKETS LEFT",
      "⚡ TECH SUMMIT 2024: PRICE INCREASE IN 4 HOURS",
      "🎤 ARENA LIVE TOUR: NEW DATE ADDED IN PARIS",
      "🌟 SENSORIA SENSORY DINNER: ONLY 3 SLOTS REMAINING",
      "🎸 METAL MANIA: GENERAL ADMISSION 98% SOLD OUT"
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % tickers.length;
      setTicketTicker(tickers[index]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Smoothly scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      
      {/* Dynamic Cyber Scarcity Ticker */}
      <div className="scarcity-ticker" style={{
        background: 'var(--primary)',
        color: '#000',
        padding: '8px 16px',
        fontSize: '0.85rem',
        fontWeight: '700',
        letterSpacing: '1.5px',
        textAlign: 'center',
        textTransform: 'uppercase',
        boxShadow: '0 2px 10px rgba(255, 46, 147, 0.4)',
        position: 'relative',
        zIndex: 1000,
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <div style={{ display: 'inline-block', animation: 'marquee 15s linear infinite' }}>
          {ticketTicker} • SECURE YOUR SPOTS BEFORE THE CHIP BURNS • {ticketTicker}
        </div>
      </div>

      {/* Premium Sticky Header Navigation */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        background: 'rgba(9, 10, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 0
        }}>
          {/* Brand Logo with Electric Kinetic styling */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#000',
              fontWeight: 'bold',
              padding: '6px 12px',
              borderRadius: '4px',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1.2rem',
              letterSpacing: '1px',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
            }}>
              E
            </span>
            <span style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text)',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              EVENT<span style={{ color: 'var(--secondary)' }}>IFY</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <NavLink 
              to="/" 
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: '500',
                color: isActive ? 'var(--primary)' : 'var(--muted)',
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
                transition: 'color 0.2s ease',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '4px'
              })}
            >
              Discover
            </NavLink>
            <NavLink 
              to="/events" 
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: '500',
                color: isActive ? 'var(--secondary)' : 'var(--muted)',
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
                transition: 'color 0.2s ease',
                borderBottom: isActive ? '2px solid var(--secondary)' : '2px solid transparent',
                paddingBottom: '4px'
              })}
            >
              Get Tickets
            </NavLink>
            <NavLink 
              to="/admin" 
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: '500',
                color: isActive ? 'var(--accent)' : 'var(--muted)',
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
                transition: 'color 0.2s ease',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                paddingBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              })}
            >
              <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%' }}></span>
              Admin
            </NavLink>
          </nav>

          {/* Quick Action button */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/events" className="btn btn-secondary" style={{
              fontSize: '0.85rem',
              padding: '8px 18px',
              fontFamily: '"Space Grotesk", sans-serif',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Browse Live
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {/* Premium Dark Theme Footer */}
      <footer style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '60px 24px 30px 24px',
        marginTop: 'auto'
      }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-4" style={{ marginBottom: '40px' }}>
            
            {/* Brand Intro */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  color: '#000',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '1rem'
                }}>E</span>
                <span style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}>EVENTIFY</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                The next-generation live event experience platform. Powered by neon light, adrenaline, and secure instant ticket technology.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontFamily: '"Space Grotesk", sans-serif', color: 'var(--text)', fontSize: '1.1rem', marginBottom: '16px', letterSpacing: '0.5px' }}>
                NAVIGATE
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Discovery Deck</Link></li>
                <li><Link to="/events" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Interactive Catalog</Link></li>
                <li><Link to="/admin" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Event Command Center</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 style={{ fontFamily: '"Space Grotesk", sans-serif', color: 'var(--text)', fontSize: '1.1rem', marginBottom: '16px', letterSpacing: '0.5px' }}>
                EXPERIENCES
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link to="/events?category=Music" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Nightlife & Festivals</Link></li>
                <li><Link to="/events?category=Sports" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem' }}>High-Octane Sports</Link></li>
                <li><Link to="/events?category=Tech" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Keynotes & Tech Summits</Link></li>
                <li><Link to="/events?category=Food" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Artisanal Dining</Link></li>
              </ul>
            </div>

            {/* Security Note */}
            <div>
              <h4 style={{ fontFamily: '"Space Grotesk", sans-serif', color: 'var(--text)', fontSize: '1.1rem', marginBottom: '16px', letterSpacing: '0.5px' }}>
                SECURE ACCESS
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                All purchases generate an instant crypto-signed QR code ticket. Scan cleanly on arrival at our high-velocity partner gate terminals.
              </p>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <span className="pill" style={{ background: 'rgba(0, 240, 255, 0.1)', borderLeft: '3px solid var(--secondary)', color: 'var(--secondary)' }}>
                  SECURED BY SHIELD-9
                </span>
              </div>
            </div>

          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '30px 0' }} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            color: 'var(--muted)',
            fontSize: '0.85rem'
          }}>
            <p>© {new Date().getFullYear()} EVENTIFY INC. ALL SYSTEM CREDENTIALS VALID.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Security Terms</a>
              <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Privacy Node</a>
              <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Terminal Status</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS Inject for Marquee & Animations */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(10%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}