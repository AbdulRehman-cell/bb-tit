const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');

// Admin Secret Key
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

// Inline Middleware for Admin Verification
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing. Access denied.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is missing. Access denied.' });
    }

    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired administrator token. Access denied.' });
  }
};

// GET all events (Public)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let sortOption = { date: 1 }; // Default chronological order
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'date-desc') {
      sortOption = { date: -1 };
    } else if (sort === 'scarcity') {
      // Custom sorting for seat scarcity will be handled by application logic if needed,
      // but here we sort by absolute remaining seats or defaults.
      sortOption = { date: 1 };
    }

    const events = await Event.find(query).sort(sortOption);
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Server error while fetching events.', error: error.message });
  }
});

// GET a single event by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    return res.status(200).json(event);
  } catch (error) {
    console.error(`Error fetching event with ID ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Server error while fetching event details.', error: error.message });
  }
});

// POST a new event (Admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, description, date, venue, category, price, totalSeats, bookedSeats, imageUrl } = req.body;

    // Simple validation
    if (!name || !date || !venue || !category || price === undefined || totalSeats === undefined) {
      return res.status(400).json({ message: 'Missing required fields: name, date, venue, category, price, and totalSeats are mandatory.' });
    }

    const newEvent = new Event({
      name,
      description: description || '',
      date,
      venue,
      category,
      price: Number(price),
      totalSeats: Number(totalSeats),
      bookedSeats: Number(bookedSeats) || 0,
      imageUrl: imageUrl || 'https://picsum.photos/seed/cyberdefault/800/600'
    });

    const savedEvent = await newEvent.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(400).json({ message: 'Validation failed or bad request data.', error: error.message });
  }
});

// PUT (update) an existing event (Admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, description, date, venue, category, price, totalSeats, bookedSeats, imageUrl } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Update fields conditionally if provided
    if (name !== undefined) event.name = name;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (venue !== undefined) event.venue = venue;
    if (category !== undefined) event.category = category;
    if (price !== undefined) event.price = Number(price);
    if (totalSeats !== undefined) event.totalSeats = Number(totalSeats);
    if (bookedSeats !== undefined) event.bookedSeats = Number(bookedSeats);
    if (imageUrl !== undefined) event.imageUrl = imageUrl;

    const updatedEvent = await event.save();
    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(`Error updating event with ID ${req.params.id}:`, error);
    return res.status(400).json({ message: 'Failed to update the event. Verify provided data.', error: error.message });
  }
});

// DELETE an event (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    return res.status(200).json({ message: 'Event deleted successfully.', event: deletedEvent });
  } catch (error) {
    console.error(`Error deleting event with ID ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Server error while deleting event.', error: error.message });
  }
});

module.exports = router;