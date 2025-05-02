import { getFirestore, connectFirestoreEmulator, addDoc, collection } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../src/firebase/client';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

const dummyApplications = [
  {
    eventId: 'post1', // match this with an existing event ID
    applicantId: 'musician1', // the ID of the applying musician
    status: 'pending',
    createdAt: serverTimestamp(),
    instrument: 'Violin',
  },
];

async function seedApplications() {
  for (const application of dummyApplications) {
    const docRef = await addDoc(collection(db, 'applications'), application);
    console.log(`Created application: ${docRef.id} for event ${application.eventId}`);
  }
}

seedApplications()
  .then(() => console.log('Seeding applications complete!'))
  .catch(console.error);
