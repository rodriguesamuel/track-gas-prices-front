import { Component, inject, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ReportService } from '../../../core/services/report.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { MaintenanceReport } from '../../../core/models';
import { CurrencyBrlPipe } from '../../../shared/pipes/currency-brl.pipe';
import { DateBrPipe } from '../../../shared/pipes/date-br.pipe';
import { DateFilterComponent, DateRange } from '../../../shared/components/date-filter/date-filter.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-maintenance-report',
  standalone: true,
  imports: [FormsModule, TranslocoPipe, CurrencyBrlPipe, DateBrPipe,
    DateFilterComponent, StatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-5xl mx-auto">
      <h1 class="ta-page-title mb-6">{{ 'reports.maintenanceTitle' | transloco }}</h1>

      <div class="ta-card mb-6">
        <div class="p-4 flex flex-wrap gap-4 items-end">
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs">{{ 'common.vehicle' | transloco }}</legend>
            <select class="select select-sm" [(ngModel)]="selectedVehicleId" (change)="load()">
              <option value="">{{ 'common.all' | transloco }}</option>
              @for (v of vehicles(); track v.id) {
                <option [value]="v.id">{{ v.brand }} {{ v.model }}</option>
              }
            </select>
          </fieldset>
          <app-date-filter (rangeChange)="onDateChange($event)" />
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-8"><span class="loading loading-spinner loading-lg"></span></div>
      } @else if (report()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <app-stat-card
            [title]="'reports.totalCost' | transloco"
            [value]="(report()!.totalCost | currencyBrl) ?? ''"
          />
          @for (cat of categoryEntries(); track cat[0]) {
            <app-stat-card
              [title]="cat[0]"
              [value]="(cat[1] | currencyBrl) ?? ''"
            />
          }
        </div>

        @defer (on viewport) {
          <div class="ta-card overflow-x-auto">
            <table class="ta-table">
              <thead>
                <tr>
                  <th>{{ 'common.date' | transloco }}</th>
                  <th class="hidden sm:table-cell">{{ 'common.vehicle' | transloco }}</th>
                  <th>{{ 'maintenance.category' | transloco }}</th>
                  <th>{{ 'maintenance.description' | transloco }}</th>
                  <th>{{ 'maintenance.cost' | transloco }}</th>
                </tr>
              </thead>
              <tbody>
                @for (e of report()!.expenses; track e.id) {
                  <tr class="hover">
                    <td>{{ e.date | dateBr }}</td>
                    <td class="hidden sm:table-cell text-xs text-[#667085]">{{ e.vehicleLabel }}</td>
                    <td><span class="ta-badge ta-badge-neutral">{{ e.category }}</span></td>
                    <td>{{ e.description }}</td>
                    <td>{{ e.cost | currencyBrl }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @placeholder {
          <div class="skeleton h-48 w-full rounded-box"></div>
        }
      }
    </div>
  `,
})
export class MaintenanceReportComponent {
  private readonly reportService = inject(ReportService);
  readonly vehicles = inject(VehicleService).vehicles;

  readonly report = signal<MaintenanceReport | null>(null);
  readonly loading = signal(false);
  selectedVehicleId = '';
  private from = '';
  private to = '';

  readonly categoryEntries = computed(() => {
    const r = this.report();
    if (!r) return [];
    return Object.entries(r.costByCategory).sort((a, b) => (b[1] as number) - (a[1] as number));
  });

  onDateChange(range: DateRange) {
    this.from = range.from;
    this.to = range.to;
    this.load();
  }

  load() {
    this.loading.set(true);
    this.reportService.maintenance(this.selectedVehicleId || undefined, this.from, this.to).subscribe({
      next: data => { this.report.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
