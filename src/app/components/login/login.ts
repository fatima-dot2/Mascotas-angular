
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  isRegister = false;
  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService) {}

  async submit(): Promise<void> {
    this.error = '';
    this.success = '';

    if (!this.email.trim() || !this.password) {
      this.error = 'Completa tu correo y contraseña.';
      return;
    }

    if (this.loading) return;

    this.loading = true;

    try {
      if (this.isRegister) {
        await this.authService.register(
          this.email.trim(),
          this.password
        );

        this.success = '¡Cuenta creada correctamente!';
      } else {
        await this.authService.login(
          this.email.trim(),
          this.password
        );

        this.success = '¡Inicio de sesión exitoso!';
      }
    } catch (err: any) {
      this.error = this.getErrorMessage(err?.code);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado. Inicia sesión.';
      case 'auth/invalid-email':
        return 'El correo no es válido.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrectos.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Revisa tu internet.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Espera un momento.';
      case 'auth/operation-not-allowed':
        return 'El registro por correo no está habilitado en Firebase.';
      default:
        return 'Ocurrió un error. Intenta nuevamente.';
    }
  }
}
