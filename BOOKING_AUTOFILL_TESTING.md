# Testing Guide: Booking Form Auto-Fill

## Test Scenarios

### Test 1: Logged-In User - Service Card Click

**Prerequisites:**

- User is logged in
- User has profile data (name, phone, email) in database

**Steps:**

1. Navigate to `/services`
2. Hover over a service card - verify hover effect (card lifts, shadow increases)
3. Click anywhere on a service card (e.g., "Pet Grooming")
4. Verify redirect to `/book?service=Pet%20Grooming`
5. Verify booking form shows:
   - Service dropdown: "Pet Grooming" selected
   - Name field: Auto-filled with user's name
   - Phone field: Auto-filled with user's phone
   - Email field: Auto-filled with user's email
6. Verify other fields are empty (date, time, pet info)

**Expected Result:** ✅ Service and user data auto-filled correctly

---

### Test 2: Guest User - Service Card Click

**Prerequisites:**

- User is NOT logged in

**Steps:**

1. Navigate to `/services`
2. Click on a service card
3. Verify redirect to `/book?service=[ServiceName]`
4. Verify booking form shows:
   - Service dropdown: Selected service pre-filled
   - Name field: Empty
   - Phone field: Empty
   - Email field: Empty

**Expected Result:** ✅ Only service auto-filled, user fields empty for manual entry

---

### Test 3: Logged-In User - Direct Form Access

**Prerequisites:**

- User is logged in

**Steps:**

1. Navigate directly to `/book`
2. Verify booking form shows:
   - Service dropdown: Not pre-selected (shows placeholder)
   - Name field: Auto-filled
   - Phone field: Auto-filled
   - Email field: Auto-filled

**Expected Result:** ✅ User data auto-filled, service requires manual selection

---

### Test 4: Service Auto-Fill with Special Characters

**Prerequisites:**

- Service with special characters exists (e.g., "Pet Grooming & Spa")

**Steps:**

1. Navigate to `/services`
2. Click on service with special characters
3. Verify URL encoding: `/book?service=Pet%20Grooming%20%26%20Spa`
4. Verify service correctly matched and selected

**Expected Result:** ✅ Special characters handled correctly

---

### Test 5: User Profile Incomplete

**Prerequisites:**

- User is logged in
- User profile missing some fields (e.g., phone is null)

**Steps:**

1. Navigate to `/book`
2. Verify:
   - Name: Auto-filled if exists in profile
   - Email: Auto-filled if exists in profile
   - Phone: Empty if missing in profile

**Expected Result:** ✅ Only available fields auto-filled, missing fields remain empty

---

### Test 6: Firebase Fallback

**Prerequisites:**

- User is logged in
- User profile fetch fails (API error)
- Firebase user has displayName and email

**Steps:**

1. Simulate API failure (disconnect backend or use network throttling)
2. Navigate to `/book`
3. Check browser console for warning: "Could not fetch user profile"
4. Verify:
   - Name: Falls back to Firebase displayName
   - Email: Falls back to Firebase email
   - Phone: Empty (no Firebase fallback available)

**Expected Result:** ✅ Firebase data used as fallback

---

### Test 7: Quick Book Modal

**Prerequisites:**

- User on Services page

**Steps:**

1. Navigate to `/services`
2. Click "Quick Book" button on a service card
3. Verify modal opens (does NOT navigate)
4. Verify modal shows quick booking form
5. Close modal
6. Click anywhere else on the card (not the button)
7. Verify navigation to full booking form

**Expected Result:** ✅ Quick Book button opens modal, card click navigates to form

---

### Test 8: Service List Loading

**Prerequisites:**

- Backend is running

**Steps:**

1. Navigate to `/book`
2. Open browser DevTools Network tab
3. Check for API call: `GET /services`
4. Verify services populate in dropdown
5. Check if pre-selected service (from URL) is correctly matched

**Expected Result:** ✅ Services load successfully and match URL parameter

---

### Test 9: Edit Auto-Filled Data

**Prerequisites:**

- User is logged in with complete profile

**Steps:**

1. Navigate to `/book?service=Pet%20Grooming`
2. Verify all fields auto-filled
3. Manually change Name, Phone, Email values
4. Fill remaining fields and submit
5. Verify booking created with modified values (not original profile data)

**Expected Result:** ✅ Users can override auto-filled data

---

### Test 10: Multiple Service Navigation

**Prerequisites:**

- Multiple services available

**Steps:**

1. Navigate to `/book?service=Pet%20Grooming`
2. Verify "Pet Grooming" selected
3. Navigate back to `/services`
4. Click different service (e.g., "Veterinary Care")
5. Verify "Veterinary Care" now selected
6. Verify user data still auto-filled

**Expected Result:** ✅ Service changes correctly, user data persists

---

## Console Debugging

Open browser console (F12) and check for:

### Success Messages:

```
Services list loaded successfully
User profile fetched and auto-filled
```

### Warning Messages (Expected in Some Cases):

```
Could not fetch user profile: [error]
Failed to load services list; using fallback
```

### Error Messages (Should NOT Appear):

```
TypeError: Cannot read property 'name' of undefined
Uncaught ReferenceError: [variable] is not defined
```

---

## API Endpoints to Test

### 1. Get User Profile

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/users/profile
```

Expected Response:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

### 2. Get All Services

```bash
curl http://localhost:5000/services
```

Expected Response:

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Pet Grooming",
    "description": "Professional grooming...",
    "price": 1500,
    "duration": 60,
    "category": "grooming"
  }
]
```

### 3. Create Booking

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "serviceId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "date": "2024-02-15",
    "time": "10:00",
    "petName": "Buddy",
    "petType": "dog",
    "petAge": "3"
  }' \
  http://localhost:5000/bookings
```

---

## Browser Testing

Test on:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if available)
- ✅ Mobile Chrome (Android)
- ✅ Mobile Safari (iOS)

---

## Performance Checks

1. **Page Load Time**: Book page should load within 2 seconds
2. **API Response Time**: User profile fetch should complete within 500ms
3. **Auto-Fill Speed**: Form fields should populate immediately after profile fetch
4. **No Flickering**: Auto-fill should not cause visible field updates/flickering

---

## Accessibility Testing

1. **Keyboard Navigation**:

   - Tab through service cards
   - Press Enter/Space on focused card to navigate

2. **Screen Reader**:

   - Service cards should announce as "button"
   - Auto-filled fields should announce their values

3. **Form Labels**:
   - All form fields should have proper labels
   - Auto-filled fields should indicate their status

---

## Common Issues & Solutions

### Issue: User data not auto-filling

**Solution:**

- Check if user is logged in (useAuthState returns valid user)
- Verify `/users/profile` endpoint returns data
- Check browser console for errors

### Issue: Service not pre-selected from URL

**Solution:**

- Verify URL parameter format: `?service=ServiceName`
- Check URL encoding for special characters
- Ensure service name matches database exactly (case-insensitive)

### Issue: API calls failing

**Solution:**

- Verify backend server is running
- Check CORS configuration
- Verify JWT token is valid

---

## Regression Testing

After any code changes, re-run:

1. Test 1 (basic auto-fill)
2. Test 7 (Quick Book vs Full Form)
3. Test 9 (edit auto-filled data)

These cover the most critical user paths.
