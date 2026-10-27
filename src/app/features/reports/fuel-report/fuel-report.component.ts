import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { ReportService } from '../../../core/services/report.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { FuelReport } from '../../../core/models';
import { CurrencyBrlPipe } from '../../../shared/pipes/currency-brl.pipe';
import { KmPerLiterPipe } from '../../../shared/pipes/km-per-liter.pipe';
import { DateBrPipe } from '../../../shared/pipes/date-br.pipe';
import { DateFilterComponent, DateRange } from '../../../shared/components/date-filter/date-filter.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-fuel-report',
  standalone: true,
  imports: [FormsModule, TranslocoPipe, CurrencyBrlPipe, KmPerLiterPipe, DateBrPipe, DecimalPipe,
    DateFilterComponent, StatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-5xl mx-auto">
      <h1 class="ta-page-title mb-6">{{ 'reports.fuelTitle' | transloco }}</h1>

      <!-- Filters -->
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
        <!-- Stat cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <app-stat-card
            [title]="'reports.totalCost' | transloco"
            [value]="(report()!.totalCost | currencyBrl) ?? ''"
          />
          <app-stat-card
            [title]="'reports.avgEfficiency' | transloco"
            [value]="(report()!.avgKmPerLiter | kmPerLiter) ?? ''"
          />
          <app-stat-card
            [title]="'reports.totalLiters' | transloco"
            [value]="(report()!.totalLiters | number:'1.1-2') + ' L'"
          />
          <app-stat-card
            [title]="'reports.costPerKm' | transloco"
            [value]="(report()!.costPerKm | currencyBrl) ?? ''"
            [desc]="'/' + ('fuel.odometerKm' | transloco)"
          />
        </div>

        <!-- Deferred table for better initial load -->
        @defer (on viewport) {
          <div class="ta-card overflow-x-auto">
            <table class="ta-table">
              <thead>
                <tr>
                  <th>{{ 'common.date' | transloco }}</th>
                  <th class="hidden sm:table-cell">{{ 'common.vehicle' | transloco }}</th>
                  <th>km</th>
                  <th class="hidden md:table-cell">{{ 'fuel.liters' | transloco }}</th>
                  <th class="hidden md:table-cell">{{ 'fuel.pricePerLiter' | transloco }}</th>
                  <th>{{ 'fuel.totalCost' | transloco }}</th>
                  <th class="hidden sm:table-cell">{{ 'fuel.fuelType' | transloco }}</th>
                </tr>
              </thead>
              <tbody>
                @for (f of report()!.fillUps; track f.id) {
                  <tr class="hover">
                    <td>{{ f.date | dateBr }}</td>
                    <td class="hidden sm:table-cell text-xs text-[#667085]">{{ f.vehicleLabel }}</td>
                    <td>{{ f.odometerKm | number:'1.0-0' }}</td>
                    <td class="hidden md:table-cell">{{ f.totalLiters | number:'1.2-3' }} L</td>
                    <td class="hidden md:table-cell">{{ f.pricePerLiter | currencyBrl }}</td>
                    <td>{{ f.totalCost | currencyBrl }}</td>
                    <td class="hidden sm:table-cell">
                      <span class="ta-badge ta-badge-info">{{ f.fuelType }}</span>
                    </td>
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
export class FuelReportComponent {
  private readonly reportService = inject(ReportService);
  readonly vehicles = inject(VehicleService).vehicles;

  readonly report = signal<FuelReport | null>(null);
  readonly loading = signal(false);
  selectedVehicleId = '';
  private from = '';
  private to = '';

  onDateChange(range: DateRange) {
    this.from = range.from;
    this.to = range.to;
    this.load();
  }

  load() {
    this.loading.set(true);
    this.reportService.fuel(this.selectedVehicleId || undefined, this.from, this.to).subscribe({
      next: data => { this.report.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
