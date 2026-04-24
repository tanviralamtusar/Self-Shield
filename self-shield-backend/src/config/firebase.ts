import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseApp: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App {
  if (firebaseApp) return firebaseApp;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_JSON not set — FCM features disabled');
    // Return a stub that won't crash but won't send messages
    firebaseApp = admin.initializeApp();
    return firebaseApp;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    firebaseApp = admin.initializeApp();
  }

  return firebaseApp;
}

export async function sendFcmMessage(
  fcmToken: string,
  data: Record<string, string>
): Promise<string | null> {
  try {
    const app = getFirebaseAdmin();
    const response = await app.messaging().send({
      token: fcmToken,
      data,
    });
    return response;
  } catch (error) {
    console.error('FCM send error:', error);
    return null;
  }
}
