import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ReportService } from '../../../core/services/report.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { ConsolidatedReport } from '../../../core/models';
import { CurrencyBrlPipe } from '../../../shared/pipes/currency-brl.pipe';
import { DateFilterComponent, DateRange } from '../../../shared/components/date-filter/date-filter.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-consolidated-report',
  standalone: true,
  imports: [FormsModule, TranslocoPipe, CurrencyBrlPipe, DateFilterComponent, StatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="ta-page-title mb-6">{{ 'reports.consolidatedTitle' | transloco }}</h1>

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
            [title]="'reports.grandTotal' | transloco"
            [value]="(report()!.grandTotal | currencyBrl) ?? ''"
          />
          <app-stat-card
            [title]="'reports.totalFuelCost' | transloco"
            [value]="(report()!.totalFuelCost | currencyBrl) ?? ''"
          />
          <app-stat-card
            [title]="'reports.totalMaintenanceCost' | transloco"
            [value]="(report()!.totalMaintenanceCost | currencyBrl) ?? ''"
          />
          <app-stat-card
            [title]="'reports.allInCostPerKm' | transloco"
            [value]="(report()!.allInCostPerKm | currencyBrl) ?? ''"
            [desc]="'/' + ('fuel.odometerKm' | transloco)"
          />
        </div>

        @defer (on viewport) {
          <!-- Breakdown chart (bar visualization) -->
          <div class="ta-card p-6">
            <h3 class="font-semibold text-[#101828] mb-4">{{ 'reports.breakdown' | transloco }}</h3>
            @if (report()!.grandTotal > 0) {
              <div class="space-y-3">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>{{ 'reports.totalFuelCost' | transloco }}</span>
                    <span>{{ report()!.totalFuelCost | currencyBrl }}</span>
                  </div>
                  <div class="w-full bg-[#f2f4f7] rounded-full h-3">
                    <div class="bg-[#465fff] h-3 rounded-full"
                         [style.width.%]="(report()!.totalFuelCost / report()!.grandTotal) * 100"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>{{ 'reports.totalMaintenanceCost' | transloco }}</span>
                    <span>{{ report()!.totalMaintenanceCost | currencyBrl }}</span>
                  </div>
                  <div class="w-full bg-[#f2f4f7] rounded-full h-3">
                    <div class="bg-[#667085] h-3 rounded-full"
                         [style.width.%]="(report()!.totalMaintenanceCost / report()!.grandTotal) * 100"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @placeholder {
          <div class="skeleton h-32 w-full rounded-box"></div>
        }
      }
    </div>
  `,
})
export class ConsolidatedReportComponent {
  private readonly reportService = inject(ReportService);
  readonly vehicles = inject(VehicleService).vehicles;

  readonly report = signal<ConsolidatedReport | null>(null);
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
    this.reportService.consolidated(this.selectedVehicleId || undefined, this.from, this.to).subscribe({
      next: data => { this.report.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
