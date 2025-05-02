// 1) Firebase Initialization & Configuration
// Brief explanation of app initialization and references to Auth, Firestore, and Storage.
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  connectAuthEmulator,
  signOut as firebaseSignOut,
  sendEmailVerification,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  connectFirestoreEmulator,
  serverTimestamp,
  getDoc,
  query,
  where,
  runTransaction,
  addDoc,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, connectStorageEmulator } from 'firebase/storage';
import { useState, useEffect } from 'react';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize storage with app instance


/**
 * Sends a test log entry to verify logging functionality.
 */
// ...existing code...

// 3) Development Emulators Setup
// Brief explanation of connecting to local emulators for Auth, Firestore, and Storage.
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199); // Connect to storage emulator
}
// 4) User Authentication & Session Management
/**
 * Logs in a user, checking email verification status.
 * If unverified, triggers resend of the verification email.
 */
// Signs in an existing user with email verification check
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Check if email is verified
  if (!user.emailVerified) {
    // Send a new verification email if needed
    await sendEmailVerification(user);
    throw new Error('Please verify your email before logging in. A new verification email has been sent.');
  }

  return user;
}

// Returns the currently authenticated user when available.
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}

// Updates user attributes (e.g. name) in Firestore.
export async function updateUserAttributes(uid, attributes) {
  console.log('updateUserAttributes called with:', { uid, attributes });
  if (attributes.transport !== undefined || attributes.paSystem !== undefined || attributes.lighting !== undefined) {
    console.log('Types:', {
      transport: typeof attributes.transport,
      paSystem: typeof attributes.paSystem,
      lighting: typeof attributes.lighting,
    });
  }
  try {
    const docRef = doc(db, 'users', uid);
    console.log('Updating document:', docRef.path);
    await updateDoc(docRef, attributes);
    console.log('Update successful');
    return true;
  } catch (error) {
    console.error('Error in updateUserAttributes:', error);
    throw error;
  }
}

export const createUser = async (email, password, userData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name in Firebase Auth
  await updateProfile(user, { displayName: `${userData.firstName} ${userData.lastName}` });

  // Send email verification
  await sendEmailVerification(user);

  await reserveUsername(userData.username); // Ensures username is locked

  const newUser = {
    uid: user.uid,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: email,
    username: userData.username,
    phone: userData.phone,
    searchRadius: userData.searchRadius || 100,
    yearsExperience: userData.yearsExperience || 0,
    agencyName: userData.agencyName || '',
    instruments: userData.instrument ? [userData.instrument] : [],
    role: userData.role || '',
    bio: userData.bio || '',
    postcode: userData.postcode || '',
    geoPoint: userData.geoPoint || null,
    createdAt: serverTimestamp(),
    slug: userData.username,
    transport: userData.transport || false,
    paSystem: userData.paSystem || false,
    lighting: userData.lighting || false,
    avatar: userData.avatar || '',
  };

  // Write user document to Firestore
  await setDoc(doc(db, 'users', user.uid), newUser);

  // Optionally sign out immediately after creation
  await firebaseSignOut(auth);
};

export async function getUserProfile(uid) {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return null;

  const data = userDoc.data();
  return {
    uid: userDoc.id,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    postcode: data.postcode || '',
    geoPoint: data.geoPoint || null,
    email: data.email || '',
    instruments: data.instruments || [],
    role: data.role || '',
    avatar: data.avatar || '',
    bio: data.bio || '',
    video: data.video || '',
    searchRadius: data.searchRadius || 100,
    slug: data.slug || '',
    transport: typeof data.transport === 'boolean' ? data.transport : false,
    yearsExperience: data.yearsExperience || 0,
    paSystem: typeof data.paSystem === 'boolean' ? data.paSystem : false,
    lighting: typeof data.lighting === 'boolean' ? data.lighting : false,
    agencyName: data.agencyName || '',
    // Include any other fields you need
  };
}

/**
 * Custom React hook for listening to Auth state changes.
 * Provides user and loading states.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    signOut: () => signOut(), // Explicitly provide the signOut function
  };
}

/**
 * Signs out the current user session.
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// 5) User Data & Profile Management
/**
 * Uploads a user's profile image, updates the avatar field in Firestore,
 * and returns the download URL.
 */
// Add new function for profile image upload
export async function uploadProfileImage(uid, file) {
  try {
    // Add error handling and logging
    console.log('Starting upload for uid:', uid);

    const storageRef = ref(storage, `profile-images/${uid}/${Date.now()}_${file.name}`);
    console.log('Storage reference created:', storageRef.fullPath);

    // Upload with progress monitoring
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Log progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress + '%');
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Upload completed. Download URL:', downloadURL);

            // Update user profile in Firestore
            await updateDoc(doc(db, 'users', uid), {
              avatar: downloadURL,
              avatarUpdatedAt: serverTimestamp(),
            });

            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadProfileImage:', error);
    throw error;
  }
}

