import { Injectable } from '@angular/core';

import { Person } from './person';
import { PERSONS } from './mock-persons';

@Injectable()
export class PersonService {
  getPersons(): Person[] {
    return PERSONS;
  }
}
