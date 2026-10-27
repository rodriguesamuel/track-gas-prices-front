import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'kmPerLiter', pure: true, standalone: true })
export class KmPerLiterPipe implements PipeTransform {
  transform(value: number | null | undefined, decimals = 2): string {
    if (value == null || value === 0) return '-';
    return `${value.toFixed(decimals)} km/L`;
  }
}
