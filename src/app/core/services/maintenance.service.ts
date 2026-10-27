import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MaintenanceExpense, MaintenanceSchedule } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly http = inject(HttpClient);

  listSchedules(vehicleId?: string) {
    let params = new HttpParams();
    if (vehicleId) params = params.set('vehicleId', vehicleId);
    return this.http.get<MaintenanceSchedule[]>(`${environment.apiUrl}/maintenance/schedules`, { params });
  }

  createSchedule(data: Partial<MaintenanceSchedule> & { vehicleId: string }) {
    return this.http.post<MaintenanceSchedule>(`${environment.apiUrl}/maintenance/schedules`, data);
  }

  updateSchedule(id: string, data: Partial<MaintenanceSchedule> & { vehicleId: string }) {
    return this.http.put<MaintenanceSchedule>(`${environment.apiUrl}/maintenance/schedules/${id}`, data);
  }

  deleteSchedule(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/maintenance/schedules/${id}`);
  }

  listExpenses(vehicleId?: string, from?: string, to?: string) {
    let params = new HttpParams();
    if (vehicleId) params = params.set('vehicleId', vehicleId);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<MaintenanceExpense[]>(`${environment.apiUrl}/maintenance/expenses`, { params });
  }

  findExpenseById(id: string) {
    return this.http.get<MaintenanceExpense>(`${environment.apiUrl}/maintenance/expenses/${id}`);
  }

  createExpense(data: Partial<MaintenanceExpense> & { vehicleId: string }) {
    return this.http.post<MaintenanceExpense>(`${environment.apiUrl}/maintenance/expenses`, data);
  }

  updateExpense(id: string, data: Partial<MaintenanceExpense> & { vehicleId: string }) {
    return this.http.put<MaintenanceExpense>(`${environment.apiUrl}/maintenance/expenses/${id}`, data);
  }

  deleteExpense(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/maintenance/expenses/${id}`);
  }
}
