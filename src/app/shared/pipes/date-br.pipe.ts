import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateBr', pure: true, standalone: true })
export class DateBrPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '-';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
}
