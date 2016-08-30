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

  initializeNewPerson(): Person {
    return new Person("", "", "", null);
  }

  addNewPerson(personData: any, persons: Person[]): Person[] {
    personData.id = generateId();
    persons.unshift(personData);
    return persons.slice();
  }

  deletePerson(person: Person, persons: Person[]): Person[] {
    persons.splice(persons.indexOf(person), 1);
    return persons.slice();
  }
}
