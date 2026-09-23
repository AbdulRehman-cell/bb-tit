import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quick categories matching the design brief topics
  const categories = ['All', 'Music', 'Sports', 'Tech', 'Food', 'Art'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/events');
        // Sort by date or scarcity, take top 3 for the home page
        const sorted = (response.data || []).slice(0, 3);
        setTrendingEvents(sorted);
        setError(null);
      } catch (err) {
        console.error('Error loading trending events:', err);
        setError('Could not load events. Please verify the server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filtered preview based on landing page selection
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    // Navigate to events page with pre-selected category filter
    navigate(`/events?category=${cat}`);
  };

  return (
    <div className="home-page-wrapper" style={{ overflowX: 'hidden' }}>
      
      {/* SECTION 1: Full-Bleed High-Octane Hero Section */}
      <section className="hero" style={{ position: 'relative' }}>
        <img 
          className="hero-bg" 
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80" 
          alt="Crowded music festival mainstage with laser show and ecstatic crowd" 
          style={{ filter: 'brightness(0.35) contrast(1.15) saturate(1.2)' }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="eyebrow" style={{ color: 'var(--secondary)', letterSpacing: '4px', textTransform: 'uppercase' }}>
            ⚡ THE ULTIMATE LIVE EXPERIENCES
          </span>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>
            Forge memories that vibrate in <span className="gradient-text">neon</span>
          </h1>
          <p className="hero-subtitle" style={{ color: 'var(--muted)', maxWidth: '640px', margin: '16px 0 32px 0' }}>
            Snag official entry tickets to high-octane music festivals, raw stadium sports action, immersive late-night tech keynotes, and elite underground culinary battles.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/events" className="btn btn-primary" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
              Explore Events
            </Link>
            <Link to="/admin" className="btn btn-secondary" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
              Create Event
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: Live Ticket Scarcity & Kinetic Stats Band */}
      <section className="section" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div className="stat-card" style={{ padding: '24px', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <span className="stat-value" style={{ display: 'block', fontSize: '3rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Space Grotesk' }}>
                98.4%
              </span>
              <span className="stat-label" style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                Avg. Ticket Fill Rate
              </span>
            </div>
            <div className="stat-card" style={{ padding: '24px', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <span className="stat-value" style={{ display: 'block', fontSize: '3rem', fontWeight: 700, color: 'var(--secondary)', fontFamily: 'Space Grotesk' }}>
                240K+
              </span>
              <span className="stat-label" style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                Secured Bookings
              </span>
            </div>
            <div className="stat-card" style={{ padding: '24px', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <span className="stat-value" style={{ display: 'block', fontSize: '3rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>
                12ms
              </span>
              <span className="stat-label" style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                Instant Ticket Minting
              </span>
            </div>
            <div className="stat-card" style={{ padding: '24px', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <span className="stat-value" style={{ display: 'block', fontSize: '3rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'Space Grotesk' }}>
                100%
              </span>
              <span className="stat-label" style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                Verified Venues
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Dynamic Category Quick-Filter Bar */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="eyebrow" style={{ color: 'var(--secondary)', letterSpacing: '2px' }}>DISCOVER YOUR ZONE</span>
            <h2 style={{ fontFamily: 'Space Grotesk' }}>Find Your Next High-Energy Outing</h2>
            <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '12px auto 0 auto' }}>
              Filter live events instantly by category. Click a chip to dive into the full ticket catalogue and secure your spot.
            </p>
          </div>

          <div className="filter-bar" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                style={{
                  padding: '12px 24px',
                  borderRadius: '999px',
                  background: selectedCategory === cat ? 'var(--primary)' : 'var(--surface)',
                  color: selectedCategory === cat ? '#000' : 'var(--text)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  letterSpacing: '1px',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat === 'All' ? '🔥 All Pulse' : cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Trending Event Tickets Grid */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '40px' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--primary)', letterSpacing: '2px' }}>CHRONOLOGICAL SELECTION</span>
              <h2 style={{ fontFamily: 'Space Grotesk', margin: '8px 0 0 0' }}>Trending Now Near You</h2>
            </div>
            <Link to="/events" className="btn btn-ghost" style={{ borderBottom: '2px solid var(--primary)', color: 'var(--text)', textDecoration: 'none', fontWeight: '700' }}>
              View All Live Events →
            </Link>
          </div>

          {loading ? (
            <div className="skeleton-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div className="skeleton skeleton-card" style={{ height: '380px', background: 'var(--surface-2)' }}></div>
              <div className="skeleton skeleton-card" style={{ height: '380px', background: 'var(--surface-2)' }}></div>
              <div className="skeleton skeleton-card" style={{ height: '380px', background: 'var(--surface-2)' }}></div>
            </div>
          ) : error ? (
            <div className="alert alert-error" style={{ background: 'rgba(255, 46, 147, 0.1)', border: '1px solid var(--primary)', padding: '24px', color: 'var(--text)' }}>
              {error}
              <div style={{ marginTop: '12px' }}>
                <Link to="/admin" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>Create Mock Event Now</Link>
              </div>
            </div>
          ) : trendingEvents.length === 0 ? (
            <div className="alert alert-info" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>No events have been created on this node yet.</p>
              <Link to="/admin" className="btn btn-primary">Initialize Demo Events</Link>
            </div>
          ) : (
            <div className="grid grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {trendingEvents.map((evt) => {
                const soldOutPercent = Math.min(100, Math.round(((evt.bookedSeats || 0) / (evt.totalSeats || 100)) * 100));
                const remaining = (evt.totalSeats || 0) - (evt.bookedSeats || 0);

                return (
                  <div 
                    key={evt._id} 
                    className="card reveal" 
                    style={{ 
                      background: 'var(--surface-2)', 
                      border: '1px solid var(--border)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      overflow: 'hidden'
                    }}
                  >
                    <div>
                      {/* Image header with category pill overlay */}
                      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                        <img 
                          src={evt.imageUrl || `https://picsum.photos/seed/${evt._id || 'event'}/600/400`} 
                          alt={evt.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ 
                          position: 'absolute', 
                          top: '12px', 
                          left: '12px',
                          background: 'rgba(9, 10, 15, 0.85)',
                          borderLeft: '4px solid var(--primary)',
                          padding: '6px 12px',
                          color: 'var(--text)',
                          fontWeight: '700',
                          fontSize: '0.75rem',
                          letterSpacing: '1px',
                          textTransform: 'uppercase'
                        }}>
                          {evt.category || 'MUSIC'}
                        </div>
                        {remaining <= 10 && remaining > 0 && (
                          <div style={{ 
                            position: 'absolute', 
                            top: '12px', 
                            right: '12px',
                            background: 'var(--accent)',
                            color: '#000',
                            padding: '4px 8px',
                            fontWeight: '700',
                            fontSize: '0.7rem',
                            borderRadius: '4px'
                          }}>
                            SELLING FAST
                          </div>
                        )}
                      </div>

                      {/* Event Details */}
                      <div style={{ padding: '24px' }}>
                        <span style={{ color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                          {evt.date ? new Date(evt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                        </span>
                        <h3 style={{ fontFamily: 'Space Grotesk', margin: '0 0 12px 0', fontSize: '1.4rem' }}>{evt.name}</h3>
                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: '0 0 20px 0', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '44px' }}>
                          {evt.description || 'No description provided.'}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 8px 0' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>STADIUM CAPACITY</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: '700' }}>{evt.bookedSeats || 0} / {evt.totalSeats || 100} FILLED</span>
                        </div>
                        
                        {/* Interactive Spark Capacity Fill Bar */}
                        <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.08)', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                          <div 
                            className="progress-bar-fill" 
                            style={{ 
                              width: `${soldOutPercent}%`, 
                              height: '100%', 
                              background: 'linear-gradient(90deg, var(--primary), var(--secondary))' 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '0 24px 24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block' }}>ENTRY PRICE</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent)' }}>${evt.price || 49}</span>
                      </div>
                      <Link to={`/events/${evt._id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        GET PASS
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: Immersive Video Promo & Live Broadcast */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="eyebrow" style={{ color: 'var(--secondary)', letterSpacing: '2px' }}>FEEL THE AUDIO-VISUAL PULSE</span>
            <h2 style={{ fontFamily: 'Space Grotesk' }}>Experience Eventify In Motion</h2>
            <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '12px auto 0 auto' }}>
              Check out live highlight snippets from our global nightlife partner arenas, stadium actions, and techno-infused mainstages.
            </p>
          </div>

          <div className="video-embed" style={{ 
            maxWidth: '960px', 
            margin: '0 auto', 
            border: '2px solid var(--border)', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            aspectRatio: '16/9',
            overflow: 'hidden',
            background: '#000'
          }}>
            <iframe 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1" 
              title="Eventify Promo Video Showcase" 
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            ></iframe>
          </div>
        </div>
      </section>

      {/* SECTION 6: High-Octane "How it Works" Steps Row */}
      <section className="section" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="eyebrow" style={{ color: 'var(--primary)', letterSpacing: '2px' }}>TRANSACTIONS COMPLETED IN FLASH</span>
            <h2 style={{ fontFamily: 'Space Grotesk' }}>Zero Friction. Max Experience.</h2>
          </div>

          <div className="step-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div className="step" style={{ background: 'var(--surface)', padding: '32px', border: '1px solid var(--border)', position: 'relative' }}>
              <div className="step-num" style={{ fontSize: '4rem', fontWeight: '800', color: 'rgba(255, 46, 147, 0.1)', position: 'absolute', top: '12px', right: '16px', lineHeight: 1 }}>01</div>
              <h3 style={{ fontFamily: 'Space Grotesk', color: 'var(--secondary)', fontSize: '1.25rem', marginBottom: '12px' }}>Find Your Vibe</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0 }}>
                Explore curated, high-contrast listings by real-world organizers. Music, culinary battles, gaming hubs, or raw athletic stadium events.
              </p>
            </div>

            <div className="step" style={{ background: 'var(--surface)', padding: '32px', border: '1px solid var(--border)', position: 'relative' }}>
              <div className="step-num" style={{ fontSize: '4rem', fontWeight: '800', color: 'rgba(0, 240, 255, 0.1)', position: 'absolute', top: '12px', right: '16px', lineHeight: 1 }}>02</div>
              <h3 style={{ fontFamily: 'Space Grotesk', color: 'var(--accent)', fontSize: '1.25rem', marginBottom: '12px' }}>Secure Cyber-Pass</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0 }}>
                Claim your entry slots using our instantaneous booking drawer. Live countdown timers ensure you grab tickets at guaranteed current rates.
              </p>
            </div>

            <div className="step" style={{ background: 'var(--surface)', padding: '32px', border: '1px solid var(--border)', position: 'relative' }}>
              <div className="step-num" style={{ fontSize: '4rem', fontWeight: '800', color: 'rgba(255, 210, 0, 0.1)', position: 'absolute', top: '12px', right: '16px', lineHeight: 1 }}>03</div>
              <h3 style={{ fontFamily: 'Space Grotesk', color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '12px' }}>Scan & Enter</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0 }}>
                Unlock high-fidelity QR tickets instantly inside your order ledger. Show the glowing mobile ticket barcode directly at the physical gates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Glowing Testimonials from Real Ravers & Speakers */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="eyebrow" style={{ color: 'var(--secondary)', letterSpacing: '2px' }}>COMMUNITY CHATTER</span>
            <h2 style={{ fontFamily: 'Space Grotesk' }}>Raved & Verified Globally</h2>
          </div>

          <div className="grid grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="testimonial-card" style={{ background: 'var(--surface-2)', padding: '32px', border: '1px solid var(--border)', position: 'relative' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text)', marginBottom: '24px', fontSize: '1rem', lineHeight: '1.6' }}>
                "The countdown ticker is insanely accurate! I managed to secure the final VIP lounge pass for London Rave-Tech right as the bar turned completely neon red. Incredible rush!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img className="avatar avatar-md" src="https://i.pravatar.cc/300?img=12" alt="Marcus" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: '700', color: 'var(--primary)', fontSize: '0.95rem' }}>Marcus Sterling</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Verified Club Promoter</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card" style={{ background: 'var(--surface-2)', padding: '32px', border: '1px solid var(--border)', position: 'relative' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text)', marginBottom: '24px', fontSize: '1rem', lineHeight: '1.6' }}>
                "Publishing sports tournaments through Eventify took us less than 4 minutes. Real-time seat tracking on our stadium mapping made booking checkouts perfectly fluid for fans."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img className="avatar avatar-md" src="https://i.pravatar.cc/300?img=33" alt="Lina" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: '700', color: 'var(--secondary)', fontSize: '0.95rem' }}>Lina Kozlov</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Keynote Event Coordinator</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card" style={{ background: 'var(--surface-2)', padding: '32px', border: '1px solid var(--border)', position: 'relative' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text)', marginBottom: '24px', fontSize: '1rem', lineHeight: '1.6' }}>
                "I scan the dynamic tickets straight from my phone screen under heavy, low-light techno club strobe lights, and the barcode scanner picks it up in a fraction of a millisecond. Elite UI."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img className="avatar avatar-md" src="https://i.pravatar.cc/300?img=60" alt="Jayden" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: '700', color: 'var(--accent)', fontSize: '0.95rem' }}>Jayden Mercer</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Avid Festival Attendee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Final Epic Glowing CTA Band */}
      <section className="section" style={{ background: 'var(--bg)', paddingBottom: '80px' }}>
        <div className="container">
          <div className="cta-section" style={{ 
            background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface) 100%)', 
            border: '2px solid var(--primary)', 
            padding: '60px', 
            borderRadius: '0px', 
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'var(--primary)', opacity: '0.05', filter: 'blur(80px)' }}></div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '200px', height: '200px', background: 'var(--secondary)', opacity: '0.05', filter: 'blur(80px)' }}></div>
            
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '2.5rem', marginBottom: '16px' }}>Ready to Fuel Your <span className="gradient-text">Pulse</span>?</h2>
            <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 32px auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Secure tickets to underground electronic raves, live athletic games, and VIP tech summits before the next live scarcity tier hits.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/events" className="btn btn-primary" style={{ padding: '14px 32px', letterSpacing: '1px' }}>
                BROWSE LIVE TICKETS
              </Link>
              <Link to="/admin" className="btn btn-secondary" style={{ padding: '14px 32px', letterSpacing: '1px' }}>
                HOST AN EVENT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Cyber Footer */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '60px 0 40px 0', color: 'var(--muted)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <span style={{ 
                fontFamily: 'Space Grotesk', 
                fontWeight: 700, 
                fontSize: '1.6rem', 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'block',
                marginBottom: '16px'
              }}>
                EVENTIFY
              </span>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                An electric, cyber-neon event ticketing engine delivering ultra-fast scanning and real-time scarcity intelligence.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text)', fontFamily: 'Space Grotesk', marginBottom: '16px', fontSize: '1rem' }}>CATEGORIES</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><Link to="/events?category=Music" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Underground Music</Link></li>
                <li><Link to="/events?category=Sports" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Stadium Action</Link></li>
                <li><Link to="/events?category=Tech" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Keynote summits</Link></li>
                <li><Link to="/events?category=Food" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Artisanal Food</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--text)', fontFamily: 'Space Grotesk', marginBottom: '16px', fontSize: '1rem' }}>ENGINEERS</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><Link to="/admin" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Command Center</Link></li>
                <li><Link to="/events" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Live Ticketing</Link></li>
                <li><a href="#pulse" style={{ color: 'var(--muted)', textDecoration: 'none' }}>System Status</a></li>
                <li><a href="#api" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Developer APIs</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--text)', fontFamily: 'Space Grotesk', marginBottom: '16px', fontSize: '1rem' }}>CONTACT PULSE</h4>
              <p style={{ fontSize: '0.9rem', margin: '0 0 12px 0' }}>Support Hotline: 24/7 Digital Desk</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>support@eventify.cyber</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem' }}>
            <span>© {new Date().getFullYear()} Eventify Labs Inc. All live entry points verified.</span>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#privacy" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#terms" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Cybernetic Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}