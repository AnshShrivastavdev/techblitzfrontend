import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'MOCK_KEY_FOR_DEV',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'techblitz-2nd-edition.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'techblitz-2nd-edition',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'techblitz-2nd-edition.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1084106955804',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const isFirebaseConfigured = () => Boolean(import.meta.env.VITE_FIREBASE_API_KEY);
export default app;
