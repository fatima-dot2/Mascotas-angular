
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

  async getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

async getAccessToken(): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return data.session?.access_token ?? null;
}

private workerUrl =
  'https://mascotas-angular.fatima24490.workers.dev';

async requestAdminCode() {
  const token = await this.getAccessToken();

  if (!token) {
    throw new Error('No hay una sesión iniciada.');
  }

  const response = await fetch(
    `${this.workerUrl}/api/admin/send-code`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({})
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || result.error || 'No se pudo enviar el código.');
  }

  return result;
}

async verifyAdminCode(code: string) {
  const token = await this.getAccessToken();

  if (!token) {
    throw new Error('No hay una sesión iniciada.');
  }

  const response = await fetch(
    `${this.workerUrl}/api/admin/verify-code`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || result.error || 'El código no es válido.');
  }

  return result;
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

async checkAdminAccess(): Promise<boolean> {
  const token = await this.getAccessToken();

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      `${this.workerUrl}/api/admin/check-access`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      return false;
    }

    const result = await response.json();

    return result.success === true &&
           result.authorized === true;

  } catch (error) {
    console.error('Error comprobando acceso administrativo:', error);
    return false;
  }
}


}
