import { Component, inject, signal, OnInit, ChangeDetectionStrategy, input } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-lg mx-auto">
      <h1 class="ta-page-title mb-6">
        {{ (id() ? 'vehicles.edit' : 'vehicles.add') | transloco }}
      </h1>

      <div class="ta-card">
        <div class="p-6">
          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            @if (error()) {
              <div class="alert alert-error text-sm">{{ error() }}</div>
            }

            <div class="grid grid-cols-2 gap-4">
              <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ 'vehicles.brand' | transloco }}</legend>
                <input type="text" formControlName="brand" class="input w-full" />
              </fieldset>
              <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ 'vehicles.model' | transloco }}</legend>
                <input type="text" formControlName="model" class="input w-full" />
              </fieldset>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ 'vehicles.year' | transloco }}</legend>
                <input type="number" formControlName="year" class="input w-full" min="1900" max="2099" />
              </fieldset>
              <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ 'vehicles.plate' | transloco }}</legend>
                <input type="text" formControlName="plate" class="input w-full" />
              </fieldset>
            </div>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">{{ 'vehicles.fuelType' | transloco }}</legend>
              <select formControlName="fuelType" class="select w-full">
                <option value="flex">Flex (Gasolina/Etanol)</option>
                <option value="gasoline">Gasolina</option>
                <option value="ethanol">Etanol</option>
                <option value="diesel">Diesel</option>
              </select>
            </fieldset>

            <div class="flex gap-2 justify-end pt-2">
              <button type="button" class="ta-btn ta-btn-ghost" (click)="back()">
                {{ 'common.cancel' | transloco }}
              </button>
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
export class VehicleFormComponent implements OnInit {
  readonly id = input<string | null>(null);

  private readonly vehicleService = inject(VehicleService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: [null as number | null],
    plate: [''],
    fuelType: ['flex', Validators.required],
  });

  readonly loading = signal(false);
  readonly error = signal('');

  ngOnInit() {
    const id = this.id();
    if (id) {
      const v = this.vehicleService.vehicles().find(v => v.id === id);
      if (v) this.form.patchValue(v);
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const data = this.form.getRawValue() as any;
    const id = this.id();
    const obs = id
      ? this.vehicleService.update(id, data)
      : this.vehicleService.create(data);
    obs.subscribe({
      next: () => { this.vehicleService.load(); this.router.navigate(['/vehicles']); },
      error: (err) => { this.error.set(err?.error?.message ?? 'Save failed'); this.loading.set(false); },
    });
  }

  back() { this.router.navigate(['/vehicles']); }
}
