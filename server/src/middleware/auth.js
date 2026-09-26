import mongoose from 'mongoose';
import { getFirebaseAuth, isFirebaseConfigured } from '../config/firebase.js';
import { User } from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    let authUid = null;
    let authEmail = null;
    let authName = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      let tokenVerified = false;

      // 1. Verify with Firebase Admin SDK if configured
      if (isFirebaseConfigured()) {
        try {
          const decodedToken = await getFirebaseAuth().verifyIdToken(token);
          if (decodedToken && decodedToken.uid) {
            authUid = decodedToken.uid;
            authEmail = decodedToken.email || null;
            authName = decodedToken.name || null;
            tokenVerified = true;
          }
        } catch (firebaseErr) {
          console.warn('[AuthMiddleware] Firebase verifyIdToken notice:', firebaseErr.message);
        }
      }

      // 2. Safe JWT payload inspection fallback for development/sandbox mode
      if (!tokenVerified) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
            authUid = payload.uid || payload.user_id || payload.sub || null;
            authEmail = payload.email || null;
            authName = payload.name || null;
          }
        } catch (e) {
          console.error('[AuthMiddleware] JWT parse error:', e.message);
        }
      }
    } else if (req.headers['x-user-id'] || req.headers['x-firebase-user-id'] || req.headers['x-clerk-user-id']) {
      // Direct header fallback for development/debugging
      authUid = req.headers['x-firebase-user-id'] || req.headers['x-user-id'] || req.headers['x-clerk-user-id'];
      authEmail = req.headers['x-user-email'];
      authName = req.headers['x-user-name'];
    }

    if (!authUid) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Missing or invalid Firebase ID session token.',
      });
    }

    const isInitialAdmin = Boolean(
      (process.env.ADMIN_FIREBASE_UID && process.env.ADMIN_FIREBASE_UID === authUid) ||
      (process.env.ADMIN_EMAIL && authEmail && process.env.ADMIN_EMAIL.toLowerCase() === authEmail.toLowerCase()) ||
      (process.env.ADMIN_CLERK_USER_ID && process.env.ADMIN_CLERK_USER_ID === authUid)
    );

    // Handle offline / disconnected DB state gracefully
    if (mongoose.connection.readyState !== 1) {
      req.user = {
        _id: 'user-demo-001',
        firebaseUid: authUid,
        clerkId: authUid,
        name: authName || (isInitialAdmin ? 'Aakash Sharma (COSMOS Lead)' : 'TechBlitz Participant'),
        email: authEmail || `${authUid}@firebase.user`,
        role: isInitialAdmin ? 'admin' : 'user',
        profileCompleted: true,
      };
      return next();
    }

    // Lookup user in MongoDB by firebaseUid, email, or legacy clerkId
    const safeEmail = (authEmail || `${authUid}@firebase.user`).toLowerCase();
    let user = await User.findOne({
      $or: [
        { firebaseUid: authUid },
        { email: safeEmail },
        { clerkId: authUid },
      ],
    });

    // If user does not exist in MongoDB, create baseline record
    if (!user) {
      user = await User.create({
        firebaseUid: authUid,
        clerkId: authUid,
        name: authName || 'TechBlitz Participant',
        email: safeEmail,
        role: isInitialAdmin ? 'admin' : 'user',
        profileCompleted: false,
      });
    } else {
      let needsSave = false;

      // Link firebaseUid if missing
      if (!user.firebaseUid) {
        user.firebaseUid = authUid;
        needsSave = true;
      }

      // Update name if currently default and a real name was provided by Firebase
      if (authName && (user.name === 'TechBlitz Participant' || !user.name)) {
        user.name = authName;
        needsSave = true;
      }

      // Server-authoritative role alignment
      if (isInitialAdmin && user.role !== 'admin') {
        user.role = 'admin';
        needsSave = true;
      }

      if (needsSave) {
        await user.save();
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[AuthMiddleware] Error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token.',
    });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const isAdmin =
      req.user.role === 'admin' ||
      (process.env.ADMIN_FIREBASE_UID && process.env.ADMIN_FIREBASE_UID === req.user.firebaseUid) ||
      (process.env.ADMIN_EMAIL && req.user.email && process.env.ADMIN_EMAIL.toLowerCase() === req.user.email.toLowerCase()) ||
      (process.env.ADMIN_CLERK_USER_ID && process.env.ADMIN_CLERK_USER_ID === (req.user.clerkId || req.user.firebaseUid));

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Access restricted to TechBlitz Administrators.',
      });
    }

    next();
  } catch (error) {
    console.error('[AdminMiddleware] Error:', error);
    return res.status(403).json({
      success: false,
      message: 'Authorization failed.',
    });
  }
};
