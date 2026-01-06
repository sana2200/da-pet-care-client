# Booking Form Auto-Fill - User Guide

## How It Works

### 📋 For Logged-In Users

#### Step 1: Browse Services

Navigate to the Services page to see all available pet care services.

#### Step 2: Select a Service

Click on any service card (the entire card is clickable now!) to go to the booking form.

- The card will lift slightly on hover for visual feedback
- The selected service will be automatically filled in the booking form

#### Step 3: Check Auto-Filled Information

When the booking form opens, you'll see:

- ✅ **Service**: Already selected (the one you clicked)
- ✅ **Your Name**: Automatically filled from your profile
- ✅ **Phone**: Automatically filled from your profile
- ✅ **Email**: Automatically filled from your profile

#### Step 4: Complete Pet Details

Just fill in the remaining fields:

- Date & Time of appointment
- Pet Name, Type, Age
- Any special notes

#### Step 5: Submit

Click "Submit Booking" and you're done!

---

### 🌐 For Guest Users (Not Logged In)

#### Step 1: Browse Services

Navigate to the Services page to see all available services.

#### Step 2: Select a Service

Click on any service card to go to the booking form.

- The selected service will be automatically filled

#### Step 3: Fill Your Information

Since you're not logged in, you'll need to manually enter:

- Your Name
- Phone Number
- Email Address

#### Step 4: Complete Pet Details

Fill in:

- Date & Time of appointment
- Pet Name, Type, Age
- Any special notes

#### Step 5: Submit

Click "Submit Booking" - you don't need an account to book!

---

## 🎯 Quick Booking Option

On the Services page, each service card has a **"Quick Book"** button:

- Click this for a simplified modal booking form
- Or click anywhere else on the card for the full booking form with auto-fill

---

## 💡 Pro Tips

1. **Save Time**: Log in before booking to have your info auto-filled
2. **Edit If Needed**: Auto-filled information can still be edited if you want to use different contact details
3. **No Account Required**: You can still book services as a guest
4. **Direct Access**: You can also go directly to `/book` to access the booking form

---

## 🔧 Technical Details

### What Gets Auto-Filled?

- **Service Name**: From the service card you clicked
- **Your Name**: From your user profile in the database
- **Phone Number**: From your user profile
- **Email Address**: From your user profile

### Fallback Mechanism

If your profile data is not complete:

- Name will use your Firebase display name
- Email will use your Firebase email
- Phone will remain empty for manual entry

### Privacy & Security

- Your data is fetched securely using JWT authentication
- Only you can see your own profile data
- Guest bookings don't require any account creation

---

## 📱 Works Everywhere

This auto-fill feature works on:

- Desktop browsers
- Mobile browsers
- Tablets
- Any device with internet access

---

## Need Help?

If you experience any issues with auto-fill:

1. Make sure you're logged in to see your information auto-filled
2. Check that your profile has your name, phone, and email saved
3. Try refreshing the page
4. Contact support if the problem persists
