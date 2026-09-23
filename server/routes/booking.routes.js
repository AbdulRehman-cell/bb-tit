const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');

// Inline Admin Authentication Middleware
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is missing.' });
    }

    // Handle 'Bearer <token>' or raw '<token>'
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    const secret = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired administrator token.' });
      }
      req.admin = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error processing authorization.' });
  }
};

// GET /api/bookings - Get all bookings (Public)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ bookingDate: -1 });
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch bookings.', details: error.message });
  }
});

// GET /api/bookings/:id - Get a single booking by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching the booking details.', details: error.message });
  }
});

// POST /api/bookings - Create a new booking (Protected)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { event, buyerName, buyerEmail, seatsBooked, totalPaid, qrCodeUrl } = req.body;

    // Simple validation
    if (!event || !buyerName || !buyerEmail || seatsBooked === undefined || totalPaid === undefined) {
      return res.status(400).json({ error: 'Missing required fields: event, buyerName, buyerEmail, seatsBooked, and totalPaid are required.' });
    }

    if (seatsBooked <= 0) {
      return res.status(400).json({ error: 'Seats booked must be a positive number.' });
    }

    // Generate mock QR Code URL if none provided
    const generatedQrCode = qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify({ event, buyerEmail, seatsBooked }))}`;

    const newBooking = new Booking({
      event,
      buyerName,
      buyerEmail,
      seatsBooked,
      totalPaid,
      bookingDate: req.body.bookingDate || new Date(),
      qrCodeUrl: generatedQrCode
    });

    const savedBooking = await newBooking.save();
    return res.status(201).json(savedBooking);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to create booking.', details: error.message });
  }
});

// PUT /api/bookings/:id - Update an existing booking (Protected)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { event, buyerName, buyerEmail, seatsBooked, totalPaid, qrCodeUrl, bookingDate } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Update fields if provided
    if (event !== undefined) booking.event = event;
    if (buyerName !== undefined) booking.buyerName = buyerName;
    if (buyerEmail !== undefined) booking.buyerEmail = buyerEmail;
    if (seatsBooked !== undefined) {
      if (seatsBooked <= 0) {
        return res.status(400).json({ error: 'Seats booked must be a positive number.' });
      }
      booking.seatsBooked = seatsBooked;
    }
    if (totalPaid !== undefined) booking.totalPaid = totalPaid;
    if (qrCodeUrl !== undefined) booking.qrCodeUrl = qrCodeUrl;
    if (bookingDate !== undefined) booking.bookingDate = bookingDate;

    const updatedBooking = await booking.save();
    return res.status(200).json(updatedBooking);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to update booking.', details: error.message });
  }
});

// DELETE /api/bookings/:id - Delete a booking (Protected)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    return res.status(200).json({ message: 'Booking deleted successfully.', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete booking.', details: error.message });
  }
});

module.exports = router;