const SSLCommerzPayment = require('sslcommerz-lts');
const Payment = require('../models/Payment.model');
const sslcommerzConfig = require('../config/sslcommerz.config');

// Initialize payment
exports.initPayment = async (req, res) => {
  try {
    const { amount, customerName, customerEmail, customerPhone, productName, userId } = req.body;

    // Validate required fields (userId can be 'guest' for guest checkout)
    if (!amount || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, customerName, customerEmail, customerPhone'
      });
    }

    // Generate unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const orderId = `ORD${Date.now()}`;

    // Create payment record in database
    const payment = new Payment({
      transactionId,
      orderId,
      userId: userId || 'guest',
      amount,
      currency: 'BDT',
      status: 'pending',
      customerInfo: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      },
      productInfo: {
        name: productName || sslcommerzConfig.product_name,
        category: sslcommerzConfig.product_category,
        profile: sslcommerzConfig.product_profile
      }
    });

    await payment.save();

    // Prepare SSLCommerz payment data
    const data = {
      total_amount: amount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: sslcommerzConfig.success_url,
      fail_url: sslcommerzConfig.fail_url,
      cancel_url: sslcommerzConfig.cancel_url,
      ipn_url: sslcommerzConfig.ipn_url,
      shipping_method: 'NO',
      product_name: productName || sslcommerzConfig.product_name,
      product_category: sslcommerzConfig.product_category,
      product_profile: sslcommerzConfig.product_profile,
      cus_name: customerName,
      cus_email: customerEmail,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: customerPhone,
      cus_fax: customerPhone,
      ship_name: customerName,
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
      multi_card_name: 'mastercard,visacard,amexcard,bkash,rocket,nagad'
    };

    // Initialize SSLCommerz
    const sslcz = new SSLCommerzPayment(
      sslcommerzConfig.store_id,
      sslcommerzConfig.store_passwd,
      sslcommerzConfig.is_live
    );

    // Initialize payment gateway
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      return res.status(200).json({
        success: true,
        message: 'Payment gateway initialized',
        data: {
          GatewayPageURL: apiResponse.GatewayPageURL,
          gatewayUrl: apiResponse.GatewayPageURL,
          transactionId,
          orderId
        }
      });
    } else {
      // Update payment status to failed
      payment.status = 'failed';
      payment.sslcommerzResponse = apiResponse;
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Failed to initialize payment gateway',
        error: apiResponse
      });
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment initialization failed',
      error: error.message
    });
  }
};

// Payment success callback
exports.paymentSuccess = async (req, res) => {
  try {
    const { tran_id, val_id } = req.body;

    if (!tran_id || !val_id) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
    }

    // Validate payment with SSLCommerz
    const sslcz = new SSLCommerzPayment(
      sslcommerzConfig.store_id,
      sslcommerzConfig.store_passwd,
      sslcommerzConfig.is_live
    );

    const validation = await sslcz.validate({ val_id });

    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      // Update payment in database
      const payment = await Payment.findOne({ transactionId: tran_id });

      if (payment) {
        payment.status = 'completed';
        payment.sslcommerzResponse = validation;
        payment.validatedAt = new Date();
        payment.completedAt = new Date();
        payment.paymentMethod = validation.card_type?.toLowerCase() || 'other';
        await payment.save();

        // Redirect to success page
        return res.redirect(`${process.env.FRONTEND_URL}/payment/success?txn=${tran_id}`);
      }
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
  } catch (error) {
    console.error('Payment success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
  }
};

// Payment fail callback
exports.paymentFail = async (req, res) => {
  try {
    const { tran_id } = req.body;

    if (tran_id) {
      // Update payment status to failed
      await Payment.findOneAndUpdate(
        { transactionId: tran_id },
        { 
          status: 'failed',
          sslcommerzResponse: req.body
        }
      );
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?txn=${tran_id}`);
  } catch (error) {
    console.error('Payment fail error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
  }
};

// Payment cancel callback
exports.paymentCancel = async (req, res) => {
  try {
    const { tran_id } = req.body;

    if (tran_id) {
      // Update payment status to cancelled
      await Payment.findOneAndUpdate(
        { transactionId: tran_id },
        { 
          status: 'cancelled',
          sslcommerzResponse: req.body
        }
      );
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment/cancelled?txn=${tran_id}`);
  } catch (error) {
    console.error('Payment cancel error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancelled`);
  }
};

// IPN (Instant Payment Notification) listener
exports.paymentIPN = async (req, res) => {
  try {
    const { tran_id, status } = req.body;

    if (tran_id) {
      const payment = await Payment.findOne({ transactionId: tran_id });

      if (payment) {
        if (status === 'VALID' || status === 'VALIDATED') {
          payment.status = 'completed';
          payment.completedAt = new Date();
        } else if (status === 'FAILED') {
          payment.status = 'failed';
        } else if (status === 'CANCELLED') {
          payment.status = 'cancelled';
        }

        payment.sslcommerzResponse = req.body;
        await payment.save();
      }
    }

    res.status(200).send('IPN processed');
  } catch (error) {
    console.error('IPN error:', error);
    res.status(500).send('IPN processing failed');
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: error.message
    });
  }
};

// Get user payments
exports.getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user payments',
      error: error.message
    });
  }
};
