import "server-only";

/**
 * Firebase Admin SDK initialization.
 * Reads credentials from FIREBASE_SERVICE_ACCOUNT env var (JSON string).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null;
let initialized = false;

function initialize(): void {
  if (initialized) return;
  initialized = true;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const admin = require("firebase-admin");

    if (admin.apps && admin.apps.length > 0) {
      app = admin.apps[0];
      db = app.firestore();
      return;
    }

    const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccountEnv) {
      const serviceAccount = JSON.parse(serviceAccountEnv);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
      db = app.firestore();
      console.log("[Firebase] Initialized from FIREBASE_SERVICE_ACCOUNT env var");
      return;
    }

    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credPath) {
      app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      db = app.firestore();
      console.log("[Firebase] Initialized from GOOGLE_APPLICATION_CREDENTIALS");
      return;
    }

    console.warn("[Firebase] No credentials found — using seed data fallback");
  } catch (err) {
    console.error("[Firebase] Initialization error:", err);
  }
}

export function getDb(): any {
  initialize();
  return db;
}

export function isFirebaseAvailable(): boolean {
  initialize();
  return db !== null;
}

export function getApp(): any {
  initialize();
  return app;
}

// Re-export the FieldValue server timestamp helper
export function serverTimestamp(): unknown {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const admin = require("firebase-admin");
    return admin.firestore.FieldValue.serverTimestamp();
  } catch {
    return new Date();
  }
}
