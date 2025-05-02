import { initializeApp, getApps } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Firebase config from environment variables
export const firebaseConfig = {
  apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PUBLIC_FIREBASE_APP_ID,
  recaptchaSiteKey: process.env.PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY,
};
 
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const functions = getFunctions(app);

// Initialize Firebase App Check
if (typeof window !== 'undefined') {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(firebaseConfig.recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true, // Automatically refresh App Check tokens
  });
}
