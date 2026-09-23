const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required']
    },
    buyerName: {
      type: String,
      required: [true, 'Buyer name is required'],
      trim: true
    },
    buyerEmail: {
      type: String,
      required: [true, 'Buyer email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    seatsBooked: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [1, 'Must book at least 1 seat'],
      default: 1
    },
    totalPaid: {
      type: Number,
      required: [true, 'Total paid amount is required'],
      min: [0, 'Total paid cannot be negative']
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    qrCodeUrl: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Populate event details automatically when querying bookings
bookingSchema.pre(/^find/, function (next) {
  this.populate('event');
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);