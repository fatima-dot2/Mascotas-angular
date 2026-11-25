
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <div class="card shadow border-0 rounded-4">
        <div class="card-body p-4">
          <h2 class="fw-bold text-primary">
            <i class="bi bi-shield-lock-fill"></i>
            Panel de administración
          </h2>

          <p class="text-muted">
            Bienvenido al área administrativa de PetCare.
          </p>

          <hr>

          <h5>Administración de PetCare</h5>
          <p>
            Desde aquí podrás gestionar las funciones administrativas
            de la plataforma.
          </p>

          <button
            class="btn btn-danger"
            (click)="cerrarSesion()">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  `
})
export class Admin {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async cerrarSesion(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }
}
