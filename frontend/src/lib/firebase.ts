/**
 * Firebase configuration
 * All values are read from environment variables — never hardcode credentials here.
 * In Vite, create a .env file at the project root with the variables below.
 *
 * .env example:
 *   VITE_FIREBASE_API_KEY=AIza...
 *   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
 *   VITE_FIREBASE_PROJECT_ID=your-app
 *   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
 *   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
 *   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
 *   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX  (optional)
 */

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);

// Analytics is optional — only initialize when measurement ID is present
export async function getFirebaseAnalytics() {
  if (!firebaseConfig.measurementId) return null;
  const { getAnalytics } = await import('firebase/analytics');
  return getAnalytics(firebaseApp);
}
