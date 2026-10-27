import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _token = signal<string | null>(
    this.isBrowser ? localStorage.getItem('token') : null
  );
  private readonly _user = signal<Omit<AuthResponse, 'token'> | null>(
    this.isBrowser ? JSON.parse(localStorage.getItem('user') ?? 'null') : null
  );

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());

  register(email: string, password: string, name: string, locale: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { email, password, name, locale })
      .pipe(tap(res => this.storeSession(res)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => this.storeSession(res)));
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private storeSession(res: AuthResponse) {
    const { token, ...user } = res;
    if (this.isBrowser) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this._token.set(token);
    this._user.set(user);
  }
}
