
import { Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  async register(email: string, password: string) {
    return supabase.auth.signUp({
      email,
      password
    });
  }

  async login(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  async logout() {
    return supabase.auth.signOut();
  }

  getCurrentUser(): User | null {
    return null;
  }

  listenAuth(callback: (user: User | null) => void) {

    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setTimeout(() => {
          callback(session?.user ?? null);
        }, 0);

      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }
}
