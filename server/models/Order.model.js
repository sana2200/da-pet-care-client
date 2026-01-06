const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Made optional for guest orders
  },
  isGuestOrder: {
    type: Boolean,
    default: false
  },
  guestInfo: {
    name: {
      type: String,
      required: function() { return this.isGuestOrder; }
    },
    email: {
      type: String,
      required: function() { return this.isGuestOrder; }
    },
    phone: {
      type: String,
      required: function() { return this.isGuestOrder; }
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    image: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String // Simple address string
    },
    street: {
      type: String
    },
    city: {
      type: String
    },
    state: String,
    postalCode: {
      type: String
    },
    country: {
      type: String,
      default: 'Bangladesh'
    }
  },
  billingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bkash', 'rocket', 'nagad', 'card', 'cash_on_delivery', 'online_payment', 'cod'],
    default: 'cash_on_delivery'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  transactionId: {
    type: String
  },
  trackingNumber: {
    type: String
  },
  notes: {
    type: String
  },
  adminNotes: {
    type: String
  },
  deliveryDate: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
