import type { ServiceAccount } from 'firebase-admin';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { config } from 'firebase-functions';
import { getAppCheck } from 'firebase-admin/app-check';

const activeApps = getApps();
const serviceAccount = {
  type: 'service_account',
  project_id: config().firebase.project_id,
  private_key_id: config().firebase.private_key_id,
  private_key: config().firebase.private_key.replace(/\\n/g, '\n'),
  client_email: config().firebase.client_email,
  client_id: config().firebase.client_id,
  auth_uri: config().firebase.auth_uri,
  token_uri: config().firebase.token_uri,
  auth_provider_x509_cert_url: config().firebase.auth_cert_url,
  client_x509_cert_url: config().firebase.client_cert_url,
};

const initApp = () => {
  if (process.env.PROD) {
    console.info('PROD env detected. Using default service account.');
    return initializeApp();
  }
  console.info('Loading service account from Firebase config.');
  return initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });
};

export const app = activeApps.length === 0 ? initApp() : activeApps[0];

// Verify App Check tokens
const appCheck = getAppCheck();

export const verifyAppCheckToken = async (token: string) => {
  try {
    const decodedToken = await appCheck.verifyToken(token);
    console.info('App Check token verified:', decodedToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying App Check token:', error);
    throw new Error('Unauthorized');
  }
};
