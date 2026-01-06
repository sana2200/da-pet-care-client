const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const serviceAccount = require('../serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
  }
}

// Protect routes (JWT or Firebase)
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    console.log('🔑 Token received, length:', token.length);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ JWT token verified');
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        console.log('❌ User not found with JWT');
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      if (!user.isActive) {
        console.log('❌ User account deactivated');
        return res.status(403).json({ success: false, message: 'Account deactivated' });
      }

      req.user = user;
      console.log('✅ JWT auth successful for user:', user.email);
      return next();
    } catch (jwtError) {
      console.log('⚠️ JWT verification failed, trying Firebase...');
      console.log('JWT Error:', jwtError.message);
      
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('✅ Firebase token verified for:', decodedToken.email);
        let user = await User.findOne({ firebaseUid: decodedToken.uid });

        if (!user) {
          // Check if user exists with this email but different/no firebaseUid
          user = await User.findOne({ email: decodedToken.email });
          
          if (user) {
            // User exists with same email - update their firebaseUid
            console.log('📝 Updating existing user with Firebase UID');
            try {
              user.firebaseUid = decodedToken.uid;
              user.isEmailVerified = decodedToken.email_verified || user.isEmailVerified;
              user.authProvider = 'firebase';
              if (decodedToken.picture && !user.profileImage) {
                user.profileImage = decodedToken.picture;
              }
              await user.save();
              console.log('✅ User updated with Firebase UID:', user.email);
            } catch (saveError) {
              // If save fails due to duplicate, just fetch the user again
              if (saveError.code === 11000) {
                console.log('⚠️ Duplicate key during save, re-fetching user');
                user = await User.findOne({ $or: [{ email: decodedToken.email }, { firebaseUid: decodedToken.uid }] });
                if (!user) {
                  console.error('❌ Could not fetch user after duplicate key error');
                  return res.status(401).json({ success: false, message: 'Authentication failed' });
                }
              } else {
                console.error('❌ Error saving user:', saveError.message);
                return res.status(500).json({ success: false, message: 'Server error during authentication' });
              }
            }
          } else {
            // No user exists - create new one
            console.log('📝 Creating new user from Firebase token');
            try {
              user = await User.create({
                firebaseUid: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name || decodedToken.email.split('@')[0],
                isEmailVerified: decodedToken.email_verified || false,
                authProvider: 'firebase',
                profileImage: decodedToken.picture,
              });
              console.log('✅ New user created:', user.email);
            } catch (createError) {
              // If create fails due to duplicate, fetch existing user
              if (createError.code === 11000) {
                console.log('⚠️ User already exists, fetching existing user');
                user = await User.findOne({ $or: [{ email: decodedToken.email }, { firebaseUid: decodedToken.uid }] });
                if (!user) {
                  console.error('❌ Could not fetch user after duplicate key error');
                  return res.status(401).json({ success: false, message: 'Authentication failed' });
                }
              } else {
                console.error('❌ Error creating user:', createError.message);
                return res.status(500).json({ success: false, message: 'Server error during user creation' });
              }
            }
          }
        }

        if (!user) {
          console.log('❌ User not found after authentication attempts');
          return res.status(401).json({ success: false, message: 'User authentication failed' });
        }

        if (!user.isActive) {
          console.log('❌ User account deactivated');
          return res.status(403).json({ success: false, message: 'Account deactivated' });
        }

        req.user = user;
        console.log('✅ Firebase auth successful for user:', user.email);
        return next();
      } catch (firebaseError) {
        // Only log and return error if it's not a duplicate key error
        if (firebaseError.code === 11000) {
          console.error('❌ Unexpected duplicate key error:', firebaseError.message);
          return res.status(500).json({ success: false, message: 'Authentication error - please contact support' });
        }
        console.error('❌ Firebase token verification failed:', firebaseError.message);
        console.error('Firebase error code:', firebaseError.code);
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
    }
  } catch (error) {
    console.error('❌ Auth error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin only
exports.adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
};

// Superadmin only
exports.superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') return next();
  return res.status(403).json({ success: false, message: 'Access denied. Superadmin only.' });
};

// Optional auth (doesn't fail if no token)
exports.optionalAuth = async (req, res, next) => {
  console.log('optionalAuth start');
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        console.log('optionalAuth: JWT user set', req.user?._id?.toString());
      } catch (jwtErr) {
        console.log('optionalAuth: JWT failed, trying Firebase', jwtErr && jwtErr.message);
        try {
          const decodedToken = await admin.auth().verifyIdToken(token);
          req.user = await User.findOne({ firebaseUid: decodedToken.uid });
          console.log('optionalAuth: Firebase user set', req.user?._id?.toString());
        } catch (firebaseErr) {
          console.log('optionalAuth: Firebase verification failed', firebaseErr && firebaseErr.message);
          // silent fail
        }
      }
    }

    return next();
  } catch (error) {
    console.error('optionalAuth error:', error);
    return next(error);
  }
};
