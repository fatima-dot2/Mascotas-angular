
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
      this.error = 'Completa el correo y la contraseña.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.loading = true;

    try {
      const result = this.isRegister
        ? await this.authService.register(
            this.email.trim(),
            this.password
          )
        : await this.authService.login(
            this.email.trim(),
            this.password
          );

      if (result.error) {
        this.error = this.isRegister
          ? 'No se pudo crear la cuenta: ' + result.error.message
          : 'No se pudo iniciar sesión: ' + result.error.message;
        return;
      }

      if (this.isRegister) {
        if (result.data.session) {
          this.success = '¡Cuenta creada correctamente!';
        } else {
          this.success =
            'Cuenta creada. Revisa tu correo para confirmar el registro.';
        }
      } else {
        this.success = '¡Inicio de sesión exitoso!';
      }

    } catch (error) {
      console.error('Error de autenticación:', error);
      this.error = 'Ocurrió un error inesperado.';
    } finally {
      this.loading = false;
    }
  }

  cambiarModo(): void {
    this.isRegister = !this.isRegister;
    this.error = '';
    this.success = '';
  }
}
