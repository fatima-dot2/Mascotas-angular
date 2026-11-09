
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'mascotas-84de9.firebaseapp.com',
  projectId: 'mascotas-84de9',
  storageBucket: 'mascotas-84de.firebasestorage.app',
  messagingSenderId: '63062324936',
  appId: 'TU_APP_ID'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
