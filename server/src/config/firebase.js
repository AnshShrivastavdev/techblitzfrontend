import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isInitialized = false;
let authInstance = null;

const initFirebase = () => {
  if (getApps().length > 0) {
    isInitialized = true;
    authInstance = getAuth(getApp());
    return getApp();
  }

  try {
    // 1. Check all candidate serviceAccountKey paths
    const candidatePaths = [
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
      path.resolve(process.cwd(), 'serviceAccountKey.json'),
      path.resolve(process.cwd(), 'server/serviceAccountKey.json'),
      path.resolve(__dirname, '../../serviceAccountKey.json'),
      path.resolve(__dirname, '../serviceAccountKey.json'),
      '/etc/secrets/serviceAccountKey.json',
    ].filter(Boolean);

    for (const p of candidatePaths) {
      try {
        if (fs.existsSync(p)) {
          const fileData = fs.readFileSync(p, 'utf8');
          const serviceAccount = JSON.parse(fileData);
          if (serviceAccount && serviceAccount.project_id) {
            const app = initializeApp({
              credential: cert(serviceAccount),
            });
            isInitialized = true;
            authInstance = getAuth(app);
            console.log(`[Firebase] Initialized with Service Account: ${p} (project: ${serviceAccount.project_id})`);
            return app;
          }
        }
      } catch (err) {
        console.warn(`[Firebase] Notice checking candidate path ${p}:`, err.message);
      }
    }
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
