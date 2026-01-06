const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Service = require('../models/Service.model');
const Order = require('../models/Order.model');
const Booking = require('../models/Booking.model');
const Payment = require('../models/Payment.model');
const Settings = require('../models/Settings.model');
const admin = require('firebase-admin');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get counts
    const [
      totalUsers,
      totalProducts,
      totalServices,
      totalOrders,
      totalBookings,
      totalRevenue,
      customRevenue,
      recentOrders,
      recentBookings,
      topProducts
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: true }),
      Order.countDocuments(dateFilter),
      Booking.countDocuments(dateFilter),
      Order.aggregate([
        { $match: { status: 'delivered', paymentStatus: 'paid', ...dateFilter } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Settings.findOne({ key: 'totalRevenue' }),
      Order.find(dateFilter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
      Booking.find(dateFilter)
        .populate('user', 'name email')
        .populate('service', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Order.aggregate([
        { $match: { status: 'delivered', ...dateFilter } },
        { $unwind: '$items' },
        { $group: { 
          _id: '$items.product', 
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' }
        }},
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
      ])
    ]);

    // Order status breakdown
    const ordersByStatus = await Order.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Booking status breakdown
    const bookingsByStatus = await Booking.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Populate top products
    const populatedTopProducts = await Product.populate(topProducts, {
      path: '_id',
      select: 'name images price'
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalServices,
          totalOrders,
          totalBookings,
          // Use custom revenue only when no date filter is applied, otherwise use calculated revenue
          totalRevenue: (startDate || endDate) ? (totalRevenue[0]?.total || 0) : (customRevenue?.value || totalRevenue[0]?.total || 0)
        },
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentOrders,
        recentBookings,
        topProducts: populatedTopProducts
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalUsers: count
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's stats
    const [orders, bookings, totalSpent] = await Promise.all([
      Order.countDocuments({ user: req.params.id }),
      Booking.countDocuments({ user: req.params.id }),
      Order.aggregate([
        { $match: { user: user._id, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          totalOrders: orders,
          totalBookings: bookings,
          totalSpent: totalSpent[0]?.total || 0
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting admin users
    if (user.role === 'admin' || user.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin or superadmin users'
      });
    }

    // Delete from MongoDB
    await user.deleteOne();

    // Delete from Firebase Authentication
    try {
      if (user.firebaseUid) {
        await admin.auth().deleteUser(user.firebaseUid);
        console.log(`✅ Deleted Firebase user: ${user.firebaseUid}`);
      } else {
        // Try to find by email if firebaseUid is not stored
        try {
          const firebaseUser = await admin.auth().getUserByEmail(user.email);
          await admin.auth().deleteUser(firebaseUser.uid);
          console.log(`✅ Deleted Firebase user by email: ${user.email}`);
        } catch (fbError) {
          console.warn(`⚠️ Firebase user not found for email: ${user.email}`, fbError.message);
        }
      }
    } catch (firebaseError) {
      console.error('⚠️ Failed to delete Firebase user (non-critical):', firebaseError.message);
      // Continue even if Firebase deletion fails
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully from both MongoDB and Firebase'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// @desc    Update user role (Super Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/SuperAdmin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // Validate role
    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user, admin, or superadmin'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent changing own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated from ${oldRole} to ${role}`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
exports.getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const groupFormat = {
      day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      year: { $dateToString: { format: '%Y', date: '$createdAt' } }
    };

    const salesByDate = await Order.aggregate([
      { $match: { createdAt: dateFilter, paymentStatus: 'paid' } },
      { 
        $group: {
          _id: groupFormat[groupBy],
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: salesByDate
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sales analytics',
      error: error.message
    });
  }
};

// ==================== PRODUCTS ====================

// @desc    Get all products (admin view)
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .select('-reviews');

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: error.message
    });
  }
};

// @desc    Get single product (admin view)
// @route   GET /api/admin/products/:id
// @access  Private/Admin
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// @desc    Update product stock
// @route   PATCH /api/admin/products/:id/stock
// @access  Private/Admin
exports.updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || stock === null) {
      return res.status(400).json({
        success: false,
        message: 'Stock value is required'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        stock: parseInt(stock),
        inStock: parseInt(stock) > 0
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// ==================== SERVICES ====================

// @desc    Get all services (admin view)
// @route   GET /api/admin/services
// @access  Private/Admin
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({})
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get services',
      error: error.message
    });
  }
};

// @desc    Get single service (admin view)
// @route   GET /api/admin/services/:id
// @access  Private/Admin
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service',
      error: error.message
    });
  }
};

// @desc    Create new service
// @route   POST /api/admin/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

// @desc    Update total revenue
// @route   PUT /api/admin/settings/revenue
// @access  Private/Admin
exports.updateRevenue = async (req, res) => {
  try {
    const { totalRevenue } = req.body;
    
    console.log('📊 Update revenue request:', { totalRevenue, userId: req.user?._id });

    if (totalRevenue === undefined || totalRevenue < 0) {
      console.log('❌ Invalid revenue amount:', totalRevenue);
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid revenue amount'
      });
    }

    const settings = await Settings.findOneAndUpdate(
      { key: 'totalRevenue' },
      { 
        key: 'totalRevenue',
        value: totalRevenue,
        updatedBy: req.user._id,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    console.log('✅ Revenue updated successfully:', settings);

    res.status(200).json({
      success: true,
      message: 'Revenue updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('❌ Update revenue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update revenue',
      error: error.message
    });
  }
};
