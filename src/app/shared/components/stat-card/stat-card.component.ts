import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ta-card flex items-center gap-4 p-5">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ecf3ff] text-[#465fff]">
        <ng-content select="[icon]"></ng-content>
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium uppercase tracking-wider text-[#667085] truncate">{{ title }}</p>
        <p class="mt-0.5 text-[22px] font-semibold leading-tight text-[#101828]">{{ value }}</p>
        @if (desc) {
          <p class="mt-0.5 text-xs text-[#667085]">{{ desc }}</p>
        }
      </div>
    </div>
  `,
})
export class StatCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string;
  @Input() desc?: string;
}
