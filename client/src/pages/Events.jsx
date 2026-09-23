import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state (sync with URL params where possible)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('upcoming'); // 'upcoming', 'price-low', 'price-high', 'scarcity'

  // Booking Modal Drawer State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all events on load
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/events');
      setEvents(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch the cyber event lineup. Please try reloading the terminal.');
    } finally {
      setLoading(false);
    }
  };

  // Sync state filters to URL params
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Filter and sort the local events list
  const filteredEvents = events.filter(evt => {
    const matchesSearch = 
      evt.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      evt.venue?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      evt.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'scarcity') {
      const leftA = (a.totalSeats || 0) - (a.bookedSeats || 0);
      const leftB = (b.totalSeats || 0) - (b.bookedSeats || 0);
      return leftA - leftB; // low seats left first
    }
    // Default: 'upcoming' chronological date
    return new Date(a.date) - new Date(b.date);
  });

  // Handle ticket booking
  const openBookingDrawer = (event) => {
    setSelectedEvent(event);
    setBookingSuccess(null);
    setBookingError(null);
    setSeatsToBook(1);
  };

  const closeBookingDrawer = () => {
    setSelectedEvent(null);
  };

  const handleBookTickets = async (e) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || seatsToBook < 1) {
      setBookingError('Please complete all cyber-credentials fields.');
      return;
    }

    const availableSeats = selectedEvent.totalSeats - selectedEvent.bookedSeats;
    if (seatsToBook > availableSeats) {
      setBookingError(`Only ${availableSeats} tickets are remaining for this venue.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setBookingError(null);

      // 1. Submit Booking
      const totalCost = selectedEvent.price * seatsToBook;
      const bookingData = {
        event: selectedEvent.name,
        buyerName: bookingName,
        buyerEmail: bookingEmail,
        seatsBooked: Number(seatsToBook),
        totalPaid: totalCost,
        bookingDate: new Date(),
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=EVENTIFY-${encodeURIComponent(selectedEvent.name)}-${encodeURIComponent(bookingName)}-${seatsToBook}`
      };

      const bookingRes = await axios.post('/api/bookings', bookingData);

      // 2. Update Event remaining seat count
      const updatedEvent = {
        ...selectedEvent,
        bookedSeats: selectedEvent.bookedSeats + Number(seatsToBook)
      };
      await axios.put(`/api/events/${selectedEvent._id}`, updatedEvent);

      setBookingSuccess(bookingRes.data);
      
      // Refresh local events list to reflect real-time count change
      fetchEvents();
      
      // Reset form
      setBookingName('');
      setBookingEmail('');
    } catch (err) {
      console.error('Booking process failed:', err);
      setBookingError('Transaction failed on secure rails. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['All', 'Music', 'Sports', 'Tech', 'Food', 'Art'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      
      {/* 1. Page Compact Hero Section */}
      <section className="hero" style={{ padding: '40px 0 20px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--secondary)' }}>LIVE PULSE EVENT STREAM</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '8px 0' }}>
            FIND YOUR <span className="gradient-text">VIBE</span>
          </h1>
          <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--muted)', fontSize: '1rem' }}>
            Browse through live events, high-octane stadium tournaments, and elite secret culinary experiences.
          </p>
        </div>
      </section>

      {/* 2. Interactive Filter & Search Control Panel */}
      <section className="section" style={{ padding: '30px 0 10px 0' }}>
        <div className="container">
          <div className="booking-card" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>Search Arena / Keywords</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rave, Arena, Stadium, Paris..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'var(--surface-2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text)',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>Sort Configuration</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'var(--surface-2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text)',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  <option value="upcoming">Chronological: Upcoming First</option>
                  <option value="scarcity">High Scarcity: Fewest Seats Left</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Category Pill Filters */}
            <div>
              <span style={{ display: 'inline-block', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', marginRight: '16px', fontWeight: '600' }}>Filter Category:</span>
              <div className="filters" style={{ display: 'inline-flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '30px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: selectedCategory === cat ? '#000' : 'var(--text)',
                      border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Event Catalog Grid Section */}
      <section className="section" style={{ padding: '0 0 60px 0' }}>
        <div className="container">
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="skeleton skeleton-text" style={{ width: '150px', margin: '0 auto 20px auto' }}></div>
              <div className="grid-3">
                <div className="skeleton skeleton-card" style={{ height: '320px' }}></div>
                <div className="skeleton skeleton-card" style={{ height: '320px' }}></div>
                <div className="skeleton skeleton-card" style={{ height: '320px' }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '30px' }}>
              {error}
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
              <h3 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>NO ELECTROMAGNETIC ENCOUNTERS FOUND</h3>
              <p style={{ color: 'var(--muted)', maxWidth: '400px', margin: '0 auto 20px auto' }}>We couldn't match your search criteria. Try selecting another category or clear filters.</p>
              <button className="btn btn-primary" onClick={() => { setSearchTerm(''); handleCategorySelect('All'); }}>Reset All Filters</button>
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid-3" style={{ gap: '30px' }}>
              {filteredEvents.map((evt) => {
                const total = evt.totalSeats || 0;
                const booked = evt.bookedSeats || 0;
                const remaining = total - booked;
                const pctBooked = Math.min(100, Math.round((booked / total) * 100));
                const isSoldOut = remaining <= 0;

                return (
                  <div 
                    key={evt._id} 
                    className="card reveal" 
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '0',
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative'
                    }}
                  >
                    {/* Category Label Capsule Badge */}
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      zIndex: 10,
                      background: 'rgba(9, 10, 15, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: 'var(--secondary)',
                      padding: '4px 12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      borderLeft: '3px solid var(--secondary)'
                    }}>
                      {evt.category || 'VIBE'}
                    </span>

                    {/* Image Header with fallback */}
                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={evt.imageUrl || `https://picsum.photos/seed/${evt._id}/600/400`} 
                        alt={evt.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80'; }}
                      />
                      {/* Ticket Countdown Ticker */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(9, 10, 15, 0.9)',
                        padding: '6px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        borderTop: '1px solid var(--border)'
                      }}>
                        <span style={{ color: isSoldOut ? 'var(--muted)' : 'var(--accent)' }}>
                          {isSoldOut ? 'SOLD OUT' : `⚡ ONLY ${remaining} SPOTS LEFT`}
                        </span>
                        <span style={{ color: 'var(--text)' }}>{pctBooked}% BOOKED</span>
                      </div>
                    </div>

                    {/* Main Ticket Info Content */}
                    <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text)', textTransform: 'uppercase' }}>
                          {evt.name}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span>📍 {evt.venue || 'Global Arena'}</span>
                          <span>•</span>
                          <span>📅 {evt.date ? new Date(evt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Upcoming'}</span>
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text)', opacity: '0.8', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {evt.description || 'Exclusive experience. Lock down access keys.'}
                        </p>
                      </div>

                      <div>
                        {/* Capacity Progress Bar */}
                        <div style={{ marginBottom: '16px' }}>
                          <div className="progress-bar" style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div className="progress-bar-fill" style={{ width: `${pctBooked}%`, height: '100%', background: 'var(--primary)' }}></div>
                          </div>
                        </div>

                        {/* Price Tag & CTA CTA Action */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>TICKET PRICE</span>
                            <span style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--secondary)' }}>${evt.price || '0.00'}</span>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Link to={`/events/${evt._id}`} className="btn btn-ghost" style={{ padding: '8px 12px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                              Details
                            </Link>
                            {isSoldOut ? (
                              <button disabled className="btn" style={{ padding: '8px 16px', fontSize: '0.8rem', textTransform: 'uppercase', background: '#2A2C35', color: '#6A6C75', border: 'none', cursor: 'not-allowed' }}>
                                Full
                              </button>
                            ) : (
                              <button 
                                onClick={() => openBookingDrawer(evt)}
                                className="btn btn-primary" 
                                style={{ padding: '8px 16px', fontSize: '0.8rem', textTransform: 'uppercase', boxShadow: '0 0 10px rgba(255, 46, 147, 0.2)' }}
                              >
                                Book
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 4. Multi-Step Cyber Checkout Sliding Drawer (Modal format for robust React workflow) */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--surface-2)',
            border: '2px solid var(--primary)',
            maxWidth: '550px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '0',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%)',
            boxShadow: '0 20px 50px rgba(255, 46, 147, 0.3)',
            padding: '30px',
            position: 'relative'
          }}>
            
            {/* Close Cross */}
            <button 
              onClick={closeBookingDrawer}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text)',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            {!bookingSuccess ? (
              <div>
                <span className="eyebrow" style={{ color: 'var(--primary)' }}>SECURE CHECKOUT TERMINAL</span>
                <h3 style={{ textTransform: 'uppercase', marginTop: '4px', marginBottom: '24px', fontSize: '1.4rem' }}>
                  BOOK: <span style={{ color: 'var(--secondary)' }}>{selectedEvent.name}</span>
                </h3>

                {bookingError && (
                  <div className="alert alert-error" style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
                    ⚠️ {bookingError}
                  </div>
                )}

                <form onSubmit={handleBookTickets}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rachel Tyrell" 
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        fontFamily: 'inherit',
                        borderRadius: '4px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>Email Address (for Digital Ticket delivery)</label>
                    <input 
                      type="email" 
                      required
                      placeholder="rachel@nexus6.corp" 
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        fontFamily: 'inherit',
                        borderRadius: '4px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>Seats Count</label>
                      <input 
                        type="number" 
                        min="1" 
                        max={Math.min(10, (selectedEvent.totalSeats - selectedEvent.bookedSeats))}
                        required
                        value={seatsToBook}
                        onChange={(e) => setSeatsToBook(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          color: 'var(--text)',
                          fontFamily: 'inherit',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>Total Cost</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent)', paddingTop: '8px' }}>
                        ${(selectedEvent.price * (seatsToBook || 1)).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button 
                      type="button" 
                      onClick={closeBookingDrawer}
                      className="btn btn-secondary" 
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn btn-primary" 
                      style={{ flex: 2, filter: 'drop-shadow(0 0 8px rgba(255, 46, 147, 0.4))' }}
                    >
                      {isSubmitting ? 'SECURE CODES...' : 'CONFIRM & BOOK'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <span className="eyebrow" style={{ color: 'var(--secondary)' }}>TRANSACTION SUCCESSFUL</span>
                <h3 style={{ textTransform: 'uppercase', marginTop: '8px', marginBottom: '16px', color: 'var(--primary)' }}>YOUR TICKET IS SECURED</h3>
                
                {/* Visual QR Code Ticket Display */}
                <div style={{
                  background: '#FFF',
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  margin: '16px 0',
                  boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
                }}>
                  <img 
                    src={bookingSuccess.qrCodeUrl} 
                    alt="Ticket QR Code" 
                    style={{ width: '180px', height: '180px', display: 'block' }} 
                  />
                </div>

                <div style={{
                  background: 'var(--surface)',
                  padding: '16px',
                  borderRadius: '6px',
                  textAlign: 'left',
                  marginBottom: '24px',
                  fontSize: '0.9rem'
                }}>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Event:</strong> {bookingSuccess.event}</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Ticket Holder:</strong> {bookingSuccess.buyerName}</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Seats Booked:</strong> {bookingSuccess.seatsBooked}</p>
                  <p style={{ margin: '0' }}><strong>ID:</strong> {bookingSuccess._id}</p>
                </div>

                <button 
                  onClick={closeBookingDrawer}
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                >
                  Return to Streaming Feed
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 5. Electric CTA Banner */}
      <section className="section" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="cta-section" style={{
            background: 'linear-gradient(135deg, var(--surface-2) 0%, #0c0e18 100%)',
            border: '1px solid var(--border)',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <span className="eyebrow" style={{ color: 'var(--primary)' }}>EXCLUSIVE MEMBERS CLUB</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginTop: '8px', marginBottom: '16px' }}>
              WANT BACKSTAGE <span className="gradient-text">PASSES</span>?
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 24px auto', color: 'var(--muted)', fontSize: '0.95rem' }}>
              Subscribe to the Eventify private telemetry pipeline. Get absolute priority access 2 hours before main ticket pools open to the public.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <input 
                type="email" 
                placeholder="Enter cyber address" 
                style={{
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  minWidth: '280px',
                  fontFamily: 'inherit'
                }}
              />
              <button 
                className="btn btn-primary" 
                onClick={() => alert('Telemetry alert system locked. Welcome aboard.')}
                style={{ filter: 'drop-shadow(0 0 8px rgba(255, 46, 147, 0.4))' }}
              >
                Join Pipeline
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}