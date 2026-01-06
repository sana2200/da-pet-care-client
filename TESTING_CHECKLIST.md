# ✅ Testing Checklist: Order Management Features

## Pre-Testing Setup

### 1. Email Configuration

- [ ] Open `server/.env`
- [ ] Set `EMAIL_USER` to your Gmail address
- [ ] Set `EMAIL_PASS` to your Gmail App Password (16 characters)
- [ ] Restart server: `cd server && npm start`

### 2. Create SuperAdmin Account

```bash
cd server
node scripts/make-superadmin.js your-email@gmail.com
```

- [ ] Script runs successfully
- [ ] Confirms user is now superadmin

### 3. Verify Servers Running

- [ ] Backend: http://localhost:5000
- [ ] Frontend: http://localhost:5174
- [ ] No console errors

## Test 1: Online Payment "Coming Soon" Feature

**Steps:**

1. [ ] Go to shop page
2. [ ] Add products to cart
3. [ ] Go to checkout
4. [ ] See both payment options:
   - Cash on Delivery
   - Online Payment (with "COMING SOON" badge)
5. [ ] Click on "Online Payment" radio button
6. [ ] Notification appears: "Online payment is coming soon!"
7. [ ] Payment method stays as "Cash on Delivery"

**Expected Result:** ✅ Can see online payment but cannot select it, friendly message shown

---

## Test 2: Cash on Delivery - Guest Checkout

**Steps:**

1. [ ] Clear all form fields
2. [ ] Try submitting empty form
3. [ ] See validation error: "Please enter your full name"
4. [ ] Fill in name
5. [ ] Try submitting
6. [ ] See validation error: "Please enter your phone number"
7. [ ] Fill in phone
8. [ ] Try submitting
9. [ ] See validation error: "Please enter your delivery address"
10. [ ] Fill in all fields:
    - Name: Test Customer
    - Phone: 01700000000
    - Address: Dhaka, Bangladesh
    - Notes: This is a test order
11. [ ] Ensure "Cash on Delivery" is selected
12. [ ] Click "Place Order"
13. [ ] Loading spinner appears
14. [ ] Success message appears
15. [ ] Redirects to home page

**Expected Result:** ✅ Order created successfully

---

## Test 3: Email Notification to SuperAdmin

**After completing Test 2:**

1. [ ] Check superadmin email inbox
2. [ ] Email received with subject: "🛒 New Order #[ORDER_ID] - ৳[AMOUNT]"
3. [ ] Email contains:
   - [ ] Order ID
   - [ ] Order date and time
   - [ ] Customer name: Test Customer
   - [ ] Customer phone: 01700000000
   - [ ] Shipping address: Dhaka, Bangladesh
   - [ ] List of ordered items
   - [ ] Quantities and prices
   - [ ] Subtotal
   - [ ] Shipping cost
   - [ ] Total amount
   - [ ] Payment method: CASH ON DELIVERY
   - [ ] Order notes: This is a test order
4. [ ] PDF attachment present
5. [ ] PDF filename: Order-[ORDER_ID].pdf

**Expected Result:** ✅ Professional email received with all details and PDF attachment

---

## Test 4: PDF Invoice Quality

**Open the PDF attachment from Test 3:**

1. [ ] PDF opens successfully
2. [ ] Header shows: "Pet Care Order Invoice"
3. [ ] Order ID visible
4. [ ] Order date formatted correctly
5. [ ] Customer Information section:
   - [ ] Name
   - [ ] Email
   - [ ] Phone
6. [ ] Shipping Address section:
   - [ ] Name
   - [ ] Phone
   - [ ] Address
7. [ ] Order Items table:
   - [ ] Column headers: Item, Qty, Price, Total
   - [ ] All items listed
   - [ ] Quantities correct
   - [ ] Prices correct
   - [ ] Subtotals calculated correctly
8. [ ] Totals section:
   - [ ] Subtotal
   - [ ] Shipping
   - [ ] Tax (if applicable)
   - [ ] Discount (if applicable)
   - [ ] Grand Total (in green)
9. [ ] Payment information:
   - [ ] Payment Method
   - [ ] Payment Status
   - [ ] Order Status
10. [ ] Order Notes section (if notes provided)
11. [ ] Footer with thank you message

**Expected Result:** ✅ Professional, complete, and accurate PDF invoice

---

## Test 5: Logged-In User Checkout

**Steps:**

1. [ ] Login to website with user account
2. [ ] Add products to cart
3. [ ] Go to checkout
4. [ ] Form pre-filled with user profile data
5. [ ] Update address if needed
6. [ ] Add order notes: "Logged in user test order"
7. [ ] Click "Place Order"
8. [ ] Order created successfully
9. [ ] Redirects to order details page (not home)
10. [ ] Cart is automatically cleared

**Expected Result:** ✅ Order created, cart cleared, redirected to order page

---

## Test 6: Email for Logged-In User Order

**After completing Test 5:**

1. [ ] Check superadmin email
2. [ ] New email received
3. [ ] Email shows user's name (not "Guest")
4. [ ] Email shows user's email address
5. [ ] All order details present
6. [ ] PDF attachment included

**Expected Result:** ✅ Email includes user account information

---

## Test 7: Multiple SuperAdmins

**Setup:**

1. [ ] Create second superadmin:

```bash
node scripts/make-superadmin.js second-admin@example.com
```

**Test:**

1. [ ] Place a new order
2. [ ] Check first superadmin email - received
3. [ ] Check second superadmin email - received
4. [ ] Both emails identical
5. [ ] Both have PDF attachments

**Expected Result:** ✅ All superadmins receive order notifications

---

## Test 8: Admin Dashboard - PDF Download

**Steps:**

