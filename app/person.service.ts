import { Injectable } from '@angular/core';

import { Person } from './person';
import { PERSONS } from './mock-persons';

import * as chance from 'chance';
var randomGenerator = new chance();

function generateId(): string {
  return randomGenerator.string({length: 10, alpha: true});
}

@Injectable()
export class PersonService {
  getPersons(): Person[] {
    return PERSONS;
  }

  addNewPerson(personData: any): void {
    personData.id = generateId();
    PERSONS.unshift(personData);
  }
}
