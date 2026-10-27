import { Component, inject, signal, OnInit, ChangeDetectionStrategy, input, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { FuelService } from '../../../core/services/fuel.service';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-fuel-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-lg mx-auto">
      <h1 class="ta-page-title mb-6">{{ (id() ? 'fuel.editFillUp' : 'fuel.addFillUp') | transloco }}</h1>
      <div class="ta-card">
        <div class="p-6">
          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            @if (error()) { <div class="alert alert-error text-sm">{{ error() }}</div> }

            <fieldset class="fieldset">
              <legend class="fieldset-legend">{{ 'common.vehicle' | transloco }}</legend>
              <select formControlName="vehicleId" class="select w-full">
                @for (v of vehicles(); track v.id) {
                  <option [value]="v.id">{{ v.brand }} {{ v.model }}</option>
                }
              </select>
            </fieldset>

            <div class="grid grid-cols-2 gap-4">
              <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ 'common.date' | transloco }}</legend>
                <input type="date" formControlName="date" class="input w-full" />
              </fieldset>
              <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ 'fuel.odometerKm' | transloco }}</legend>
                <input type="number" formControlName="odometerKm" class="input w-full" step="0.01" />
              </fieldset>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ 'fuel.liters' | transloco }}</legend>
                <input type="number" formControlName="totalLiters" class="input w-full" step="0.001" />
              </fieldset>
              <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ 'fuel.pricePerLiter' | transloco }}</legend>
                <input type="number" formControlName="pricePerLiter" class="input w-full" step="0.001" />
              </fieldset>
            </div>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">{{ 'fuel.fuelType' | transloco }}</legend>
              <select formControlName="fuelType" class="select w-full">
                <option value="gasoline">{{ 'fuel.gasoline' | transloco }}</option>
                <option value="ethanol">{{ 'fuel.ethanol' | transloco }}</option>
                <option value="diesel">Diesel</option>
              </select>
            </fieldset>

            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" formControlName="fullTank" class="checkbox checkbox-primary" />
              <span class="text-sm">{{ 'fuel.fullTank' | transloco }}</span>
            </label>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">{{ 'common.notes' | transloco }}</legend>
              <textarea formControlName="notes" class="textarea w-full" rows="2"></textarea>
            </fieldset>

            <div class="flex gap-2 justify-end pt-2">
              <button type="button" class="ta-btn ta-btn-ghost" (click)="back()">{{ 'common.cancel' | transloco }}</button>
              <button type="submit" class="ta-btn ta-btn-primary" [disabled]="loading()">
                @if (loading()) { <span class="loading loading-spinner loading-sm"></span> }
                {{ 'common.save' | transloco }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class FuelFormComponent implements OnInit {
  readonly id = input<string | null>(null);

  private readonly fuelService = inject(FuelService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly vehicles = inject(VehicleService).vehicles;

  readonly form = this.fb.group({
    vehicleId: ['', Validators.required],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    odometerKm: [null as number | null, [Validators.required, Validators.min(0.01)]],
    totalLiters: [null as number | null, [Validators.required, Validators.min(0.001)]],
    pricePerLiter: [null as number | null, [Validators.required, Validators.min(0.01)]],
    fuelType: ['gasoline', Validators.required],
    fullTank: [true],
    notes: [''],
  });

  readonly loading = signal(false);
  readonly error = signal('');

  constructor() {
    // In create mode, set default vehicle reactively once vehicles load
    effect(() => {
      const vs = this.vehicles();
      if (!this.id() && vs.length > 0 && !this.form.value.vehicleId) {
        this.form.patchValue({ vehicleId: vs[0].id });
      }
    });
  }

  ngOnInit() {
    const id = this.id();
    if (id) {
      this.loading.set(true);
      this.fuelService.findById(id).subscribe({
        next: f => {
          this.form.patchValue({
            vehicleId: f.vehicleId,
            date: f.date,
            odometerKm: f.odometerKm,
            totalLiters: f.totalLiters,
            pricePerLiter: f.pricePerLiter,
            fuelType: f.fuelType,
            fullTank: f.fullTank,
            notes: f.notes ?? '',
          });
          this.loading.set(false);
        },
        error: () => { this.error.set('Failed to load fill-up'); this.loading.set(false); },
      });
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const data = this.form.getRawValue() as any;
    const obs = this.id()
      ? this.fuelService.update(this.id()!, data)
      : this.fuelService.create(data);
    obs.subscribe({
      next: () => this.router.navigate(['/fuel']),
      error: (err) => { this.error.set(err?.error?.message ?? 'Save failed'); this.loading.set(false); },
    });
  }

  back() { this.router.navigate(['/fuel']); }
}
