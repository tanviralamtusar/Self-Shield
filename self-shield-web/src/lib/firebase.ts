import * as admin from 'firebase-admin';

let firebaseApp: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App {
  if (firebaseApp) return firebaseApp;

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!json) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_JSON not set — FCM disabled');
    firebaseApp = admin.apps.length ? admin.apps[0]! : admin.initializeApp();
    return firebaseApp;
  }

  try {
    const cred = JSON.parse(json);
    firebaseApp = admin.apps.length
      ? admin.apps[0]!
      : admin.initializeApp({ credential: admin.credential.cert(cred) });
  } catch {
    console.error('Failed to init Firebase Admin');
    firebaseApp = admin.apps.length ? admin.apps[0]! : admin.initializeApp();
  }

  return firebaseApp;
}

export async function sendFcmMessage(
  fcmToken: string,
  data: Record<string, string>
): Promise<string | null> {
  try {
    return await getFirebaseAdmin().messaging().send({ token: fcmToken, data });
  } catch (error) {
    console.error('FCM send error:', error);
    return null;
  }
}
