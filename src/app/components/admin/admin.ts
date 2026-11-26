
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'cliente';
  created_at: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <div class="card shadow border-0 rounded-4">
        <div class="card-body p-4">

        <div id="inicio"></div>

          <h2 class="fw-bold text-primary">
            <i class="bi bi-shield-lock-fill"></i>
            Panel de administración
          </h2>

          <p class="text-muted">
            Bienvenido al área administrativa de PetCare.
          </p>

          <hr>

          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h4 class="fw-bold">Usuarios registrados</h4>

            <button
              class="btn btn-outline-primary"
              (click)="cargarUsuarios()"
              [disabled]="loading">
              <i class="bi bi-arrow-clockwise"></i>
              Actualizar
            </button>
          </div>

          <!-- Estadísticas -->
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <div class="card bg-primary text-white border-0">
                <div class="card-body">
                  <h6>Total de usuarios</h6>
                  <h3 class="fw-bold">{{ usuarios.length }}</h3>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card bg-success text-white border-0">
                <div class="card-body">
                  <h6>Clientes registrados</h6>
                  <h3 class="fw-bold">{{ contarClientes() }}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Buscador -->
          <div class="mb-3">
            <label class="form-label fw-semibold">
              Buscar usuario por correo
            </label>

            <input
              type="text"
              class="form-control"
              placeholder="Escribe un correo electrónico..."
              [(ngModel)]="busqueda"
              (input)="filtrarUsuarios()">
          </div>

          <!-- Filtro por rol -->
          <div class="mb-4">
            <label class="form-label fw-semibold">
              Filtrar por tipo de cuenta
            </label>

            <select
              class="form-select"
              [(ngModel)]="filtroRol"
              (change)="filtrarUsuarios()">

              <option value="todos">Todos los usuarios</option>
              <option value="cliente">Clientes</option>
              <option value="admin">Administradores</option>

            </select>
          </div>

          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Cargando usuarios...</p>
          </div>

          <div *ngIf="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div *ngIf="!loading && !error && usuarios.length === 0"
               class="alert alert-info">
            No hay usuarios registrados.
          </div>

          <div *ngIf="!loading && usuarios.length > 0 && usuariosFiltrados.length === 0"
               class="alert alert-warning">
            No se encontraron usuarios con esos criterios.
          </div>

          <!-- Tabla -->
          <div id="usuarios"
     class="table-responsive"
     *ngIf="!loading && usuariosFiltrados.length > 0">

            <table class="table table-hover align-middle">

              <thead class="table-light">
  <tr>
    <th>Correo electrónico</th>
    <th>Rol</th>
    <th>Fecha de registro</th>
    <th>Acciones</th>
  </tr>
</thead>

<tbody>
  <tr *ngFor="let usuario of usuariosFiltrados">
    <td>{{ usuario.email }}</td>

    <td>
      <span
        class="badge"
        [ngClass]="usuario.role === 'admin'
          ? 'bg-primary'
          : 'bg-success'">
        {{ usuario.role }}
      </span>
    </td>

    <td>
      {{ usuario.created_at
        ? (usuario.created_at | date:'dd/MM/yyyy HH:mm')
        : 'No disponible' }}
    </td>

    <td>
      <button
        class="btn btn-sm btn-outline-primary"
        (click)="verDetalles(usuario)">
        <i class="bi bi-eye"></i>
        Ver detalles
      </button>
    </td>
  </tr>
</tbody>

            </table>
          </div>

          <!-- Detalles del usuario -->
<div *ngIf="usuarioSeleccionado"
     class="card border-primary mt-4">

  <div class="card-header bg-primary text-white">
    <h5 class="mb-0">
      <i class="bi bi-person-circle"></i>
      Detalles del usuario
    </h5>
  </div>

  <div class="card-body">

    <p>
      <strong>Correo electrónico:</strong>
      {{ usuarioSeleccionado.email }}
    </p>

    <p>
      <strong>Identificador:</strong>
      <span class="text-break">
        {{ usuarioSeleccionado.id }}
      </span>
    </p>

    <p>
      <strong>Rol:</strong>
      <span class="badge"
        [ngClass]="usuarioSeleccionado.role === 'admin'
          ? 'bg-primary'
          : 'bg-success'">
        {{ usuarioSeleccionado.role }}
      </span>
    </p>

    <p>
      <strong>Fecha de registro:</strong>
      {{ usuarioSeleccionado.created_at
        ? (usuarioSeleccionado.created_at | date:'dd/MM/yyyy HH:mm')
        : 'No disponible' }}
    </p>

    <button
      class="btn btn-secondary"
      (click)="cerrarDetalles()">
      Cerrar detalles
    </button>

  </div>
</div>

          <hr>

          <button
            class="btn btn-danger"
            (click)="cerrarSesion()">
            <i class="bi bi-box-arrow-right"></i>
            Cerrar sesión
          </button>

        </div>
      </div>
    </div>
  `

  
})
export class Admin implements OnInit {

  usuarios: AdminUser[] = [];
  usuariosFiltrados: AdminUser[] = [];
  usuarioSeleccionado: AdminUser | null = null;

  busqueda = '';
  filtroRol = 'todos';

  loading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    try {
      this.usuarios = await this.authService.getAdminUsers();
      this.filtrarUsuarios();

      console.log('Usuarios recibidos:', this.usuarios);

    } catch (error: any) {
      this.error = error.message ||
        'No se pudieron cargar los usuarios.';

      console.error('Error al cargar usuarios:', error);

    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  filtrarUsuarios(): void {
    const texto = this.busqueda.toLowerCase().trim();

    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const coincideCorreo = usuario.email
        .toLowerCase()
        .includes(texto);

      const coincideRol =
        this.filtroRol === 'todos' ||
        usuario.role === this.filtroRol;

      return coincideCorreo && coincideRol;
    });
  }

  contarClientes(): number {
    return this.usuarios.filter(
      usuario => usuario.role === 'cliente'
    ).length;
  }

  verDetalles(usuario: AdminUser): void {
  this.usuarioSeleccionado = usuario;
}

cerrarDetalles(): void {
  this.usuarioSeleccionado = null;
}

  async cerrarSesion(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }
}
