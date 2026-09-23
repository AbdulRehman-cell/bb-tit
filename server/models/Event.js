const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Event date and time are required']
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      trim: true,
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats capacity is required'],
      min: [1, 'Total seats must be at least 1']
    },
    bookedSeats: {
      type: Number,
      required: true,
      min: [0, 'Booked seats cannot be negative'],
      default: 0
    },
    imageUrl: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for getting remaining seats left
eventSchema.virtual('remainingSeats').get(function () {
  const remaining = this.totalSeats - this.bookedSeats;
  return remaining < 0 ? 0 : remaining;
});

// Virtual for calculating scarcity status (e.g., sold out, low stock, or available)
eventSchema.virtual('scarcityStatus').get(function () {
  const remaining = this.totalSeats - this.bookedSeats;
  if (remaining <= 0) {
    return 'SOLD_OUT';
  }
  if (remaining <= this.totalSeats * 0.15) {
    return 'CRITICAL_LOW'; // Under 15% remaining
  }
  if (remaining <= this.totalSeats * 0.35) {
    return 'FEW_LEFT'; // Under 35% remaining
  }
  return 'AVAILABLE';
});

module.exports = mongoose.model('Event', eventSchema);