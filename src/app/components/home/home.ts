
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { CloudflareApiService } from '../../services/cloudflare-api';
import { AuthService } from '../../services/auth';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
  standalone: true
})
export class Home implements OnInit, OnDestroy {

  usuario: User | null = null;
  cargandoSesion = true;
  resultadoCloudflare = '';

  private unsubscribeAuth?: () => void;

  constructor(
  private authService: AuthService,
  private cloudflareApiService: CloudflareApiService,
  private cdr: ChangeDetectorRef
  ) {}

 ngOnInit(): void {
  this.unsubscribeAuth = this.authService.listenAuth(user => {
    this.usuario = user;
    this.cargandoSesion = false;

    // Actualizar la vista de Angular
    this.cdr.detectChanges();

    console.log('Usuario actualizado en Home:', this.usuario);
  });
}

  ngOnDestroy(): void {
    this.unsubscribeAuth?.();
  }

  async cerrarSesion(): Promise<void> {
    try {
      await this.authService.logout();
      this.usuario = null;
    } catch {
      console.error('No se pudo cerrar sesión.');
    }
  }

  
  async probarCloudflare() {
    try {
      const respuesta = await this.cloudflareApiService.testConnection();

      this.resultadoCloudflare = respuesta.message;

      console.log('Respuesta de Cloudflare:', respuesta);
    } catch (error) {
      console.error('Error:', error);
      this.resultadoCloudflare = 'No se pudo conectar con Cloudflare.';
    }
  }

  async probarConsultaMascotas() {
  try {
    const mascotas = await this.cloudflareApiService.getPets();

    console.log('Mascotas recibidas desde Cloudflare:', mascotas);

    this.resultadoCloudflare =
      `Consulta exitosa. Mascotas encontradas: ${mascotas.length}`;

  } catch (error) {
    console.error('Error al consultar mascotas:', error);
    this.resultadoCloudflare = 'Error al consultar mascotas desde Cloudflare.';
  }
}
  }

