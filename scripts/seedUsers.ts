import 'dotenv/config';
import { getFirestore, connectFirestoreEmulator, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

// Build config from process.env for Node.js
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Connect to the Firestore and Auth emulators when in development
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

const dummyUsers = [
  {
    id: 'user1',
    first_name: 'James',
    last_name: 'Burgess',
    username: 'jburgess',
    email: 'jay249@hotmail.co.uk',
    phone: '07700900000',
    postcode: 'BS20 0LH',
    searchRadius: 25,
    geoPoint: {
      lat: 51.8642,
      lng: -2.238,
    },
    ward: 'Portishead',
    region: 'South West',
    instruments: ['Guitar'],
    role: 'musician',
    country: 'England',
    bio: 'The OG ',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=LlFVXa36FWalmdaO',
    slug: 'james-burgess-123',
    pa_system: true,
    lighting: true,
    transport: true,
    years_experience: 5,
  },
  // New agent user
  {
    id: 'agent1',
    first_name: 'Alex',
    last_name: 'Agent',
    username: 'agent',
    email: 'agent@agency.com',
    phone: '07700900001',
    postcode: 'BS1 4DJ',
    searchRadius: 50,
    geoPoint: {
      lat: 51.4545,
      lng: -2.5879,
    },
    ward: 'Bristol Central',
    region: 'South West',
    instruments: [],
    role: 'agent',
    country: 'England',
    bio: 'I am an agent looking for talented musicians to fill gigs across the South West.',
    video: '',
    slug: 'alex-agent-001',
    pa_system: false,
    lighting: false,
    transport: true,
    years_experience: 10,
    agency_name: 'South West Talent',
    city: 'Bristol',
  },
];

export async function seedUsers() {
  for (const user of dummyUsers) {
    try {
      // Create user in Firebase Auth with a default password
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, 'defaultPassword123');
      const authUser = userCredential.user;

      // Update display name
      await updateProfile(authUser, { displayName: `${user.first_name} ${user.last_name}` });

      // Store user profile in Firestore
      await setDoc(doc(db, 'users', authUser.id), {
        ...user,
        id: authUser.id, // Ensure Firestore id matches Auth id
      });

      console.log(`Created user: ${user.first_name} ${user.last_name}`);
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }
}

seedUsers()
  .then(() => console.log('Seeding complete!'))
  .catch(console.error);
