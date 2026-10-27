import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [RouterLink, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-4">
        <h1 class="ta-page-title">{{ 'vehicles.title' | transloco }}</h1>
        <a routerLink="/vehicles/new" class="ta-btn ta-btn-primary ta-btn-sm">
          + {{ 'vehicles.add' | transloco }}
        </a>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-8"><span class="loading loading-spinner loading-lg"></span></div>
      } @else if (vehicles().length === 0) {
        <div class="ta-card text-center py-12">
          <p class="text-[#667085]">{{ 'common.noData' | transloco }}</p>
          <a routerLink="/vehicles/new" class="ta-btn ta-btn-primary ta-btn-sm mt-4 mx-auto">
            {{ 'vehicles.addFirst' | transloco }}
          </a>
        </div>
      } @else {
        <div class="grid gap-3">
          @for (v of vehicles(); track v.id) {
            <div class="ta-card hover:shadow-md transition-shadow">
              <div class="p-4 flex flex-row items-center justify-between gap-2">
                <div>
                  <p class="font-semibold text-[#101828]">{{ v.brand }} {{ v.model }}</p>
                  <p class="text-sm text-[#667085]">
                    {{ v.year ?? '-' }} · {{ v.plate ?? '-' }} · {{ v.fuelType }}
                  </p>
                </div>
                <div class="flex gap-2">
                  <a [routerLink]="['/vehicles', v.id, 'edit']" class="ta-btn ta-btn-ghost ta-btn-xs">
                    {{ 'common.edit' | transloco }}
                  </a>
                  <button class="ta-btn ta-btn-ghost ta-btn-xs text-[#d92d20]" (click)="confirmDelete(v)">
                    {{ 'common.delete' | transloco }}
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class VehicleListComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);

  readonly vehicles = this.vehicleService.vehicles;
  readonly loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this.vehicleService.load();
    this.loading.set(false);
  }

  confirmDelete(v: Vehicle) {
    if (!confirm(`Delete ${v.brand} ${v.model}?`)) return;
    this.vehicleService.delete(v.id).subscribe(() => this.vehicleService.load());
  }
}
