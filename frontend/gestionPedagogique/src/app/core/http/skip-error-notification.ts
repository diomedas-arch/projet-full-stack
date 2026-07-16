import { HttpContext, HttpContextToken } from '@angular/common/http';

// Permet à un appel HTTP de désactiver le MatSnackBar global de l'intercepteur
// lorsque l'appelant affiche lui-même l'erreur (ex: sur un champ de formulaire).
export const SKIP_ERROR_NOTIFICATION = new HttpContextToken<boolean>(() => false);

export function skipErrorNotification(): HttpContext {
  return new HttpContext().set(SKIP_ERROR_NOTIFICATION, true);
}
