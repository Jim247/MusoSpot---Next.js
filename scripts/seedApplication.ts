import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../src/firebase/client';
import { createEventWithNotifications } from '../src/lib/firebase';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to the Firestore emulator when in development
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

const dummyPosts = [
  {
    id: 'post1',
    agentId: 'user1',
    postcode: 'GL1 1DG',
    geoPoint: {
      lat: 51.8642,
      lng: -2.238,
    },
    date: new Date('2024-02-01'),
    instrumentsNeeded: ['Violin'],
    created_att: serverTimestamp(),
    status: 'open',
  },
];

async function seedEvents() {
  for (const post of dummyPosts) {
    const { postId, matchCount } = await createEventWithNotifications(post, post.agentId);
    console.log(`Created post: ${postId} with ${matchCount} matches`);
  }
}

seedEvents()
  .then(() => console.log('Seeding posts complete!'))
  .catch(console.error);
