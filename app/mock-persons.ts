import { Person } from './person';

import * as chance from 'chance';
var randomGenerator = new chance();

const GENDERS: string[] = ['Male', 'Female', 'Other'];
const NUMBER_OF_INITIAL_PERSONS: number = 100;

function generateId(): string {
  return randomGenerator.string({length: 10, alpha: true});
}

function generatePerson(): Person {
  let gender = GENDERS[randomGenerator.integer({min: 0, max: GENDERS.length - 1})];
  // let gender = randomGenerator.gender(); NOTE: This is not working.
  let name: string;
  if (gender !== 'Other') {
    name = randomGenerator.first({ gender: gender }) + ' ' + randomGenerator.last();
  } else {
    name = randomGenerator.name();
  }
  let person = {
    id: generateId(),
    name: name,
    gender: gender,
    age: randomGenerator.age()
  };
  return new Person(person.id, person.name, person.gender, person.age);
}

const PERS: Person[] = [];
for (let i = 0; i <= NUMBER_OF_INITIAL_PERSONS; i++) {
  PERS.push(generatePerson());
}

export const PERSONS: Person[] = PERS;

// export const PERSONS: Person[] = [
//   new Person("asd", "foo", "bar", 123)
// ];
