const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Made optional for guest bookings
  },
  isGuestBooking: {
    type: Boolean,
    default: false
  },
  guestInfo: {
    name: {
      type: String,
      required: function() { return this.isGuestBooking; }
    },
    email: {
      type: String,
      required: function() { return this.isGuestBooking; }
    },
    phone: {
      type: String,
      required: function() { return this.isGuestBooking; }
    }
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  petDetails: {
    petName: {
      type: String,
      required: true
    },
    petType: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      required: true
    },
    breed: String,
    age: Number,
    weight: Number,
    specialInstructions: String
  },
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: String
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  notes: {
    type: String
  },
  adminNotes: {
    type: String
  },
  cancellationReason: {
    type: String
  },
  cancelledAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ service: 1, bookingDate: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
