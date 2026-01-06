const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create email transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured. Email sending will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use App Password for Gmail
    }
  });
};

// Generate PDF for order
const generateOrderPDF = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      // Collect PDF data
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc
        .fontSize(24)
        .fillColor('#3b82f6')
        .text('Pet Care Order Invoice', { align: 'center' })
        .moveDown(0.5);

      doc
        .fontSize(10)
        .fillColor('#64748b')
        .text(`Order ID: ${order._id}`, { align: 'center' })
        .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`, { align: 'center' })
        .moveDown(2);

      // Customer Information
      doc
        .fontSize(14)
        .fillColor('#1e293b')
        .text('Customer Information', { underline: true })
        .moveDown(0.5);

      doc.fontSize(10).fillColor('#374151');
      
      if (order.isGuestOrder && order.guestInfo) {
        doc
          .text(`Name: ${order.guestInfo.name}`)
          .text(`Email: ${order.guestInfo.email}`)
          .text(`Phone: ${order.guestInfo.phone}`)
          .moveDown(0.5);
      } else if (order.user) {
        doc
          .text(`Name: ${order.user.name || 'N/A'}`)
          .text(`Email: ${order.user.email || 'N/A'}`)
          .text(`Phone: ${order.user.phone || 'N/A'}`)
          .moveDown(0.5);
      }

      // Shipping Address
      if (order.shippingAddress) {
        doc
          .fontSize(14)
          .fillColor('#1e293b')
          .text('Shipping Address', { underline: true })
          .moveDown(0.5)
          .fontSize(10)
          .fillColor('#374151')
          .text(`Name: ${order.shippingAddress.name || 'N/A'}`)
          .text(`Phone: ${order.shippingAddress.phone || 'N/A'}`)
          .text(`Address: ${order.shippingAddress.address || 'N/A'}`)
          .moveDown(1);
      }

      // Order Items
      doc
        .fontSize(14)
        .fillColor('#1e293b')
        .text('Order Items', { underline: true })
        .moveDown(0.5);

      // Table header
      const tableTop = doc.y;
      doc.fontSize(10).fillColor('#64748b');
      doc.text('Item', 50, tableTop, { width: 200 });
      doc.text('Qty', 280, tableTop, { width: 50 });
      doc.text('Price', 350, tableTop, { width: 80 });
      doc.text('Total', 450, tableTop, { width: 80 });

      // Draw line under header
      doc
        .moveTo(50, tableTop + 20)
        .lineTo(550, tableTop + 20)
        .stroke('#e5e7eb');

      // Table rows
      let position = tableTop + 30;
      doc.fontSize(9).fillColor('#374151');

      order.items.forEach((item) => {
        doc.text(item.name || 'Product', 50, position, { width: 200 });
        doc.text(item.quantity.toString(), 280, position, { width: 50 });
        doc.text(`৳${item.price.toFixed(2)}`, 350, position, { width: 80 });
        doc.text(`৳${item.subtotal.toFixed(2)}`, 450, position, { width: 80 });
        position += 25;
      });

      // Draw line before totals
      doc
        .moveTo(50, position + 10)
        .lineTo(550, position + 10)
        .stroke('#e5e7eb');

      position += 25;

      // Totals
      doc.fontSize(10).fillColor('#374151');
      doc.text('Subtotal:', 350, position, { width: 100 });
      doc.text(`৳${order.subtotal.toFixed(2)}`, 450, position, { width: 80 });
      position += 20;

      doc.text('Shipping:', 350, position, { width: 100 });
      doc.text(`৳${order.shippingCost.toFixed(2)}`, 450, position, { width: 80 });
      position += 20;

      if (order.tax > 0) {
        doc.text('Tax:', 350, position, { width: 100 });
        doc.text(`৳${order.tax.toFixed(2)}`, 450, position, { width: 80 });
        position += 20;
      }

      if (order.discount > 0) {
        doc.fillColor('#059669');
        doc.text('Discount:', 350, position, { width: 100 });
        doc.text(`-৳${order.discount.toFixed(2)}`, 450, position, { width: 80 });
        position += 20;
      }

      // Total
      doc.fontSize(12).fillColor('#1e293b').font('Helvetica-Bold');
      doc.text('Total Amount:', 350, position, { width: 100 });
      doc.fillColor('#059669').text(`৳${order.totalAmount.toFixed(2)}`, 450, position, { width: 80 });

      // Payment & Order Status
      position += 40;
      doc.fontSize(10).fillColor('#374151').font('Helvetica');
      doc.text(`Payment Method: ${order.paymentMethod.replace(/_/g, ' ').toUpperCase()}`, 50, position);
      position += 20;
      doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`, 50, position);
      position += 20;
      doc.text(`Order Status: ${order.status.toUpperCase()}`, 50, position);

      // Notes
      if (order.notes) {
        position += 30;
        doc
          .fontSize(12)
          .fillColor('#1e293b')
          .text('Order Notes:', 50, position)
          .fontSize(10)
          .fillColor('#374151')
          .text(order.notes, 50, position + 20, { width: 500 });
      }

      // Footer
      doc
        .fontSize(9)
        .fillColor('#94a3b8')
        .text(
          'Thank you for your order! For any queries, please contact us.',
          50,
          doc.page.height - 100,
          { align: 'center', width: 500 }
        );

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Send order email to superadmins
const sendOrderEmailToAdmins = async (order, superAdminEmails) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('Email not configured. Skipping email notification.');
      return { success: false, message: 'Email not configured' };
    }

    // Generate PDF
    const pdfBuffer = await generateOrderPDF(order);

    // Prepare email content
    const customerName = order.isGuestOrder && order.guestInfo 
      ? order.guestInfo.name 
      : (order.user?.name || 'Customer');

    const customerEmail = order.isGuestOrder && order.guestInfo 
      ? order.guestInfo.email 
      : (order.user?.email || 'N/A');

    const customerPhone = order.isGuestOrder && order.guestInfo 
      ? order.guestInfo.phone 
      : (order.user?.phone || 'N/A');

    const itemsList = order.items
      .map((item, index) => `${index + 1}. ${item.name} - Qty: ${item.quantity} - ৳${item.subtotal.toFixed(2)}`)
      .join('\n');

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
    .content { background: #f8fafc; padding: 30px; border-radius: 8px; margin-top: 20px; }
    .info-section { margin-bottom: 25px; }
    .info-title { font-weight: bold; color: #1e293b; font-size: 16px; margin-bottom: 10px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
    .info-item { margin: 8px 0; padding: 8px; background: white; border-radius: 4px; }
    .label { font-weight: 600; color: #64748b; }
    .value { color: #1e293b; }
    .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; background: white; border-radius: 8px; overflow: hidden; }
    .items-table th { background: #3b82f6; color: white; padding: 12px; text-align: left; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .total-section { background: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
    .grand-total { font-size: 18px; font-weight: bold; color: #059669; border-top: 2px solid #3b82f6; padding-top: 10px; margin-top: 10px; }
    .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🛒 New Order Received!</h1>
      <p style="margin: 10px 0 0 0;">Order #${order._id}</p>
    </div>

    <div class="content">
      <div class="alert">
        <strong>⚠️ Action Required:</strong> A new order has been placed. Please review and confirm with the customer.
      </div>

      <div class="info-section">
        <div class="info-title">📋 Order Details</div>
        <div class="info-item"><span class="label">Order ID:</span> <span class="value">${order._id}</span></div>
        <div class="info-item"><span class="label">Order Date:</span> <span class="value">${new Date(order.createdAt).toLocaleString()}</span></div>
        <div class="info-item"><span class="label">Payment Method:</span> <span class="value">${order.paymentMethod.replace(/_/g, ' ').toUpperCase()}</span></div>
        <div class="info-item"><span class="label">Order Status:</span> <span class="value">${order.status.toUpperCase()}</span></div>
      </div>

      <div class="info-section">
        <div class="info-title">👤 Customer Information</div>
        <div class="info-item"><span class="label">Name:</span> <span class="value">${customerName}</span></div>
        <div class="info-item"><span class="label">Email:</span> <span class="value">${customerEmail}</span></div>
        <div class="info-item"><span class="label">Phone:</span> <span class="value">${customerPhone}</span></div>
      </div>

      <div class="info-section">
        <div class="info-title">📍 Shipping Address</div>
        <div class="info-item">
          <div><span class="label">Name:</span> <span class="value">${order.shippingAddress?.name || 'N/A'}</span></div>
          <div><span class="label">Phone:</span> <span class="value">${order.shippingAddress?.phone || 'N/A'}</span></div>
          <div><span class="label">Address:</span> <span class="value">${order.shippingAddress?.address || 'N/A'}</span></div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-title">🛍️ Order Items</div>
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>৳${item.price.toFixed(2)}</td>
                <td>৳${item.subtotal.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="total-section">
        <div class="total-row">
          <span class="label">Subtotal:</span>
          <span class="value">৳${order.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span class="label">Shipping:</span>
          <span class="value">৳${order.shippingCost.toFixed(2)}</span>
        </div>
        ${order.tax > 0 ? `
        <div class="total-row">
          <span class="label">Tax:</span>
          <span class="value">৳${order.tax.toFixed(2)}</span>
        </div>
        ` : ''}
        ${order.discount > 0 ? `
        <div class="total-row">
          <span class="label">Discount:</span>
          <span class="value" style="color: #059669;">-৳${order.discount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="total-row grand-total">
          <span>Total Amount:</span>
          <span>৳${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      ${order.notes ? `
      <div class="info-section">
        <div class="info-title">📝 Order Notes</div>
        <div class="info-item">${order.notes}</div>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p>📎 Please find the detailed order invoice attached as PDF.</p>
      <p>This is an automated notification from Pet Care Admin System.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email to all superadmins
    const mailOptions = {
      from: `"Pet Care Admin" <${process.env.EMAIL_USER}>`,
      to: superAdminEmails.join(', '),
      subject: `🛒 New Order #${order._id} - ৳${order.totalAmount.toFixed(2)}`,
      html: emailContent,
      attachments: [
        {
          filename: `Order-${order._id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order email sent successfully:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send order email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOrderPDF,
  sendOrderEmailToAdmins
};
