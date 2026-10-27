import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslocoPipe, LanguageSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#f9fafb] p-4">
      <div class="w-full max-w-sm bg-white rounded-2xl border border-[#e4e7ec]" style="box-shadow:0px 4px 24px rgba(16,24,40,0.08)">
        <div class="p-8">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center gap-2">
              <svg class="w-7 h-7 text-[#465fff]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8 7 5 10.5 5 14a7 7 0 0 0 14 0c0-3.5-3-7-7-12z"/>
              </svg>
              <h2 class="text-2xl font-semibold text-[#101828]">TrackGas</h2>
            </div>
            <app-language-switcher />
          </div>
          <p class="text-sm text-[#667085] mb-6">{{ 'auth.loginTitle' | transloco }}</p>

          <form [formGroup]="form" (ngSubmit)="submit()" class="mt-4 space-y-3">
            @if (error()) {
              <div class="alert alert-error text-sm">{{ error() }}</div>
            }

            <fieldset class="fieldset">
              <legend class="fieldset-legend">{{ 'auth.email' | transloco }}</legend>
              <input type="email" formControlName="email" class="input w-full"
                     [class.input-error]="form.get('email')?.invalid && form.get('email')?.touched" />
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">{{ 'auth.password' | transloco }}</legend>
              <input type="password" formControlName="password" class="input w-full"
                     [class.input-error]="form.get('password')?.invalid && form.get('password')?.touched" />
            </fieldset>

            <button type="submit" class="ta-btn ta-btn-primary w-full mt-2" [disabled]="loading()">
              @if (loading()) { <span class="loading loading-spinner loading-sm"></span> }
              {{ 'auth.login' | transloco }}
            </button>
          </form>

          <p class="text-center text-sm text-[#667085] mt-5">
            {{ 'auth.noAccount' | transloco }}
            <a routerLink="/register" class="text-[#465fff] font-medium hover:underline ml-1">{{ 'auth.register' | transloco }}</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  readonly loading = signal(false);
  readonly error = signal('');

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/fuel']),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Login failed');
        this.loading.set(false);
      },
    });
  }
}
