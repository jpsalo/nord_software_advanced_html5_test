import { Component, Pipe, PipeTransform } from '@angular/core';

import * as chance from 'chance';
var ch = new chance();

export class Person {
  constructor(
    public id: string,
    public name: string,
    public gender: string,
    public age: number
  ) { }
}

const GENDER: string[] = ['Male', 'Female', 'Other'];

function generatePerson(): Person {
  let gender = GENDER[ch.integer({min: 0, max: GENDER.length - 1})];
  // let gender = ch.gender(); NOTE: This is not working.
  let name: string;
  if (gender !== 'Other') {
    name = ch.first({ gender: gender }) + ' ' + ch.last();
  } else {
    name = ch.name();
  }
  let person = {
    id: generateId(),
    name: name,
    gender: gender,
    age: ch.age()
  };
  return new Person(person.id, person.name, person.gender, person.age);
}

function generateId(): string {
  return ch.string({length: 10, alpha: true});
}

function generatePaginationPages(dataArray): number[] {
  let numberOfPages = Math.ceil(dataArray.length / VISIBLE_ITEMS_IN_PAGE);
  let paginationPages = [];
  for (let i = 0; i < numberOfPages; i++) {
    paginationPages.push(i + 1);
  }
  return paginationPages;
}

const NUMBER_OF_INITIAL_PERSONS: number = 100;
const VISIBLE_PAGINATION_LINKS: number = 4;
const VISIBLE_ITEMS_IN_PAGE: number = 20;
const MIN_AGE: number = 1;
const MAX_AGE: number = 120;

const PERSONS: Person[] = [];
for (let i = 0; i <= NUMBER_OF_INITIAL_PERSONS; i++) {
  PERSONS.push(generatePerson());
}

function generateAges(): number[] {
  let ages = [];
  for (let i = MIN_AGE; i <= MAX_AGE; i++) {
     ages.push(i);
  }
  return ages;
}

const AGES: number[] = generateAges();

@Pipe({ name: 'orderByAndSlice' })
export class OrderByAndSlicePipe implements PipeTransform {
  transform(persons: Person[], value: string, ascending: boolean, page: number) {
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
    let end = page * VISIBLE_ITEMS_IN_PAGE;
    let last = persons.length < end ? persons.length : end;
    let first = end - VISIBLE_ITEMS_IN_PAGE;

    return resultArray.slice(first, last);
  }
}

@Component({
  selector: 'my-app',
  pipes: [OrderByAndSlicePipe], // http://stackoverflow.com/a/39007605
  templateUrl: 'app/app.component.html'
})

export class AppComponent {
  persons = PERSONS;
  model = new Person("", "", "", null);
  ages = AGES;
  selectedPerson: Person;
  personFieldInEdit: boolean;
  personToDelete: Person;
  doDeletePerson(): void {
    this.persons.splice(this.persons.indexOf(this.personToDelete), 1);
    this.persons = this.persons.concat();
    this.pages = generatePaginationPages(this.persons);
  };
  toggleEditPersonDetails(person: Person): void {
    if (person === this.selectedPerson) this.endEditPersonDetails(person);
    else this.editPersonDetails(person);
  };
  editPersonDetails(person: Person): void {
    this.selectedPerson = person;
  };
  endEditPersonDetails(person: Person): void {
    this.selectedPerson = undefined;
  };
  addNewPerson(): void {
    this.model.id = generateId();
    // http://stackoverflow.com/a/34497504
    // this.persons.unshift(this.model);
    // By using the 'natural' order, we get new person to appear on top of the list.
    this.orderByValue = '';
    this.gotoPage(1);
    this.persons = [this.model].concat(this.persons);
    this.model = new Person(null, null, "", null);
    this.pages = generatePaginationPages(this.persons);
  };
  deletePerson(person: Person): void {
    this.openModal();
    this.personToDelete = person;
  };
  orderByValue: string;
  orderByAscending: boolean;
  sortBy(value: string): void {
    if (this.currentPage !== 1) this.gotoPage(1);
    this.orderByValue = value;
    this.orderByAscending = !this.orderByAscending;
  };
  // http://stackoverflow.com/a/34409303
  pages = generatePaginationPages(this.persons);
  currentPage = 1;
  gotoPage(pageNumber: number): void {
    this.currentPage = pageNumber;
  };
  isPaginationArrowVisible(direction: string): boolean {
    let isVisible = false;
    if (direction === 'previous' && this.currentPage !== this.pages[0]) {
      isVisible = true;
    } else if (direction === 'next' &&
               this.currentPage !== this.pages[this.pages.length - 1])
    {
      isVisible = true;
    }
    return isVisible;
  };
  gotoPreviousPage(): void {
    if (this.currentPage !== this.pages[0]) this.gotoPage(this.currentPage - 1);
  };
  gotoNextPage(): void {
    if (this.currentPage !== this.pages[this.pages.length - 1])
      this.gotoPage(this.currentPage + 1);
  };
  isEmpty(str: string): boolean {
    return (!str || 0 === str.length);
  };
  onKey(event: any, person: Person): void {
    if ((event.keyCode == 13 || event.keyCode == 27) &&
      !this.isEmpty(person.name)) {
      event.target.blur();
      this.endEditPersonDetails(person);
    }
  };
  modalVisible: boolean;
  openModal(): void {
    this.modalVisible = true;
  };
  closeModal(confirmDelete: boolean): void {
    this.modalVisible = false;
    if (confirmDelete) this.doDeletePerson();
  };
}
