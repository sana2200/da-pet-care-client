const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const { generateOrderPDF, sendOrderEmailToAdmins } = require('../utils/emailService');

// @desc    Create order
// @route   POST /api/orders
// @access  Public (supports both authenticated and guest orders)
exports.createOrder = async (req, res) => {
  console.log('✅ createOrder called - REAL ORDER PROCESSING');
  
  try {
    const { items, shippingAddress, paymentMethod, notes, guestInfo } = req.body;
    const user = req.user; // May be undefined for guest orders

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    console.log('📦 Processing order with', items.length, 'items');

    // Validate products and calculate totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product || item.id);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product not found: ${item.name || item.productId}` 
        });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        quantity: item.quantity,
        price: product.price,
        subtotal: itemSubtotal
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
      console.log(`📉 Reduced stock for ${product.name}: ${product.stock + item.quantity} → ${product.stock}`);
    }

    // Calculate totals (you can add shipping, tax, discount logic here)
    const shippingCost = 0; // Free shipping
    const tax = 0; // No tax for now
    const discount = 0;
    const totalAmount = subtotal + shippingCost + tax - discount;

    // Create order data
    const orderData = {
      items: validatedItems,
      shippingAddress,
      subtotal,
      tax,
      shippingCost,
      discount,
      totalAmount,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      notes,
      status: 'pending',
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending'
    };

    // Handle guest vs authenticated orders
    if (user) {
      orderData.user = user._id;
      orderData.isGuestOrder = false;
      console.log('👤 Creating order for authenticated user:', user.email);
    } else {
      orderData.isGuestOrder = true;
      orderData.guestInfo = guestInfo || {
        name: shippingAddress.name,
        email: guestInfo?.email || 'guest@example.com',
        phone: shippingAddress.phone
      };
      console.log('🎭 Creating guest order for:', orderData.guestInfo.name);
    }

    // Create the order
    const order = await Order.create(orderData);
    console.log('✅ Order created successfully:', order.orderNumber);

    // Populate the order for response
    await order.populate('items.product', 'name images');
    if (user) {
      await order.populate('user', 'name email phone');
    }

    // Send email notification to admins (non-blocking)
    try {
      await sendOrderEmailToAdmins(order);
      console.log('📧 Order email sent to admins');
    } catch (emailError) {
      console.error('⚠️ Email notification failed (non-critical):', emailError.message);
    }

    // Clear cart if user is authenticated
    if (user) {
      try {
        await Cart.findOneAndDelete({ user: user._id });
        console.log('🛒 Cart cleared for user');
      } catch (cartError) {
        console.error('⚠️ Cart cleanup failed (non-critical):', cartError.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order',
      error: error.message 
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { user: req.user._id };
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalOrders: count
      }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res) => {
  try {
    const { status, trackingNumber, adminNotes, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update payment status first if provided (takes priority)
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (status) {
      order.status = status;
      if (status === 'delivered') {
        order.deliveryDate = new Date();
        // Mark payment as paid when delivered (COD payment collected)
        // Only auto-update if payment status wasn't explicitly provided
        if (!paymentStatus && order.paymentStatus === 'pending') {
          order.paymentStatus = 'paid';
        }
      } else if (status === 'cancelled') {
        order.cancelledAt = new Date();
      }
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (adminNotes) {
      order.adminNotes = adminNotes;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${order.status} order`
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = cancellationReason;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const {
      status,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalOrders: count
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
};

// @desc    Download order PDF
// @route   GET /api/orders/:id/pdf
// @access  Private/Admin
exports.downloadOrderPDF = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Generate PDF
    const pdfBuffer = await generateOrderPDF(order);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Order-${order._id}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download order PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Delete the order
    await Order.findByIdAndDelete(req.params.id);

    console.log(`✅ Order ${order.orderNumber} deleted successfully by admin`);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
};