/**
 * Fetches user details and relevant attributes from Firestore.
 */
export async function getUserBySlug(slug) {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  const data = docSnap.data();
  return {
    uid: docSnap.id,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    postcode: data.postcode || '',
    geoPoint: data.geoPoint || null,
    email: data.email || '',
    instruments: data.instruments || [],
    role: data.role || '',
    avatar: data.avatar || '',
    bio: data.bio || '',
    video: data.video || '',
    searchRadius: data.searchRadius || 100,
    slug: data.slug || '',
    transport: typeof data.transport === 'boolean' ? data.transport : false,
    yearsExperience: data.yearsExperience || 0,
    paSystem: typeof data.paSystem === 'boolean' ? data.paSystem : false,
    lighting: typeof data.lighting === 'boolean' ? data.lighting : false,
    ward: data.ward || '',
    region: data.region || '',
    country: data.country || '',
    agencyName: data.agencyName || '',
  };
}

/**
 * Fetches all events created by a specific user.
 * @param {string} uid - The UID of the user whose events to fetch.
 * @returns {Promise<Array>} Array of event objects.
 */
export async function fetchUserEvents(uid) {
  const q = query(collection(db, 'events'), where('agentId', '==', uid));
  const querySnapshot = await getDocs(q);
  const events = [];
  querySnapshot.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() });
  });
  return events;
}

/**
 * Custom React hook for managing and fetching user data.
 * @param {string} uid - The UID of the user.
 * @returns {Object} Object containing user data and loading state.
 */
export function useUserData(uid) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', uid), (doc) => {
      if (doc.exists()) {
        setUserData({ uid: doc.id, ...doc.data() });
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return { userData, loading };
}

/**
 * Function to create a username for the user, using first and last name, plus some random digits
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @returns {string} A generated username.
 */
export function generateUsername(firstName, lastName) {
  const randomDigits = Math.floor(Math.random() * 1000);
  return `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomDigits}`;
}

// New function to reserve a username
export async function reserveUsername(username) {
  const dbRef = doc(db, 'usernames', username.toLowerCase());
  try {
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(dbRef);
      if (docSnap.exists()) {
        throw new Error('Username already taken.');
      }
      transaction.set(dbRef, { reserved: true, createdAt: serverTimestamp() });
    });
    return true;
  } catch (error) {
    console.error('Error reserving username:', error);
    throw error;
  }
}

/**
 *  Function to add a review for a user. It prevents self-reviews and enforces rating range (1-5).
 * @param {string} reviewedUserId - The UID of the user being reviewed.
 * @param {number} rating - The rating (1-5).
 * @param {string} comment - The review comment.
 * @returns {Promise<string>} The ID of the created review document.
 */
export async function addUserReview(reviewedUserId, rating, comment) {
  const reviewerId = auth.currentUser?.uid;
  if (!reviewerId) throw new Error('User must be authenticated to leave a review.');
  if (reviewerId === reviewedUserId) throw new Error('You cannot review yourself.');
  if (typeof rating !== 'number' || rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5.');
  if (!comment || comment.trim().length < 30) throw new Error('Comment must be at least 30 characters.');
  if (comment.length > 300) throw new Error('Comment must be less than 300 characters.');

  // Optionally, prevent duplicate reviews from the same reviewer for the same user
  const existingReviewQuery = query(
    collection(db, 'reviews'),
    where('reviewerId', '==', reviewerId),
    where('reviewedUserId', '==', reviewedUserId)
  );
  const existingReviewSnap = await getDocs(existingReviewQuery);
  if (!existingReviewSnap.empty) {
    throw new Error('You have already reviewed this user.');
  }

  // Fetch reviewer display name
  let reviewerName = '';
  try {
    const userDoc = await getDoc(doc(db, 'users', reviewerId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      reviewerName = data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.username || '';
    }
  } catch {
    reviewerName = '';
  }

  const review = {
    reviewerId,
    reviewerName,
    reviewedUserId,
    rating,
    comment: comment || '',
    timestamp: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'reviews'), review);
  return docRef.id;
}

/**
 * Fetches all reviews for a specific user.
 * @param {string} reviewedUserId - The UID of the user whose reviews to fetch.
 * @returns {Promise<Array>} Array of review objects.
 */
export async function fetchUserReviews(reviewedUserId) {
  // Only fetch the 3 most recent reviews, ordered by timestamp descending
  const q = query(
    collection(db, 'reviews'),
    where('reviewedUserId', '==', reviewedUserId),
    orderBy('timestamp', 'desc'),
    limit(3)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  doc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  sendEmailVerification,
};

export async function fetchUserNotifications(userId) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('status', '==', 'unread')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}