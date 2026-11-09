
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from 'firebase/auth';
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

  private unsubscribeAuth?: () => void;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.unsubscribeAuth = this.authService.listenAuth(user => {
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
      console.error('No se pudo cerrar sesión.');
    }
  }
}
