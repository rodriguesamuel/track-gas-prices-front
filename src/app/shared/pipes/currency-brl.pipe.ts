import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyBrl', pure: true, standalone: true })
export class CurrencyBrlPipe implements PipeTransform {
  transform(value: number | null | undefined, currency = 'BRL'): string {
    if (value == null) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
  }
}
