require('dotenv').config();

const sslcommerzConfig = {
  store_id: process.env.SSLCOMMERZ_STORE_ID,
  store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
  is_live: process.env.NODE_ENV === 'production', // true for live, false for sandbox
  
  // Payment gateway URLs
  success_url: `${process.env.BASE_URL}/api/payment/success`,
  fail_url: `${process.env.BASE_URL}/api/payment/fail`,
  cancel_url: `${process.env.BASE_URL}/api/payment/cancel`,
  ipn_url: `${process.env.BASE_URL}/api/payment/ipn`,
  
  // API URLs
  init_url: process.env.NODE_ENV === 'production' 
    ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
    : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
  
  validation_url: process.env.NODE_ENV === 'production'
    ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
    : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php',
    
  // Default settings
  currency: 'BDT',
  product_name: 'Pet Care Service',
  product_category: 'Service',
  product_profile: 'general',
  
  // Shipping method
  shipping_method: 'NO',
  num_of_item: 1,
  
  // EMI Options
  emi_option: 0,
  
  // Multi-card options
  multi_card_name: 'mastercard,visacard,amexcard,bkash,rocket,nagad'
};

module.exports = sslcommerzConfig;
