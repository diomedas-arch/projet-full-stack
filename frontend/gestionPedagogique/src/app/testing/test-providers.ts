import { EnvironmentProviders, Provider } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';

type TestProvider = Provider | EnvironmentProviders;

export const authServiceStub = {
  estConnecte: () => true,
  utilisateur: () => ({ id: 1, email: 'admin@example.test', role: 'ROLE_ADMIN' as const, statut: 'ACTIF' as const }),
  role: () => 'ROLE_ADMIN' as const,
  aUnRole: (roles: string[]) => roles.includes('ROLE_ADMIN'),
  logout: () => undefined
};

export function commonComponentProviders(extra: TestProvider[] = []): TestProvider[] {
  return [
    provideRouter([]),
    provideNoopAnimations(),
    {
      provide: MatDialog,
      useValue: {
        open: () => ({ afterClosed: () => of(false) })
      }
    },
    {
      provide: MatSnackBar,
      useValue: {
        open: () => undefined
      }
    },
    { provide: AuthService, useValue: authServiceStub },
    ...extra
  ];
}
