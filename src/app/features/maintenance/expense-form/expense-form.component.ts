import { Component, inject, signal, OnInit, ChangeDetectionStrategy, input, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-lg mx-auto">
      <h1 class="ta-page-title mb-6">{{ 'maintenance.addExpense' | transloco }}</h1>
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
                <legend class="fieldset-legend">{{ 'maintenance.category' | transloco }}</legend>
                <select formControlName="category" class="select w-full">
                  <option value="oil">{{ 'maintenance.catOil' | transloco }}</option>
                  <option value="maintenance">{{ 'maintenance.catMaintenance' | transloco }}</option>
                  <option value="parts">{{ 'maintenance.catParts' | transloco }}</option>
                  <option value="tire">{{ 'maintenance.catTire' | transloco }}</option>
                  <option value="other">{{ 'maintenance.catOther' | transloco }}</option>
                </select>
              </fieldset>
            </div>

            <fieldset class="fieldset">
              <legend class="fieldset-legend">{{ 'maintenance.description' | transloco }}</legend>
              <input type="text" formControlName="description" class="input w-full" />
            </fieldset>

            <div class="grid grid-cols-2 gap-4">
              <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ 'maintenance.cost' | transloco }}</legend>
                <input type="number" formControlName="cost" class="input w-full" step="0.01" />
              </fieldset>
              <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ 'fuel.odometerKm' | transloco }}</legend>
                <input type="number" formControlName="odometerKm" class="input w-full" step="0.01" />
              </fieldset>
            </div>

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
export class ExpenseFormComponent implements OnInit {
  readonly id = input<string | null>(null);

  private readonly maintenanceService = inject(MaintenanceService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly vehicles = inject(VehicleService).vehicles;

  readonly form = this.fb.group({
    vehicleId: ['', Validators.required],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    category: ['maintenance', Validators.required],
    description: ['', Validators.required],
    cost: [null as number | null, [Validators.required, Validators.min(0.01)]],
    odometerKm: [null as number | null],
    notes: [''],
  });

  readonly loading = signal(false);
  readonly error = signal('');

  constructor() {
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
      this.maintenanceService.findExpenseById(id).subscribe({
        next: e => {
          this.form.patchValue({
            vehicleId: e.vehicleId,
            date: e.date,
            category: e.category,
            description: e.description,
            cost: e.cost,
            odometerKm: e.odometerKm ?? null,
            notes: e.notes ?? '',
          });
          this.loading.set(false);
        },
        error: () => { this.error.set('Failed to load expense'); this.loading.set(false); },
      });
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const data = this.form.getRawValue() as any;
    const obs = this.id()
      ? this.maintenanceService.updateExpense(this.id()!, data)
      : this.maintenanceService.createExpense(data);
    obs.subscribe({
      next: () => this.router.navigate(['/maintenance']),
      error: (err) => { this.error.set(err?.error?.message ?? 'Save failed'); this.loading.set(false); },
    });
  }

  back() { this.router.navigate(['/maintenance']); }
}
