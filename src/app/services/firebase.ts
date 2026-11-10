
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBL8YY4QsKodEySzzBSiEOH4_m4aKj1nvI',
  authDomain: 'mascotas-84de9.firebaseapp.com',
  projectId: 'mascotas-84de9',
  storageBucket: 'mascotas-84de.firebasestorage.app',
  messagingSenderId: '63062324936',
  appId: '1:63062324936:web:7a63b1f9816f52940d17fd'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
