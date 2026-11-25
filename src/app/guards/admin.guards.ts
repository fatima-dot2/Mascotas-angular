
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authorized = await authService.checkAdminAccess();

  if (authorized) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
