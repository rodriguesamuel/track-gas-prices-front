import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DecimalPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { FuelService } from '../../../core/services/fuel.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { FuelFillUp } from '../../../core/models';
import { CurrencyBrlPipe } from '../../../shared/pipes/currency-brl.pipe';
import { KmPerLiterPipe } from '../../../shared/pipes/km-per-liter.pipe';
import { DateBrPipe } from '../../../shared/pipes/date-br.pipe';
import { DateFilterComponent, DateRange } from '../../../shared/components/date-filter/date-filter.component';

@Component({
  selector: 'app-fuel-list',
  standalone: true,
  imports: [RouterLink, FormsModule, ScrollingModule, TranslocoPipe, DecimalPipe,
    CurrencyBrlPipe, DateBrPipe, DateFilterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 class="ta-page-title">{{ 'fuel.title' | transloco }}</h1>
        <a routerLink="/fuel/new" class="ta-btn ta-btn-primary ta-btn-sm">+ {{ 'fuel.addFillUp' | transloco }}</a>
      </div>

      <!-- Filters -->
      <div class="ta-card mb-4">
        <div class="p-4 flex flex-wrap gap-4 items-end">
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs">{{ 'common.vehicle' | transloco }}</legend>
            <select class="select select-sm" [(ngModel)]="selectedVehicleId" (change)="loadData()">
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
      } @else if (fillUps().length === 0) {
        <div class="ta-card text-center py-12">
          <p class="text-[#667085]">{{ 'common.noData' | transloco }}</p>
        </div>
      } @else {
        <!-- Virtual scroll for long lists -->
        <cdk-virtual-scroll-viewport itemSize="72" class="h-[60vh] rounded-2xl overflow-hidden" style="box-shadow:var(--shadow-theme-sm)">
          <div class="overflow-x-auto bg-white">
            <table class="ta-table">
              <thead class="sticky top-0 bg-white z-10">
                <tr>
                  <th>{{ 'common.date' | transloco }}</th>
                  <th class="hidden sm:table-cell">{{ 'common.vehicle' | transloco }}</th>
                  <th>{{ 'fuel.odometerKm' | transloco }}</th>
                  <th class="hidden md:table-cell">{{ 'fuel.liters' | transloco }}</th>
                  <th class="hidden md:table-cell">{{ 'fuel.pricePerLiter' | transloco }}</th>
                  <th>{{ 'fuel.totalCost' | transloco }}</th>
                  <th class="hidden sm:table-cell">{{ 'fuel.fuelType' | transloco }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (f of fillUps(); track f.id) {
                  <tr class="hover">
                    <td>{{ f.date | dateBr }}</td>
                    <td class="hidden sm:table-cell text-xs text-[#667085]">{{ f.vehicleLabel }}</td>
                    <td>{{ f.odometerKm | number:'1.0-0' }} km</td>
                    <td class="hidden md:table-cell">{{ f.totalLiters | number:'1.2-3' }} L</td>
                    <td class="hidden md:table-cell">{{ f.pricePerLiter | currencyBrl }}</td>
                    <td class="font-medium">{{ f.totalCost | currencyBrl }}</td>
                    <td class="hidden sm:table-cell">
                      <span class="ta-badge" [class.ta-badge-warning]="f.fuelType === 'ethanol'" [class.ta-badge-info]="f.fuelType === 'gasoline'" [class.ta-badge-neutral]="f.fuelType === 'diesel'">
                        {{ f.fuelType }}
                      </span>
                    </td>
                    <td>
                      <a [routerLink]="['/fuel', f.id, 'edit']" class="ta-btn ta-btn-ghost ta-btn-xs">✏️</a>
                      <button class="ta-btn ta-btn-ghost ta-btn-xs text-[#d92d20]" (click)="delete(f)">🗑</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </cdk-virtual-scroll-viewport>
      }
    </div>
  `,
})
export class FuelListComponent implements OnInit {
  private readonly fuelService = inject(FuelService);
  readonly vehicles = inject(VehicleService).vehicles;

  readonly fillUps = signal<FuelFillUp[]>([]);
  readonly loading = signal(false);

  selectedVehicleId = '';
  private from = '';
  private to = '';

  ngOnInit() { /* DateFilter emits on init and triggers loadData */ }

  onDateChange(range: DateRange) {
    this.from = range.from;
    this.to = range.to;
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.fuelService.list(this.selectedVehicleId || undefined, this.from, this.to).subscribe({
      next: data => { this.fillUps.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  delete(f: FuelFillUp) {
    if (!confirm('Delete this fill-up?')) return;
    this.fuelService.delete(f.id).subscribe(() => this.loadData());
  }
}
