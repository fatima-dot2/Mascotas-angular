
import { Injectable } from '@angular/core';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class CloudflareApiService {

  private apiUrl = 'https://6dc5c8a3-mascotas-angular.fatima24490.workers.dev';

  // Probar conexión con Cloudflare
  async testConnection(): Promise<any> {
    const response = await fetch(`${this.apiUrl}/api/health`);

    if (!response.ok) {
      throw new Error('No se pudo conectar con Cloudflare.');
    }

    return await response.json();
  }

  // Consultar mascotas mediante Cloudflare
  async getPets(): Promise<any[]> {

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    const token = data.session?.access_token;

    if (!token) {
      throw new Error('Debes iniciar sesión para consultar tus mascotas.');
    }

    const response = await fetch(`${this.apiUrl}/api/pets`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('No se pudieron consultar las mascotas desde Cloudflare.');
    }

    return await response.json();
  }
}
