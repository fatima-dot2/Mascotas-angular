
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

  submit(): void {
    this.error = '';
    this.success = '';

    if (!this.email.trim() || !this.password) {
      this.error = 'Completa tu correo y contraseña.';
      return;
    }

    this.loading = true;

    const operation = this.isRegister
      ? this.authService.register(this.email.trim(), this.password)
      : this.authService.login(this.email.trim(), this.password);

    operation
      .then(() => {
        this.success = this.isRegister
          ? '¡Cuenta creada correctamente!'
          : '¡Inicio de sesión exitoso!';
      })
      .catch((err: any) => {
        this.error = this.getErrorMessage(err.code);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado.';
      case 'auth/invalid-email':
        return 'El correo no es válido.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrectos.';
      default:
        return 'Ocurrió un error. Intenta nuevamente.';
    }
  }
}
