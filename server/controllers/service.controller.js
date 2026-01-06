const Service = require('../models/Service.model');

// @desc    Get all services with filters and pagination
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      featured,
      sort = '-createdAt'
    } = req.query;

    // Build filter query
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    // Execute query with pagination
    const services = await Service.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-reviews');

    const count = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalServices: count,
        hasMore: page * limit < count
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get services',
      error: error.message
    });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('reviews.user', 'name profileImage');

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

// @desc    Create a new service
// @route   POST /api/services
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

// @desc    Update a service
// @route   PUT /api/services/:id
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

// @desc    Delete a service
// @route   DELETE /api/services/:id
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

// @desc    Add service review
// @route   POST /api/services/:id/reviews
// @access  Private
exports.addServiceReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = service.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Service already reviewed'
      });
    }

    // Add review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    service.reviews.push(review);
    service.numReviews = service.reviews.length;
    service.rating = service.reviews.reduce((acc, item) => item.rating + acc, 0) / service.reviews.length;

    await service.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

// @desc    Get service categories
// @route   GET /api/services/categories/all
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Service.distinct('category', { isActive: true });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message
    });
  }
};

// @desc    Get featured services
// @route   GET /api/services/featured/all
// @access  Public
exports.getFeaturedServices = async (req, res) => {
  try {
    const services = await Service.find({ featured: true, isActive: true })
      .limit(8)
      .select('-reviews');

    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get featured services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured services',
      error: error.message
    });
  }
};

// @desc    Check service availability for a date
// @route   GET /api/services/:id/availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Get bookings for that service and date
    const Booking = require('../models/Booking.model');
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const bookings = await Booking.find({
      service: req.params.id,
      bookingDate: {
        $gte: bookingDate,
        $lt: nextDay
      },
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    });

    // Calculate available slots
    const bookedSlots = bookings.map(b => b.timeSlot.startTime);
    const availableSlots = service.timeSlots.filter(
      slot => !bookedSlots.includes(slot.startTime)
    );

    res.status(200).json({
      success: true,
      data: {
        date,
        availableSlots,
        bookedSlots
      }
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: error.message
    });
  }
};
