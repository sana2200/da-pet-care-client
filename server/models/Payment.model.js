const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: String,
    required: false // Made optional since it may not exist yet
  },
  userId: {
    type: String, // Changed from ObjectId to String to support 'guest' users
    required: false // Made optional for guest payments
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'BDT'
  },
  paymentMethod: {
    type: String,
    enum: ['bkash', 'rocket', 'nagad', 'card', 'visa', 'mastercard', 'amex', 'other'],
    default: 'bkash'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    type: Object,
    default: {}
  },
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postcode: String,
    country: String
  },
  productInfo: {
    name: String,
    category: String,
    profile: String
  },
  sslcommerzResponse: {
    type: Object,
    default: {}
  },
  validatedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
