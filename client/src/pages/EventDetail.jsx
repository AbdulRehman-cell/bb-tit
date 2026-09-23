import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Form State
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [seatsBooked, setSeatsBooked] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Event Details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Could not load event details. It might have been taken off the grid or does not exist.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      alert('Please fill out all fields to generate your tickets.');
      return;
    }
    if (seatsBooked < 1) {
      alert('You must book at least 1 ticket.');
      return;
    }

    const availableSeats = event.totalSeats - (event.bookedSeats || 0);
    if (seatsBooked > availableSeats) {
      alert(`Only ${availableSeats} tickets are currently available.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const totalPaid = seatsBooked * event.price;
      
      // Generate a mock high-tech QR code URL
      const mockQrData = encodeURIComponent(`EVENTIFY-TICKET-${event._id}-${buyerEmail}-${seatsBooked}`);
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${mockQrData}&color=ff2e93&bgcolor=090a0f`;

      const bookingPayload = {
        event: event.name,
        buyerName,
        buyerEmail,
        seatsBooked: Number(seatsBooked),
        totalPaid,
        bookingDate: new Date(),
        qrCodeUrl
      };

      // 1. Save the booking
      const bookingRes = await axios.post('/api/bookings', bookingPayload);

      // 2. Update the event's bookedSeats count
      await axios.put(`/api/events/${event._id}`, {
        bookedSeats: (event.bookedSeats || 0) + Number(seatsBooked)
      });

      setBookingSuccess(bookingRes.data);
      
      // Refresh event details to update state counters
      const updatedEventRes = await axios.get(`/api/events/${id}`);
      setEvent(updatedEventRes.data);
    } catch (err) {
      console.error('Error completing purchase:', err);
      alert('Payment processing or seat allocation failed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="skeleton skeleton-text" style={{ height: '40px', width: '300px', margin: '0 auto 20px' }}></div>
        <div className="skeleton skeleton-card" style={{ height: '400px', maxWidth: '800px', margin: '0 auto' }}></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          {error || 'Event details not found.'}
        </div>
        <Link to="/events" className="btn btn-primary">Browse Active Events</Link>
      </div>
    );
  }

  const remainingSeats = event.totalSeats - (event.bookedSeats || 0);
  const fillPercentage = Math.min(100, Math.round(((event.bookedSeats || 0) / event.totalSeats) * 100));
  const isSoldOut = remainingSeats <= 0;

  return (
    <div className="event-detail-page">
      {/* Dynamic Hero Section */}
      <section className="hero" style={{ minHeight: '50vh', position: 'relative' }}>
        <img 
          className="hero-bg" 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200'} 
          alt={event.name} 
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="eyebrow" style={{ textTransform: 'uppercase', color: 'var(--secondary)' }}>
            ⚡ LIVE IN {event.venue || 'ONLINE'}
          </span>
          <h1>
            {event.name.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="gradient-text">{event.name.split(' ').pop()}</span>
          </h1>
          <p className="hero-subtitle">
            Experience the kinetic energy of premium live events. Join us on {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>
          <div className="hero-actions">
            <a href="#checkout-flow" className="btn btn-primary">Secure Tickets Now</a>
            <Link to="/events" className="btn btn-secondary">Back to Lineup</Link>
          </div>
        </div>
      </section>

      {/* Main Core Grid Info */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ gap: '40px', alignItems: 'start' }}>
            
            {/* Left Column: Details & Experience info */}
            <div>
              <div className="section-head" style={{ textAlign: 'left', marginBottom: '24px' }}>
                <span className="eyebrow" style={{ textTransform: 'uppercase' }}>CHRONICLES & EXPERIENCE</span>
                <h2>Event <span className="gradient-text">Manifesto</span></h2>
              </div>
              
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text)', marginBottom: '32px' }}>
                {event.description || 'No description provided. Secure your pass to witness a transcendent showcase of dynamic stage presence, high-fidelity sound systems, and an atmosphere calculated for optimal sensory stimulation.'}
              </p>

              {/* Event Metadata Cards with Premium Motif styling */}
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '40px' }}>
                <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
                  <span className="eyebrow" style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>TIME & DATE</span>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem', marginTop: '8px', color: 'var(--text)' }}>
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Doors at 20:00 PM PST
                  </div>
                </div>

                <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--secondary)' }}>
                  <span className="eyebrow" style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>VENUE / COORDINATES</span>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem', marginTop: '8px', color: 'var(--text)' }}>
                    {event.venue || 'Cyber Arena Mainstage'}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Access code issued with ticket
                  </div>
                </div>

                <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--accent)' }}>
                  <span className="eyebrow" style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>BASE TICKET RATE</span>
                  <div style={{ fontWeight: '700', fontSize: '1.4rem', marginTop: '8px', color: 'var(--accent)' }}>
                    ${event.price || '0.00'}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Excluding local fuel tax
                  </div>
                </div>
              </div>

              {/* Visual Ticket Scarcity Gauge */}
              <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <span className="badge" style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,46,147,0.15)', color: 'var(--primary)' }}>
                  {remainingSeats} LEFT OF {event.totalSeats}
                </span>
                <span className="eyebrow">CAPACITY METRIC</span>
                <h3 style={{ margin: '8px 0 16px' }}>Neon Fuel Gauge</h3>
                
                <div className="progress-bar" style={{ background: 'var(--surface-2)', height: '14px', borderRadius: '7px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div className="progress-bar-fill" style={{ 
                    width: `${fillPercentage}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, var(--secondary), var(--primary))',
                    transition: 'width 1s cubic-bezier(0.1, 0.8, 0.3, 1)'
                  }}></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--muted)' }}>
                  <span>{fillPercentage}% Claimed</span>
                  <span style={{ color: isSoldOut ? 'var(--primary)' : 'var(--secondary)', fontWeight: '700' }}>
                    {isSoldOut ? 'CRITICAL: SOLD OUT' : 'HIGH ENERGY ALLOCATION'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout or Ticket View */}
            <div id="checkout-flow">
              {bookingSuccess ? (
                /* Interactive Ticket Generator View */
                <div className="card" style={{ 
                  padding: '32px', 
                  border: '2px solid var(--secondary)',
                  boxShadow: '0 0 25px rgba(0, 240, 255, 0.25)',
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%)'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span className="badge" style={{ background: 'rgba(0,240,255,0.15)', color: 'var(--secondary)' }}>
                      TRANSACTION CONFIRMED
                    </span>
                    <h2 style={{ marginTop: '12px', fontSize: '1.8rem' }}>Your <span className="gradient-text">Cyber Pass</span></h2>
                    <p style={{ color: 'var(--muted)' }}>Keep this visual token safe. Present the code below at the security checkpoint.</p>
                  </div>

                  <div style={{ background: '#000', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px', border: '1px solid var(--border)' }}>
                    {bookingSuccess.qrCodeUrl ? (
                      <img 
                        src={bookingSuccess.qrCodeUrl} 
                        alt="Cyber QR Code" 
                        style={{ width: '200px', height: '200px', display: 'block', margin: '0 auto 16px', borderRadius: '8px' }}
                      />
                    ) : (
                      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
                        [QR Generating...]
                      </div>
                    )}
                    <span style={{ fontFamily: 'monospace', color: 'var(--secondary)', letterSpacing: '2px', fontSize: '0.9rem' }}>
                      ID: {bookingSuccess._id?.slice(-12).toUpperCase() || 'E-TICKET-ALLOC'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px 0', borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)', fontSize: '0.9rem', marginBottom: '24px' }}>
                    <div>
                      <span style={{ color: 'var(--muted)', display: 'block' }}>HOLDER</span>
                      <strong>{bookingSuccess.buyerName}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--muted)', display: 'block' }}>ALLOCATION</span>
                      <strong>{bookingSuccess.seatsBooked} VIP Pass{bookingSuccess.seatsBooked > 1 ? 'es' : ''}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--muted)', display: 'block' }}>EVENT</span>
                      <strong>{bookingSuccess.event}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--muted)', display: 'block' }}>TRANSACTION</span>
                      <strong>${bookingSuccess.totalPaid} USD</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => window.print()} className="btn btn-secondary" style={{ flex: 1 }}>Print Ticket</button>
                    <button onClick={() => setBookingSuccess(null)} className="btn btn-primary" style={{ flex: 1 }}>Book More</button>
                  </div>
                </div>
              ) : (
                /* Secure Booking Drawer / Checkout Form */
                <div className="card" style={{ 
                  padding: '32px', 
                  border: '1px solid var(--border)',
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%)'
                }}>
                  <div style={{ marginBottom: '24px' }}>
                    <span className="eyebrow" style={{ color: 'var(--primary)' }}>SECURE TRANSACTION STAGE</span>
                    <h3 style={{ marginTop: '8px' }}>Quantum Ticket Checkout</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Fill out your credentials below. Tickets are guaranteed for 10 minutes upon selecting quantity.</p>
                  </div>

                  {isSoldOut ? (
                    <div className="alert alert-error" style={{ textAlign: 'center', padding: '24px 16px' }}>
                      <strong>ALL SLOTS EXHAUSTED</strong>
                      <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Join the waitlist or browse alternative live dates on Eventify.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBooking} style={{ display: 'grid', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                          Legal Full Name
                        </label>
                        <input 
                          type="text" 
                          required
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          placeholder="e.g. Vanessa Sterling"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text)',
                            fontSize: '1rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                          Electronic Mail Address
                        </label>
                        <input 
                          type="email" 
                          required
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          placeholder="e.g. vanessa@kinetic.net"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text)',
                            fontSize: '1rem'
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                            Pass Quantity
                          </label>
                          <select 
                            value={seatsBooked}
                            onChange={(e) => setSeatsBooked(Number(e.target.value))}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              background: 'var(--surface-2)',
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              color: 'var(--text)',
                              fontSize: '1rem'
                            }}
                          >
                            {[...Array(Math.min(10, remainingSeats))].map((_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1} Ticket{i > 0 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                            Total Due
                          </label>
                          <div style={{ 
                            padding: '12px 16px', 
                            background: 'rgba(0,240,255,0.05)', 
                            border: '1px solid rgba(0,240,255,0.2)', 
                            borderRadius: '8px',
                            color: 'var(--secondary)',
                            fontWeight: '700',
                            fontSize: '1.2rem',
                            textAlign: 'center'
                          }}>
                            ${(seatsBooked * (event.price || 0)).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '12px' }}
                      >
                        {isSubmitting ? 'SECURED IN QUANTUM CORE...' : 'PURCHASE SECURE PASS'}
                      </button>

                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', margin: 0 }}>
                        ⚡ Powered by Eventify's Instant Mint. Non-refundable. Transmissible values only.
                      </p>
                    </form>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Cybernetic Guidelines & Terms Section */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">TERMS OF ENTRY</span>
            <h2>Guidelines for the <span className="gradient-text">Initiated</span></h2>
            <p>Read closely before arriving at the venue check-in coordinates.</p>
          </div>

          <div className="grid grid-3">
            <div className="feature-card">
              <span className="feature-icon">🛡️</span>
              <h3>No Re-entry Protocol</h3>
              <p>Once security scans your generated ticket, credentials become invalid. Exiting the digital threshold resets authorization parameters.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📸</span>
              <h3>Sensory Captures Allowed</h3>
              <p>Photography is fully permitted unless designated otherwise by the laser operators. Capture the kinetic waves, tag @Eventify.</p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">⚠️</span>
              <h3>High Intensity Disclaimer</h3>
              <p>Be advised that this production incorporates massive strobe lighting arrays, smoke emitters, and heavy dynamic acoustics throughout.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}