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

const GENDER = ['Male', 'Female'];

function generatePerson() {
  let gender = GENDER[ch.integer({min: 0, max: 1})];
  // let gender = ch.gender(); NOTE: This is not working.
  let person = {
    id: ch.string({length: 10, alpha: true}),
    name: ch.first({ gender: gender }) + ' ' + ch.last(),
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
  template: `

  <nav class="navbar navbar-default navbar-static-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">
          <img alt="Brand" src="../logo-new.svg">
        </a>
      </div>
    </div>
  </nav>

  <div class="container">

    <div class="section__add-person row">
      <h1>Add a person</h1>
      <form class="form-inline" (ngSubmit)="addNewPerson()"
            #newPersonForm="ngForm">
        <div class="form-group col-md-5">
          <label class="sr-only" for="personName">Name</label>
          <input type="text" name="name" id="personName"
                 class="form-control full-width input-lg"
                 #newPerson placeholder="Name" required [(ngModel)]="model.name">
        </div>
        <div class="form-group col-md-3">
          <label class="sr-only" for="personGender">Gender</label>
          <select id="personGender" name="gender"
                  class="form-control full-width input-lg" required
                  [(ngModel)]="model.gender">
            <option value="" disabled selected>Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group col-md-3 no-gutter__right">
          <label class="sr-only" for="personAge">Age</label>
          <select id="personAge" name="age"
                  class="form-control full-width input-lg" required
                  [(ngModel)]="model.age">
            <option value=null disabled selected>Age</option>
            <option *ngFor="let age of ages" [value]="age">{{age}}</option>
          </select>
        </div>
        <div class="col-md-1
                pull-right">
          <button type="submit" class="btn btn-default pull-right btn-lg"
                  (click)="addNewPerson(newPerson.value)"
                  [disabled]="!newPersonForm.form.valid" aria-label="Left Align">
            <span class="glyphicon glyphicon-plus icon-add" aria-hidden="true"></span>
          </button>
        </div>
      </form>
    </div>

    <div class="row section__persons-list">

      <table class="table table-striped" btn-lg>

        <thead>
          <tr class="row">
            <th>
              <span class="heading-text left-edge-cell__text">Name</span>
              <button type="button" class="btn btn-link" aria-label="Left Align"
                       (click)="sortBy('name')">
                <span class="glyphicon glyphicon-signal icon-sort"
                      [class.active]="orderByValue === 'name'"
                      [class.ascending]="orderByValue === 'name' && orderByAscending"
                      aria-hidden="true"></span>
              </button>
            </th>
            <th>
              <span class="heading-text">Gender</span>
              <button type="button" class="btn btn-link" aria-label="Left Align"
                       (click)="sortBy('gender')">
                <span class="glyphicon glyphicon-signal icon-sort"
                      [class.active]="orderByValue === 'gender'"
                      [class.ascending]="orderByValue === 'gender' && orderByAscending"
                      aria-hidden="true"></span>
              </button>
            </th>
            <th>
              <span class="heading-text">Age</span>
              <button type="button" class="btn btn-link" aria-label="Left Align"
                       (click)="sortBy('age')">
                <span class="glyphicon glyphicon-signal icon-sort"
                      [class.active]="orderByValue === 'age'"
                      [class.ascending]="orderByValue === 'age' && orderByAscending"
                      aria-hidden="true"></span>
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let person of
              (persons | orderByAndSlice:orderByValue:orderByAscending:currentPage);trackBy:person?.id"
              class="row person-row"
              [class.inactive]="selectedPerson && person !== selectedPerson">

            <td class="col-md-5">
              <span>
                <label class="sr-only" for="selectedPersonName">Name</label>
                <input type="text" class="form-control input-lg cell__input"
                       [class.active]="person === selectedPerson"
                       id="selectedPersonName"
                       (keyup)="onKey($event, person)"
                       [(ngModel)]="person.name" placeholder="Name">
              </span>
            </td>

            <td class="col-md-3">
              <div class="cell__editable">
                <label class="sr-only" for="selectedPersonGender">Gender</label>
                <select id="selectedPersonGender" name="gender"
                        class="form-control input-lg"
                        [class.active]="person === selectedPerson"
                        required [(ngModel)]="person.gender">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </td>

            <td class="col-md-2">
              <div class="cell__editable">
                <label class="sr-only" for="selectedPersonAge">Age</label>
                <select id="selectedPersonAge" name="age"
                        class="form-control input-lg"
                        [class.active]="person === selectedPerson"
                        required [(ngModel)]="person.age">
                  <option *ngFor="let age of ages" [value]="age">{{age}}</option>
                </select>
              </div>
            </td>

            <td class="col-md-2">
              <button type="button" class="btn btn-link" aria-label="Left Align"
                      (click)="toggleEditPersonDetails(person)">
                <span class="glyphicon glyphicon-pencil icon-edit"
                      [class.active]="person === selectedPerson"
                      aria-hidden="true">
                </span>
              </button>
              <button type="button" class="btn btn-link pull-right"
                      aria-label="Left Align"
                      (click)="deletePerson(person)">
                <span class="glyphicon glyphicon-remove icon-remove"
                      aria-hidden="true">
                </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav class="text-center" aria-label="Page navigation">
      <ul class="pagination pagination-lg">
        <li [class.invisible]="!isPaginationArrowVisible('previous')">
          <a aria-label="Previous" (click)="gotoPreviousPage()">
            <span aria-hidden="true">&hellip;</span>
          </a>
        </li>
        <li *ngFor="let pageNumber of pages"
            [class.active]="pageNumber === currentPage">
          <a (click)="gotoPage(pageNumber)">{{ pageNumber }}</a>
        </li>
        <li [class.invisible]="!isPaginationArrowVisible('next')">
          <a aria-label="Next" (click)="gotoNextPage()">
            <span aria-hidden="true">&hellip;</span>
          </a>
        </li>
      </ul>
    </nav>

  </div>
  `
})

export class AppComponent {
  persons = PERSONS;
  model = new Person("", "", "", null);
  ages = AGES;
  selectedPerson: Person;
  personFieldInEdit: boolean;
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
    // TODO:  Add confirm for deletion.
    this.persons.splice(this.persons.indexOf(person), 1);
    this.persons = this.persons.concat();
    this.pages = generatePaginationPages(this.persons);
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
  onKey(event: any, person: Person) {
    if (event.keyCode == 13 || event.keyCode == 27) {
      event.target.blur();
      this.endEditPersonDetails(person);
    };
  }
}
