import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslocoPipe, LanguageSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen overflow-hidden">

      <!-- Mobile overlay -->
      @if (sidebarOpen()) {
        <div class="fixed inset-0 z-40 bg-black/40 lg:hidden"
             (click)="sidebarOpen.set(false)"></div>
      }

      <!-- ── Sidebar ───────────────────────────────────────────────── -->
      <aside class="fixed top-0 left-0 z-50 flex h-screen w-[260px] flex-col
                    bg-[#1a2231] transition-transform duration-300 ease-in-out
                    lg:translate-x-0"
             [class.-translate-x-full]="!sidebarOpen()">

        <!-- Brand -->
        <div class="flex h-[70px] shrink-0 items-center gap-2.5 border-b border-white/[0.08] px-6">
          <svg class="h-7 w-7 shrink-0 text-[#465fff]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8 7 5 10.5 5 14a7 7 0 0 0 14 0c0-3.5-3-7-7-12z"/>
          </svg>
          <span class="text-xl font-bold tracking-tight text-white">TrackGas</span>
        </div>

        <!-- Nav -->
        <nav class="flex-1 overflow-y-auto px-4 py-5">

          <p class="ta-section-label mb-3 px-2 text-[#667085]">Principal</p>

          <ul class="space-y-0.5">
            <li>
              <a routerLink="/fuel"
                 routerLinkActive="menu-item-active"
                 [routerLinkActiveOptions]="{exact: false}"
                 (click)="sidebarOpen.set(false)"
                 class="menu-item-inactive flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150">
                <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M5 9a2 2 0 012-2h10a2 2 0 012 2v7H5V9zm0 7h14M9 7V5a1 1 0 012 0v2m2 0V5a1 1 0 012 0v2"/>
                </svg>
                <span>{{ 'nav.fuel' | transloco }}</span>
              </a>
            </li>
            <li>
              <a routerLink="/maintenance"
                 routerLinkActive="menu-item-active"
                 (click)="sidebarOpen.set(false)"
                 class="menu-item-inactive flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150">
                <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>{{ 'nav.maintenance' | transloco }}</span>
              </a>
            </li>
            <li>
              <a routerLink="/vehicles"
                 routerLinkActive="menu-item-active"
                 (click)="sidebarOpen.set(false)"
                 class="menu-item-inactive flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150">
                <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 114 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                </svg>
                <span>{{ 'nav.vehicles' | transloco }}</span>
              </a>
            </li>
          </ul>

          <p class="ta-section-label mb-3 mt-6 px-2 text-[#667085]">{{ 'nav.reports' | transloco }}</p>

          <ul class="space-y-0.5">
            <li>
              <a routerLink="/reports/fuel"
                 routerLinkActive="menu-item-active"
                 (click)="sidebarOpen.set(false)"
                 class="menu-item-inactive flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150">
                <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <span>{{ 'nav.reportFuel' | transloco }}</span>
              </a>
            </li>
            <li>
              <a routerLink="/reports/maintenance"
                 routerLinkActive="menu-item-active"
                 (click)="sidebarOpen.set(false)"
                 class="menu-item-inactive flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150">
                <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span>{{ 'nav.reportMaintenance' | transloco }}</span>
              </a>
            </li>
            <li>
              <a routerLink="/reports/consolidated"
                 routerLinkActive="menu-item-active"
                 (click)="sidebarOpen.set(false)"
                 class="menu-item-inactive flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150">
                <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                </svg>
                <span>{{ 'nav.reportConsolidated' | transloco }}</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Logout -->
        <div class="shrink-0 border-t border-white/[0.08] px-4 py-4">
          <button (click)="auth.logout()"
                  class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                         text-[#aeb9c9] transition-colors duration-150
                         hover:bg-white/[0.05] hover:text-[#f97066]">
            <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>{{ 'nav.logout' | transloco }}</span>
          </button>
        </div>
      </aside>

      <!-- ── Content ──────────────────────────────────────────────── -->
      <div class="flex flex-1 flex-col overflow-hidden lg:pl-[260px]">

        <!-- Top bar -->
        <header class="sticky top-0 z-30 flex h-[70px] shrink-0 items-center
                       border-b border-[#e4e7ec] bg-white px-4 lg:px-6">
          <button class="mr-3 rounded-lg p-1.5 text-[#667085] hover:bg-[#f2f4f7] lg:hidden"
                  (click)="sidebarOpen.set(true)" aria-label="Open menu">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span class="font-semibold text-[#101828] lg:hidden">TrackGas</span>
          <div class="flex-1"></div>
          <app-language-switcher />
        </header>

        <!-- Page content -->
        <main class="flex-1 overflow-y-auto bg-[#f9fafb] p-4 lg:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class LayoutComponent {
  readonly auth = inject(AuthService);
  readonly sidebarOpen = signal(false);
}
