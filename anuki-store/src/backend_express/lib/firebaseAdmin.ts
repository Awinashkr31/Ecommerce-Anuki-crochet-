import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let app: App;

if (!getApps().length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountStr) {
      let serviceAccount;
      try {
        let cleanStr = serviceAccountStr.trim();
        if (cleanStr.startsWith("'") && cleanStr.endsWith("'")) {
          cleanStr = cleanStr.slice(1, -1);
        } else if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
          cleanStr = cleanStr.slice(1, -1);
        }
        // Handle unescaped newlines in JSON string (common copy-paste issue)
        cleanStr = cleanStr.replace(/\n/g, '\\n');
        
        let parsed = JSON.parse(cleanStr);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        serviceAccount = parsed;
      } catch (err) {
        // Fallback to base64 if it's not valid JSON
        try {
          serviceAccount = JSON.parse(Buffer.from(serviceAccountStr, 'base64').toString('utf-8'));
        } catch (err2) {
          console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Proceeding with Application Default Credentials.');
        }
      }

      if (serviceAccount && serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      app = initializeApp(serviceAccount ? {
        credential: cert(serviceAccount),
      } : undefined);
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
