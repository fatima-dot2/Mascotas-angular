
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  Router,
  NavigationEnd
} from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '@supabase/supabase-js';
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

  esAdmin = false;

  private unsubscribeAuth?: () => void;
  private routerSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.unsubscribeAuth = this.authService.listenAuth(async (user) => {

      this.usuario = user;

      if (!user) {
        this.esAdmin = false;
        this.cargandoSesion = false;
        return;
      }

      await this.actualizarAccesoAdmin();

      this.cargandoSesion = false;
    });

    // Volver a comprobar el acceso al cambiar de página.
    this.routerSubscription = this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd && this.usuario) {
        void this.actualizarAccesoAdmin();
      }

    });
  }

  async actualizarAccesoAdmin(): Promise<void> {

    if (!this.usuario) {
      this.esAdmin = false;
      return;
    }

    const usuarioId = this.usuario.id;

    const autorizado = await this.authService.checkAdminAccess();

    // Evita aplicar el resultado a otra sesión.
    if (this.usuario?.id !== usuarioId) {
      return;
    }

    this.esAdmin = autorizado;
  }

  ngOnDestroy(): void {
    this.unsubscribeAuth?.();
    this.routerSubscription?.unsubscribe();
  }

  async cerrarSesion(): Promise<void> {

    try {
      await this.authService.logout();

      this.usuario = null;
      this.esAdmin = false;

      await this.router.navigate(['/login']);

    } catch {
      this.mensaje = 'No se pudo cerrar sesión. Intenta nuevamente.';
    }
  }

  mostrarMensaje(texto: string): void {
    this.mensaje = texto;
  }

  protected readonly title = signal('mascotas');
}
