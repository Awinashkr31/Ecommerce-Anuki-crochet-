import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let app: App;

if (!getApps().length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountStr) {
      const serviceAccount = JSON.parse(serviceAccountStr);
      app = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY missing, using default credentials');
      app = initializeApp();
    }
  } catch (error) {
    console.error('Firebase Admin error:', error);
    app = initializeApp();
  }
} else {
  app = getApps()[0] as App;
}

export const authAdmin = getAuth(app);
