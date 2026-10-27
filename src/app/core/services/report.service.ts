import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConsolidatedReport, FuelReport, MaintenanceReport } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);

  private params(vehicleId?: string, from?: string, to?: string): HttpParams {
    let p = new HttpParams();
    if (vehicleId) p = p.set('vehicleId', vehicleId);
    if (from) p = p.set('from', from);
    if (to) p = p.set('to', to);
    return p;
  }

  fuel(vehicleId?: string, from?: string, to?: string) {
    return this.http.get<FuelReport>(`${environment.apiUrl}/reports/fuel`, { params: this.params(vehicleId, from, to) });
  }

  maintenance(vehicleId?: string, from?: string, to?: string) {
    return this.http.get<MaintenanceReport>(`${environment.apiUrl}/reports/maintenance`, { params: this.params(vehicleId, from, to) });
  }

  consolidated(vehicleId?: string, from?: string, to?: string) {
    return this.http.get<ConsolidatedReport>(`${environment.apiUrl}/reports/consolidated`, { params: this.params(vehicleId, from, to) });
  }
}
