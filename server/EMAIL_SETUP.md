# 📧 Email Setup Guide

## Overview

The Pet Care application now sends automated email notifications to superadmins when new orders are placed. Each email includes:

- Order details (customer info, items, totals)
- Professional HTML email template
- PDF invoice attachment

## Prerequisites

- Gmail account
- Google App Password (not your regular Gmail password)

## Setup Instructions

### Step 1: Create Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Select **Security** from the left sidebar
3. Under "Signing in to Google," select **2-Step Verification** (enable it if not already)
4. Scroll down and select **App passwords**
5. Select app: **Mail**
6. Select device: **Other (Custom name)**
7. Enter name: **Pet Care Server**
8. Click **Generate**
9. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

### Step 2: Configure Environment Variables

1. Open `server/.env` file
2. Update the following variables:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # Your app password from Step 1
```

**Important:** Use the App Password, NOT your regular Gmail password!

### Step 3: Restart Server

```bash
cd server
npm start
```

## Features

### Automated Order Notifications

When a customer places an order (either as guest or logged-in user):

1. Order is created in the database
2. System finds all active superadmins
3. Email is sent to all superadmin email addresses
4. Email includes:
   - Order summary
   - Customer information
   - Shipping address
   - Itemized order list
   - Total amount
   - PDF invoice attachment

### PDF Invoice

Each order generates a professional PDF invoice that includes:

- Order ID and date
- Customer details
- Shipping address
- Itemized products with quantities and prices
- Subtotal, shipping, tax, discount
- Total amount
- Payment method and status
- Order notes (if any)

### Admin Dashboard Integration

Superadmins can download order PDFs directly from the admin dashboard:

- Navigate to Orders section
- Click "Download PDF" button for any order
- PDF is generated on-the-fly and downloaded

## API Endpoints

### Download Order PDF

```
GET /api/orders/:id/pdf
Authorization: Bearer {token}
Access: Admin/SuperAdmin only
```

## Troubleshooting

### Email Not Sending

**Problem:** Emails are not being sent, but orders are created successfully.

**Solutions:**

1. Check console logs for email errors
2. Verify `EMAIL_USER` and `EMAIL_PASS` are set correctly in `.env`
3. Ensure App Password is correct (not regular password)
4. Check if Gmail account has 2-Step Verification enabled
5. Verify superadmin accounts have valid email addresses

### Gmail Security Block

**Problem:** Gmail blocks the connection.

**Solutions:**

1. Enable 2-Step Verification
2. Use App Password instead of regular password
3. Check "Less secure app access" is NOT needed (App Passwords are secure)

### No Superadmin Emails

**Problem:** Warning: "No superadmin emails found for order notification"

**Solution:**

1. Ensure at least one user has role 'superadmin'
2. Run: `node scripts/make-superadmin.js <email>`
3. Verify superadmin account has valid email address
4. Check database: `db.users.find({ role: 'superadmin' })`

### PDF Generation Fails

**Problem:** PDF download returns error.

**Solution:**

1. Check if `pdfkit` package is installed: `npm list pdfkit`
2. Reinstall if needed: `npm install pdfkit`
3. Check order exists in database
4. Verify order has all required fields

## Testing

### Test Email Configuration

```bash
# Method 1: Place a test order
# Go to the website and complete checkout

# Method 2: Use test script (create this file)
node scripts/test-email.js
```

### Create Test Script (Optional)

Create `server/scripts/test-email.js`:

```javascript
require("dotenv").config();
const { sendOrderEmailToAdmins } = require("../utils/emailService");

// Test email functionality
const testOrder = {
  _id: "TEST-ORDER-123",
  orderNumber: "ORD-TEST-001",
  isGuestOrder: true,
  guestInfo: {
    name: "Test Customer",
    email: "customer@test.com",
    phone: "01700000000",
  },
  items: [
    {
      name: "Test Product",
      quantity: 2,
      price: 500,
      subtotal: 1000,
    },
  ],
  shippingAddress: {
    name: "Test Customer",
    phone: "01700000000",
    address: "Test Address, Dhaka, Bangladesh",
  },
  subtotal: 1000,
  shippingCost: 100,
  tax: 0,
  discount: 0,
  totalAmount: 1100,
  paymentMethod: "cash_on_delivery",
  status: "pending",
  paymentStatus: "pending",
  createdAt: new Date(),
};

const testEmails = ["your-test-email@gmail.com"]; // Replace with your email

sendOrderEmailToAdmins(testOrder, testEmails)
  .then((result) => {
    console.log("Test email result:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test email error:", error);
    process.exit(1);
  });
```

Run test:

```bash
node scripts/test-email.js
```

## Email Template Preview

The email includes:

- 🛒 New Order Received header (blue gradient)
- ⚠️ Action Required alert box
- 📋 Order Details section
- 👤 Customer Information section
- 📍 Shipping Address section
- 🛍️ Order Items table
- Total breakdown with shipping, tax, discount
- 📝 Order Notes (if provided)
- 📎 PDF attachment notice

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use App Passwords** instead of regular passwords
3. **Keep `EMAIL_PASS` secret** - don't share it
4. **Rotate App Passwords** periodically
5. **Monitor email sending logs** for suspicious activity
6. **Use environment variables** in production (Heroku, Vercel, etc.)

## Production Deployment

When deploying to production:

1. **Set environment variables** in your hosting platform:

   - Heroku: `heroku config:set EMAIL_USER=...`
   - Vercel: Add in project settings → Environment Variables
   - AWS/DigitalOcean: Add to `.env` file on server

2. **Use a dedicated email** for notifications:

   - Create: `noreply@yourpetcare.com` or similar
   - Set up email forwarding to superadmins
   - Or use transactional email service (SendGrid, Mailgun, AWS SES)

3. **Consider email service limits**:
   - Gmail: 500 emails/day for free accounts
   - For high volume, use services like SendGrid, AWS SES

## Alternative Email Providers

### SendGrid

```javascript
// Update emailService.js
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

### AWS SES

```javascript
const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: "us-east-1" });
```

### Mailgun

```javascript
const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});
```

## Support

For issues or questions:

1. Check server logs: `tail -f server/logs/app.log`
2. Test email configuration manually
3. Verify superadmin accounts exist
4. Check Gmail App Password is correct
5. Review error messages in console

---

**Last Updated:** January 5, 2026  
**Version:** 1.0.0
