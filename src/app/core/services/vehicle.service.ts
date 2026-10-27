import { Injectable, inject, signal, DestroyRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Vehicle } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _vehicles = signal<Vehicle[]>([]);

  readonly vehicles = this._vehicles.asReadonly();

  constructor() {
    if (this.isBrowser) {
      this.load();
    }
  }

  load() {
    this.http.get<Vehicle[]>(`${environment.apiUrl}/vehicles`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(v => this._vehicles.set(v));
  }

  create(data: Partial<Vehicle>) {
    return this.http.post<Vehicle>(`${environment.apiUrl}/vehicles`, data);
  }

  update(id: string, data: Partial<Vehicle>) {
    return this.http.put<Vehicle>(`${environment.apiUrl}/vehicles/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/vehicles/${id}`);
  }
}
