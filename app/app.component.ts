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

const GENDER = ['Male', 'Female', 'Other'];

function generatePerson() {
  let gender = GENDER[ch.integer({min: 0, max: 2})];
  // let gender = ch.gender(); NOTE: This is not working.
  let name: string;
  if (gender !== 'Other') {
    name = ch.first({ gender: gender }) + ' ' + ch.last();
  } else {
    name = ch.name();
  }
  let person = {
    id: ch.string({length: 10, alpha: true}),
    name: name,
    gender: gender,
    age: ch.age()
  };
  return new Person(person.id, person.name, person.gender, person.age);
}

function generatePaginationPages(dataArray) {
  let numberOfPages = Math.ceil(dataArray.length / 20);
  let paginationPages = [];
  for (let i = 0; i < numberOfPages; i++) {
    paginationPages.push(i + 1);
  }
  return paginationPages;
}

const NUMBER_OF_INITIAL_PERSONS: number = 100;
const VISIBLE_PAGINATION_LINKS: number = 4;

const PERSONS: Person[] = [];
for (let i = 0; i <= NUMBER_OF_INITIAL_PERSONS; i++) {
  PERSONS.push(generatePerson());
}

function generateAges() {
  let ages = [];
  for (let i = 1; i <= 120; i++) {
     ages.push(i);
  }
  return ages;
}

const AGES = generateAges();

@Pipe({ name: 'orderByAndSlice' })
export class OrderByAndSlicePipe implements PipeTransform {
  transform(persons: Person[], value: string, ascending: boolean, page: number) {
    let resultArray;

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
    let end = page * 20;
    let last = persons.length < end ? persons.length : end;
    let first = end - 20;

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
  doDeletePerson() {
    this.persons.splice(this.persons.indexOf(this.personToDelete), 1);
    this.persons = this.persons.concat();
    this.pages = generatePaginationPages(this.persons);
  };
  toggleEditPersonDetails(person: Person): void {
    if (person === this.selectedPerson) this.endEditPersonDetails(person);
    else this.editPersonDetails(person);
  };
  editPersonDetails(person: Person) {
    this.selectedPerson = person;
  };
  endEditPersonDetails(person: Person): void {
    this.selectedPerson = undefined;
  };
  addNewPerson() {
    this.model.id = ch.string({length: 10, alpha: true});
    // http://stackoverflow.com/a/34497504
    // this.persons.unshift(this.model);
    // By using the 'natural' order, we get new person to appear on top of the list.
    this.orderByValue = '';
    this.gotoPage(1);
    this.persons = [this.model].concat(this.persons);
    this.model = new Person(null, null, "", null);
    this.pages = generatePaginationPages(this.persons);
  };
  deletePerson(person) {
    this.openModal();
    this.personToDelete = person;
  };
  orderByValue: string;
  orderByAscending: boolean;
  sortBy(value) {
    if (this.currentPage !== 1) this.gotoPage(1);
    this.orderByValue = value;
    this.orderByAscending = !this.orderByAscending;
  };
  // http://stackoverflow.com/a/34409303
  pages = generatePaginationPages(this.persons);
  currentPage: number = 1;
  gotoPage(pageNumber) {
    this.currentPage = pageNumber;
  };
  isPaginationArrowVisible(direction) {
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
  gotoPreviousPage() {
    if (this.currentPage !== this.pages[0]) this.gotoPage(this.currentPage - 1);
  };
  gotoNextPage() {
    if (this.currentPage !== this.pages[this.pages.length - 1])
      this.gotoPage(this.currentPage + 1);
  };
  isEmpty(str) {
    return (!str || 0 === str.length);
  };
  onKey(event: any, person: Person) {
    if ((event.keyCode == 13 || event.keyCode == 27) &&
      !this.isEmpty(person.name)) {
      event.target.blur();
      this.endEditPersonDetails(person);
    }
  };
  modalVisible: boolean;
  openModal() {
    this.modalVisible = true;
  };
  closeModal(confirmDelete) {
    this.modalVisible = false;
    if (confirmDelete) this.doDeletePerson();
  };
}
