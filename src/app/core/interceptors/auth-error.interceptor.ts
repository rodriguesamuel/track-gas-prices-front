import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (
        isBrowser &&
        err.status === 401 &&
        req.url.startsWith(environment.apiUrl) &&
        !req.url.includes('/api/auth/')
      ) {
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};
