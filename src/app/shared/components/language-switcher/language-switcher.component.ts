import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dropdown dropdown-end">
      <label tabindex="0" role="button"
             class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
                    text-[#475467] hover:bg-[#F1F5F9] cursor-pointer transition-colors duration-150">
        {{ currentLangLabel() }}
        <svg class="w-3.5 h-3.5 text-[#98A2B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </label>
      <ul tabindex="0"
          class="dropdown-content z-50 mt-1 w-36 rounded-lg bg-white
                 border border-[#E2E8F0] shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-1">
        @for (lang of langs; track lang.code) {
          <li>
            <button class="w-full text-left px-3 py-2 text-sm text-[#344054]
                           rounded-md hover:bg-[#F9FAFB] transition-colors duration-100"
                    (click)="setLang(lang.code)">{{ lang.label }}</button>
          </li>
        }
      </ul>
    </div>
  `,
})
export class LanguageSwitcherComponent {
  private readonly transloco = inject(TranslocoService);

  readonly langs = [
    { code: 'pt-BR', label: '🇧🇷 Português' },
    { code: 'en', label: '🇺🇸 English' },
    { code: 'es', label: '🇪🇸 Español' },
  ];

  currentLangLabel() {
    const code = this.transloco.getActiveLang();
    return this.langs.find(l => l.code === code)?.label ?? code;
  }

  setLang(code: string) {
    this.transloco.setActiveLang(code);
    try { localStorage.setItem('lang', code); } catch {}
  }
}
