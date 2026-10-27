import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'fuel', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'vehicles',
        loadComponent: () => import('./features/vehicles/vehicle-list/vehicle-list.component').then(m => m.VehicleListComponent),
      },
      {
        path: 'vehicles/new',
        loadComponent: () => import('./features/vehicles/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent),
      },
      {
        path: 'vehicles/:id/edit',
        loadComponent: () => import('./features/vehicles/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent),
      },
      {
        path: 'fuel',
        loadComponent: () => import('./features/fuel/fuel-list/fuel-list.component').then(m => m.FuelListComponent),
      },
      {
        path: 'fuel/new',
        loadComponent: () => import('./features/fuel/fuel-form/fuel-form.component').then(m => m.FuelFormComponent),
      },
      {
        path: 'fuel/:id/edit',
        loadComponent: () => import('./features/fuel/fuel-form/fuel-form.component').then(m => m.FuelFormComponent),
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./features/maintenance/schedule/schedule.component').then(m => m.ScheduleComponent),
      },
      {
        path: 'maintenance/expense/new',
        loadComponent: () => import('./features/maintenance/expense-form/expense-form.component').then(m => m.ExpenseFormComponent),
      },
      {
        path: 'maintenance/expense/:id/edit',
        loadComponent: () => import('./features/maintenance/expense-form/expense-form.component').then(m => m.ExpenseFormComponent),
      },
      {
        path: 'reports/fuel',
        loadComponent: () => import('./features/reports/fuel-report/fuel-report.component').then(m => m.FuelReportComponent),
      },
      {
        path: 'reports/maintenance',
        loadComponent: () => import('./features/reports/maintenance-report/maintenance-report.component').then(m => m.MaintenanceReportComponent),
      },
      {
        path: 'reports/consolidated',
        loadComponent: () => import('./features/reports/consolidated-report/consolidated-report.component').then(m => m.ConsolidatedReportComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'fuel' },
];
