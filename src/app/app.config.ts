import { ApplicationConfig, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { authErrorInterceptor } from './core/interceptors/auth-error.interceptor';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './core/services/transloco-loader.service';

function getDefaultLang(): string {
  try {
    return (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'pt-BR';
  } catch {
    return 'pt-BR';
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor, authErrorInterceptor])),
    provideClientHydration(withEventReplay()),
    provideTransloco({
      config: {
        availableLangs: ['en', 'pt-BR', 'es'],
        defaultLang: getDefaultLang(),
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        fallbackLang: 'en',
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
