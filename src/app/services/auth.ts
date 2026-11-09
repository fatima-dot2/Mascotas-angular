
import { Injectable } from '@angular/core';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User
} from 'firebase/auth';

import { auth } from './firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  async register(email: string, password: string) {
    await setPersistence(auth, browserLocalPersistence);

    return createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  async login(email: string, password: string) {
    await setPersistence(auth, browserLocalPersistence);

    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  logout() {
    return signOut(auth);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  listenAuth(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}
