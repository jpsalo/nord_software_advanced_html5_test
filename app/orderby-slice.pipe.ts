import { Pipe, PipeTransform } from '@angular/core';
import { Person } from './person';

@Pipe({ name: 'orderByAndSlice' })
export class OrderByAndSlicePipe implements PipeTransform {
  transform(persons: Person[],
            value: string,
            ascending: boolean,
            page: number,
            visibleItems: number): Person[] {
    let resultArray: Person[];

    function parseValue(value) {
      return typeof value === 'string' ? value.toLowerCase() : value;
    }

    if (value) {
      if (ascending) {
        resultArray = persons.sort(function(a, b) {
          if (parseValue(a[value]) < parseValue(b[value])) return -1;
          if (parseValue(a[value]) > parseValue(b[value])) return 1;
          return 0;
        });
      } else {
        resultArray = persons.sort(function(a, b) {
          if (parseValue(a[value]) > parseValue(b[value])) return -1;
          if (parseValue(a[value]) < parseValue(b[value])) return 1;
          return 0;
        });
      }
    } else {
      resultArray = persons;
    }

    // Then show only a subset of the persons.
    let end = page * visibleItems;
    let last = persons.length < end ? persons.length : end;
    let first = end - visibleItems;

    return resultArray.slice(first, last);
  }
}
