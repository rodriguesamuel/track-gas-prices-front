import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FuelFillUp } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FuelService {
  private readonly http = inject(HttpClient);

  findById(id: string) {
    return this.http.get<FuelFillUp>(`${environment.apiUrl}/fuel-fillups/${id}`);
  }

  list(vehicleId?: string, from?: string, to?: string) {
    let params = new HttpParams();
    if (vehicleId) params = params.set('vehicleId', vehicleId);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<FuelFillUp[]>(`${environment.apiUrl}/fuel-fillups`, { params });
  }

  create(data: Partial<FuelFillUp> & { vehicleId: string }) {
    return this.http.post<FuelFillUp>(`${environment.apiUrl}/fuel-fillups`, data);
  }

  update(id: string, data: Partial<FuelFillUp> & { vehicleId: string }) {
    return this.http.put<FuelFillUp>(`${environment.apiUrl}/fuel-fillups/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/fuel-fillups/${id}`);
  }
}
