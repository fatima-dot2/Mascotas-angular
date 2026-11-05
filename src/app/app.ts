
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { User } from 'firebase/auth';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  mensaje = '';
  mascotasAbierto = false;
  serviciosAbierto = false;

  usuario: User | null = null;
  cargandoSesion = true;

  private unsubscribeAuth?: () => void;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.unsubscribeAuth = this.authService.listenAuth((user) => {
      this.usuario = user;
      this.cargandoSesion = false;
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
      this.mensaje = 'No se pudo cerrar sesión. Intenta nuevamente.';
    }
  }

  mostrarMensaje(texto: string): void {
    this.mensaje = texto;
  }

  protected readonly title = signal('mascotas');
}
