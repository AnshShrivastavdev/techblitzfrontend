import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

let isInitialized = false;
let authInstance = null;

const initFirebase = () => {
  if (getApps().length > 0) {
    isInitialized = true;
    authInstance = getAuth(getApp());
    return getApp();
  }

  try {
    // 1. Direct JSON service account file path
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      const fileData = fs.readFileSync(serviceAccountPath, 'utf8');
      const serviceAccount = JSON.parse(fileData);
      const app = initializeApp({
        credential: cert(serviceAccount),
      });
      isInitialized = true;
      authInstance = getAuth(app);
      console.log('[Firebase] Initialized with Service Account file');
      return app;
    }

    // Check Render Secret File path (/etc/secrets/serviceAccountKey.json)
    const renderSecretPath = '/etc/secrets/serviceAccountKey.json';
    if (fs.existsSync(renderSecretPath)) {
      const fileData = fs.readFileSync(renderSecretPath, 'utf8');
      const serviceAccount = JSON.parse(fileData);
      const app = initializeApp({
        credential: cert(serviceAccount),
      });
      isInitialized = true;
      authInstance = getAuth(app);
      console.log('[Firebase] Initialized with Render /etc/secrets/serviceAccountKey.json');
      return app;
    }

    // Check for default ./serviceAccountKey.json in server root or current working dir
    const defaultLocalPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(defaultLocalPath)) {
      const fileData = fs.readFileSync(defaultLocalPath, 'utf8');
      const serviceAccount = JSON.parse(fileData);
      const app = initializeApp({
        credential: cert(serviceAccount),
      });
      isInitialized = true;
      authInstance = getAuth(app);
      console.log('[Firebase] Initialized with local serviceAccountKey.json');
      return app;
    }

    // 2. Individual Environment Variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }

      const app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      isInitialized = true;
      authInstance = getAuth(app);
      console.log('[Firebase] Initialized with Environment Variables');
      return app;
    }

    // 3. Raw JSON string environment variable
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      const app = initializeApp({
        credential: cert(serviceAccount),
      });
      isInitialized = true;
      authInstance = getAuth(app);
      console.log('[Firebase] Initialized with FIREBASE_SERVICE_ACCOUNT JSON string');
      return app;
    }

    console.warn(
      '[Firebase] Notice: Firebase credentials not yet set. Running with fallback parser until FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are provided in .env.'
    );
  } catch (error) {
    console.error('[Firebase] Initialization error:', error.message);
  }

  return null;
};

initFirebase();

export const getFirebaseAuth = () => authInstance;
export const isFirebaseConfigured = () => isInitialized && authInstance !== null;
