import { Component, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';

export interface DateRange {
  from: string;
  to: string;
}

@Component({
  selector: 'app-date-filter',
  standalone: true,
  imports: [FormsModule, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap gap-2 items-end">
      <fieldset class="fieldset">
        <legend class="fieldset-legend text-xs">{{ 'common.from' | transloco }}</legend>
        <input type="date" class="input input-sm" [(ngModel)]="from" (change)="emit()" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend text-xs">{{ 'common.to' | transloco }}</legend>
        <input type="date" class="input input-sm" [(ngModel)]="to" (change)="emit()" />
      </fieldset>
    </div>
  `,
})
export class DateFilterComponent implements OnInit {
  @Output() rangeChange = new EventEmitter<DateRange>();

  from = '';
  to = '';

  ngOnInit() {
    const now = new Date();
    this.from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    this.to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    this.emit();
  }

  emit() {
    this.rangeChange.emit({ from: this.from, to: this.to });
  }
}