1. [ ] Login as superadmin
2. [ ] Go to admin dashboard
3. [ ] Navigate to Orders section (if available)
4. [ ] Find any existing order
5. [ ] Look for "Download PDF" button
6. [ ] Click button
7. [ ] PDF downloads automatically
8. [ ] Open downloaded PDF
9. [ ] Verify all information is correct

**Expected Result:** ✅ Can download order PDFs from admin panel

**Note:** If Orders tab doesn't have download button yet, test via API:

```bash
# Get your auth token from browser DevTools → Application → Local Storage
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/orders/ORDER_ID/pdf \
  --output test-order.pdf
```

---

## Test 9: Stock Management

**Steps:**

1. [ ] Note current stock of a product
2. [ ] Place order with that product (qty: 2)
3. [ ] Go to admin dashboard
4. [ ] Check product stock
5. [ ] Stock decreased by 2

**Expected Result:** ✅ Stock automatically decremented

---

## Test 10: Order Validation Edge Cases

### Test 10a: Special Characters

1. [ ] Fill name: "O'Brien-Smith"
2. [ ] Fill address with comma and apostrophe
3. [ ] Submit order
4. [ ] Order created successfully

### Test 10b: Long Address

1. [ ] Fill very long address (200+ characters)
2. [ ] Submit order
3. [ ] Order created successfully
4. [ ] PDF shows full address

### Test 10c: Unicode Characters

1. [ ] Fill name with Bengali characters: "মোঃ রহিম"
2. [ ] Submit order
3. [ ] Order created successfully
4. [ ] Email shows name correctly

**Expected Result:** ✅ Handles special cases gracefully

---

## Test 11: Error Handling

### Test 11a: Email Not Configured

1. [ ] Remove `EMAIL_USER` from `.env`
2. [ ] Restart server
3. [ ] Place order
4. [ ] Order still created successfully
5. [ ] Console shows: "Email not configured. Skipping email notification."
6. [ ] No error thrown

### Test 11b: Invalid Email Address

1. [ ] Set `EMAIL_USER` to invalid email
2. [ ] Restart server
3. [ ] Place order
4. [ ] Order created
5. [ ] Email fails gracefully
6. [ ] Console shows error

**Expected Result:** ✅ Order creation never fails due to email issues

---

## Test 12: Order Notes

**Steps:**

1. [ ] Place order with notes: "Please call before delivery"
2. [ ] Check email
3. [ ] Notes section visible
4. [ ] Notes text matches
5. [ ] Check PDF
6. [ ] Notes section present in PDF

**Expected Result:** ✅ Notes captured and displayed everywhere

---

## Test 13: Browser Console Check

**During entire testing:**

1. [ ] No JavaScript errors
2. [ ] No React warnings
3. [ ] No network errors (4xx, 5xx)
4. [ ] All API calls successful

---

## Test 14: Mobile Responsiveness

**Steps:**

1. [ ] Open site on mobile device or use Chrome DevTools mobile view
2. [ ] Navigate to checkout
3. [ ] Both payment options visible and properly formatted
4. [ ] "COMING SOON" badge visible
5. [ ] Form fields stack vertically
6. [ ] Can complete order on mobile

**Expected Result:** ✅ Works perfectly on mobile

---

## Test 15: Server Logs

**Check server console for:**

1. [ ] Order creation logs
2. [ ] Email sending logs: "✅ Order notification sent to X superadmin(s)"
3. [ ] No error messages
4. [ ] PDF generation successful

---

## Post-Testing Verification

### Database Check

```bash
# Connect to MongoDB and check
db.orders.find().sort({createdAt: -1}).limit(5).pretty()
```

Verify:

- [ ] Orders have all fields
- [ ] `paymentMethod` is "cash_on_delivery"
- [ ] `notes` field populated
- [ ] `shippingAddress.address` has full address string
- [ ] Stock decremented in products collection

### Email Inbox Check

- [ ] All test emails received
- [ ] No emails marked as spam
- [ ] PDFs not corrupted
- [ ] Formatting looks good

---

## Known Issues to Watch For

⚠️ **Common Problems:**

1. **Email not sending:**

   - Check `EMAIL_USER` and `EMAIL_PASS` in `.env`
   - Verify App Password (not regular password)
   - Check Gmail 2-Step Verification enabled

2. **PDF not generating:**

   - Check `pdfkit` is installed: `npm list pdfkit`
   - Check order has all required fields

3. **No superadmin emails:**

   - Run: `node scripts/make-superadmin.js email@example.com`
   - Verify in database: users with role 'superadmin'

4. **Online payment still selectable:**
   - Clear browser cache
   - Check `handleInputChange` function updated

---

## Success Criteria

✅ **All tests passed if:**

- Online payment shows "coming soon" but doesn't work
- Cash on delivery works perfectly
- All order information validated
- Emails sent to all superadmins
- PDFs generated correctly
- Stock automatically updated
- No errors in console
- Mobile responsive

---

## Final Checklist

- [ ] All 15 tests completed
- [ ] Email configuration working
- [ ] PDF generation working
- [ ] Order validation working
- [ ] Stock management working
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Documentation reviewed
- [ ] Ready for production

---

**Testing Date:** ******\_******  
**Tested By:** ******\_******  
**Result:** ⬜ PASS ⬜ FAIL  
**Notes:** **********************\_**********************

---

## Quick Test (5 minutes)

If you want a quick smoke test:

1. [ ] Set up email in `.env`
2. [ ] Restart server
3. [ ] Make yourself superadmin
4. [ ] Place one test order
5. [ ] Check your email
6. [ ] Open PDF attachment
7. [ ] Verify everything looks good

If that works, all features are functioning! ✅
