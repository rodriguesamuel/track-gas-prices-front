import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { MaintenanceSchedule, MaintenanceExpense, MaintenanceTemplate } from '../../../core/models';
import { DateBrPipe } from '../../../shared/pipes/date-br.pipe';
import { CurrencyBrlPipe } from '../../../shared/pipes/currency-brl.pipe';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, TranslocoPipe, DateBrPipe, DecimalPipe, CurrencyBrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto">

      <!-- Header -->
      <div class="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 class="ta-page-title">{{ 'maintenance.pageTitle' | transloco }}</h1>
        <div class="flex gap-2">
          <a routerLink="/maintenance/expense/new" class="ta-btn ta-btn-secondary ta-btn-sm">
            + {{ 'maintenance.addExpense' | transloco }}
          </a>
          <button class="ta-btn ta-btn-primary ta-btn-sm" (click)="openAddSchedule()">
            + {{ 'maintenance.addSchedule' | transloco }}
          </button>
        </div>
      </div>

      <!-- Vehicle filter (shared) -->
      <div class="mb-6">
        <select class="select select-sm" [(ngModel)]="selectedVehicleId" (change)="loadAll()">
          <option value="">{{ 'common.all' | transloco }}</option>
          @for (v of vehicles(); track v.id) {
            <option [value]="v.id">{{ v.brand }} {{ v.model }}</option>
          }
        </select>
      </div>

      <!-- ======= AGENDA (Schedules) ======= -->
      <div class="mb-8">
        <h2 class="text-base font-semibold text-[#101828] mb-3">{{ 'maintenance.schedulesSection' | transloco }}</h2>

        <!-- Add / Edit schedule form (inline) -->
        @if (showScheduleForm()) {
          <div class="ta-card mb-4">
            <div class="p-5">
              <h3 class="font-semibold text-[#101828] mb-3">
                {{ editingScheduleId() ? ('maintenance.editSchedule' | transloco) : ('maintenance.addSchedule' | transloco) }}
              </h3>
              <form [formGroup]="scheduleForm" (ngSubmit)="submitSchedule()" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <fieldset class="fieldset">
                  <legend class="fieldset-legend text-xs">{{ 'common.vehicle' | transloco }}</legend>
                  <select formControlName="vehicleId" class="select select-sm w-full">
                    @for (v of vehicles(); track v.id) {
                      <option [value]="v.id">{{ v.brand }} {{ v.model }}</option>
                    }
                  </select>
                </fieldset>
                <fieldset class="fieldset">
                  <legend class="fieldset-legend text-xs">{{ 'maintenance.type' | transloco }}</legend>
                  <select formControlName="type" class="select select-sm w-full" (change)="applyTemplate()">
                    @for (t of templates(); track t.type) {
                      <option [value]="t.type">{{ t.label }}</option>
                    }
                  </select>
                </fieldset>
                <fieldset class="fieldset">
                  <legend class="fieldset-legend text-xs">{{ 'maintenance.nextKm' | transloco }}</legend>
                  <input type="number" formControlName="nextKm" class="input input-sm w-full" step="100" />
                </fieldset>
                <fieldset class="fieldset">
                  <legend class="fieldset-legend text-xs">{{ 'maintenance.nextDate' | transloco }}</legend>
                  <input type="date" formControlName="nextDate" class="input input-sm w-full" />
                </fieldset>
                <div class="sm:col-span-2 flex gap-2 justify-end">
                  <button type="button" class="ta-btn ta-btn-ghost ta-btn-sm" (click)="cancelScheduleForm()">
                    {{ 'common.cancel' | transloco }}
                  </button>
                  <button type="submit" class="ta-btn ta-btn-primary ta-btn-sm">{{ 'common.save' | transloco }}</button>
                </div>
              </form>
            </div>
          </div>
        }

        <!-- Schedule list -->
        @if (loadingSchedules()) {
          <div class="flex justify-center py-8"><span class="loading loading-spinner loading-lg"></span></div>
        } @else if (schedules().length === 0) {
          <div class="ta-card text-center py-8">
            <p class="text-[#667085]">{{ 'common.noData' | transloco }}</p>
          </div>
        } @else {
          <div class="grid gap-3">
            @for (s of schedules(); track s.id) {
              <div class="ta-card hover:shadow-md transition-shadow">
                <div class="p-4 flex flex-row items-center justify-between flex-wrap gap-2">
                  <div>
                    <p class="font-semibold text-sm text-[#101828]">{{ s.type }}</p>
                    <p class="text-xs text-[#667085]">{{ s.vehicleLabel }}</p>
                    @if (s.description) {
                      <p class="text-xs text-[#667085]">{{ s.description }}</p>
                    }
                  </div>
                  <div class="flex gap-4 text-center">
                    @if (s.nextKm) {
                      <div>
                        <p class="text-xs text-[#667085]">{{ 'maintenance.nextKm' | transloco }}</p>
                        <p class="font-bold text-[#465fff]">{{ s.nextKm | number:'1.0-0' }} km</p>
                      </div>
                    }
                    @if (s.nextDate) {
                      <div>
                        <p class="text-xs text-[#667085]">{{ 'maintenance.nextDate' | transloco }}</p>
                        <p class="font-bold text-[#465fff]">{{ s.nextDate | dateBr }}</p>
                      </div>
                    }
                  </div>
                  <div class="flex gap-1">
                    <button class="ta-btn ta-btn-ghost ta-btn-xs" (click)="editSchedule(s)" [title]="'common.edit' | transloco">✏️</button>
                    <button class="ta-btn ta-btn-ghost ta-btn-xs text-[#d92d20]" (click)="deleteSchedule(s)" [title]="'common.delete' | transloco">🗑</button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- ======= MANUTENÇÕES (Expenses) ======= -->
      <div>
        <h2 class="text-base font-semibold text-[#101828] mb-3">{{ 'maintenance.expensesSection' | transloco }}</h2>

        <!-- Date range filter -->
        <div class="flex flex-wrap items-end gap-3 mb-4">
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs">{{ 'common.from' | transloco }}</legend>
            <input type="date" class="input input-sm" [(ngModel)]="fromDate" (change)="loadExpenses()" />
          </fieldset>
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs">{{ 'common.to' | transloco }}</legend>
            <input type="date" class="input input-sm" [(ngModel)]="toDate" (change)="loadExpenses()" />
          </fieldset>
          @if (fromDate || toDate) {
            <button class="ta-btn ta-btn-ghost ta-btn-sm mb-1" (click)="clearDateFilter()">
              {{ 'maintenance.clearFilter' | transloco }}
            </button>
          }
        </div>

        <!-- Expense list -->
        @if (loadingExpenses()) {
          <div class="flex justify-center py-8"><span class="loading loading-spinner loading-lg"></span></div>
        } @else if (expenses().length === 0) {
          <div class="ta-card text-center py-8">
            <p class="text-[#667085]">{{ 'common.noData' | transloco }}</p>
          </div>
        } @else {
          <div class="grid gap-3">
            @for (e of expenses(); track e.id) {
              <div class="ta-card hover:shadow-md transition-shadow">
                <div class="p-4 flex flex-row items-center justify-between flex-wrap gap-2">
                  <div>
                    <p class="font-semibold text-sm text-[#101828]">{{ e.description }}</p>
                    <p class="text-xs text-[#667085]">{{ e.vehicleLabel }} · {{ e.date | dateBr }}</p>
                    <p class="text-xs text-[#667085]">{{ e.category }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-[#465fff]">{{ e.cost | currencyBrl }}</p>
                    @if (e.odometerKm) {
                      <p class="text-xs text-[#667085]">{{ e.odometerKm | number:'1.0-0' }} km</p>
                    }
                  </div>
                  <div class="flex gap-1">
                    <a [routerLink]="['/maintenance/expense', e.id, 'edit']" class="ta-btn ta-btn-ghost ta-btn-xs" [title]="'common.edit' | transloco">✏️</a>
                    <button class="ta-btn ta-btn-ghost ta-btn-xs text-[#d92d20]" (click)="deleteExpense(e)" [title]="'common.delete' | transloco">🗑</button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

    </div>
  `,
})
export class ScheduleComponent implements OnInit {
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly http = inject(HttpClient);
  readonly vehicles = inject(VehicleService).vehicles;
  private readonly fb = inject(FormBuilder);

  readonly schedules = signal<MaintenanceSchedule[]>([]);
  readonly expenses = signal<MaintenanceExpense[]>([]);
  readonly templates = signal<MaintenanceTemplate[]>([]);
  readonly loadingSchedules = signal(false);
  readonly loadingExpenses = signal(false);
  readonly showScheduleForm = signal(false);
  readonly editingScheduleId = signal<string | null>(null);

  selectedVehicleId = '';
  fromDate = '';
  toDate = '';

  readonly scheduleForm = this.fb.group({
    vehicleId: ['', Validators.required],
    type: ['oil_change', Validators.required],
    description: [''],
    nextKm: [null as number | null],
    nextDate: [null as string | null],
    intervalKm: [null as number | null],
    intervalMonths: [null as number | null],
  });

  ngOnInit() {
    this.http.get<{ templates: MaintenanceTemplate[] }>('/assets/data/maintenance-templates.json')
      .subscribe(data => this.templates.set(data.templates));
    if (this.vehicles().length > 0) {
      this.scheduleForm.patchValue({ vehicleId: this.vehicles()[0].id });
    }
    this.loadAll();
  }

  loadAll() {
    this.loadSchedules();
    this.loadExpenses();
  }

  loadSchedules() {
    this.loadingSchedules.set(true);
    this.maintenanceService.listSchedules(this.selectedVehicleId || undefined).subscribe({
      next: data => { this.schedules.set(data); this.loadingSchedules.set(false); },
      error: () => this.loadingSchedules.set(false),
    });
  }

  loadExpenses() {
    this.loadingExpenses.set(true);
    this.maintenanceService.listExpenses(
      this.selectedVehicleId || undefined,
      this.fromDate || undefined,
      this.toDate || undefined,
    ).subscribe({
      next: data => { this.expenses.set(data); this.loadingExpenses.set(false); },
      error: () => this.loadingExpenses.set(false),
    });
  }

  clearDateFilter() {
    this.fromDate = '';
    this.toDate = '';
    this.loadExpenses();
  }

  applyTemplate() {
    const type = this.scheduleForm.get('type')?.value;
    const t = this.templates().find(t => t.type === type);
    if (t) {
      this.scheduleForm.patchValue({ intervalKm: t.defaultIntervalKm, intervalMonths: t.defaultIntervalMonths });
    }
  }

  openAddSchedule() {
    this.editingScheduleId.set(null);
    this.scheduleForm.reset({ vehicleId: this.vehicles()[0]?.id ?? '', type: 'oil_change' });
    this.showScheduleForm.set(true);
  }

  editSchedule(s: MaintenanceSchedule) {
    this.editingScheduleId.set(s.id);
    this.scheduleForm.patchValue({
      vehicleId: s.vehicleId,
      type: s.type,
      description: s.description ?? '',
      nextKm: s.nextKm,
      nextDate: s.nextDate,
      intervalKm: s.intervalKm,
      intervalMonths: s.intervalMonths,
    });
    this.showScheduleForm.set(true);
  }

  cancelScheduleForm() {
    this.showScheduleForm.set(false);
    this.editingScheduleId.set(null);
  }

  submitSchedule() {
    if (this.scheduleForm.invalid) return;
    const data = this.scheduleForm.getRawValue() as any;
    const editId = this.editingScheduleId();
    const obs = editId
      ? this.maintenanceService.updateSchedule(editId, data)
      : this.maintenanceService.createSchedule(data);
    obs.subscribe(() => { this.cancelScheduleForm(); this.loadSchedules(); });
  }

  deleteSchedule(s: MaintenanceSchedule) {
    if (!confirm('Excluir esta agenda?')) return;
    this.maintenanceService.deleteSchedule(s.id).subscribe(() => this.loadSchedules());
  }

  deleteExpense(e: MaintenanceExpense) {
    if (!confirm('Excluir esta manutenção?')) return;
    this.maintenanceService.deleteExpense(e.id).subscribe(() => this.loadExpenses());
  }
}
