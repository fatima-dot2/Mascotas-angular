
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

  accessType: 'cliente' | 'admin' = 'cliente';
  adminCode = '';
  verificationStep = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async submit(): Promise<void> {
    this.error = '';
    this.success = '';

    // Verificar código de administrador
    if (this.verificationStep) {
      if (!/^\d{6}$/.test(this.adminCode)) {
        this.error = 'Escribe un código válido de 6 dígitos.';
        return;
      }

      this.loading = true;

      try {
       await this.authService.verifyAdminCode(this.adminCode);

this.success = '¡Código verificado correctamente!';

this.adminCode = '';

await this.router.navigate(['/admin']);

      } catch (error: any) {
        this.error = error.message || 'No se pudo verificar el código.';
      } finally {
        this.loading = false;
      }

      return;
    }

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
      // Registro de clientes
      if (this.isRegister) {
        const result = await this.authService.register(
          this.email.trim(),
          this.password
        );

        if (result.error) {
          this.error = 'No se pudo crear la cuenta: ' + result.error.message;
          return;
        }

        this.accessType = 'cliente';

        this.success = result.data.session
          ? '¡Cuenta de cliente creada correctamente!'
          : 'Cuenta creada. Revisa tu correo para confirmar el registro.';

        return;
      }

      // Inicio de sesión
      const result = await this.authService.login(
        this.email.trim(),
        this.password
      );

      if (result.error) {
        this.error = 'No se pudo iniciar sesión: ' + result.error.message;
        return;
      }

      // Acceso de administrador
      if (this.accessType === 'admin') {
        try {
          await this.authService.requestAdminCode();

          this.verificationStep = true;
          this.success = 'Te enviamos un código de verificación a tu correo.';

        } catch (error: any) {
          await this.authService.logout();

          this.error = error.message ||
            'No tienes permisos de administrador o no se pudo enviar el código.';
        }

      } else {
        // Acceso de cliente
        this.success = '¡Inicio de sesión exitoso!';
        await this.router.navigate(['/']);
      }

    } catch (error: any) {
      console.error('Error de autenticación:', error);
      this.error = error.message || 'Ocurrió un error inesperado.';
    } finally {
      this.loading = false;
    }
  }

  cambiarModo(): void {
    this.isRegister = !this.isRegister;
    this.accessType = 'cliente';
    this.verificationStep = false;
    this.adminCode = '';
    this.error = '';
    this.success = '';
  }
}
