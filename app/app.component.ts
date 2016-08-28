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

const PERSONS: Person[] = [];
for (let i = 0; i <= 100; i++) {
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

@Pipe({ name: 'inRange' })
export class InRangePipe implements PipeTransform {
  transform(persons: Person[], page: number) {
    let asd = [];
    let end = page * 20;
    let last = persons.length < end ? persons.length : end;
    let start = end - 20;
    console.log(start);
    console.log(last);
    for (let i = start ; i < last; i++) {
      asd.push(persons[i]);
    }
    // return PERSONS.filter(person => person.gender === 'Male');
    return asd;
  }
}

@Component({
  selector: 'my-app',
  pipes: [InRangePipe], // http://stackoverflow.com/a/39007605
  template: `
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
          <button type=" input-lgsubmit"
                  class="btn btn-default pull-right btn-lg"
                  (click)="addNewPerson(newPerson.value)"
                  [disabled]="!newPersonForm.form.valid">+</button>
        </div>
      </form>
    </div>

    <div class="row">

      <table class="table table-striped" btn-lg>

        <thead>
          <tr class="row">
            <th>
              <span class="left-edge-cell__text">Name</span>
              <button class="btn btn-default" type="button">sort</button>
            </th>
            <th>
              <span>Gender</span>
              <button class="btn btn-default" type="button">sort</button>
            </th>
            <th>
              <span>Age</span>
              <button class="btn btn-default" type="button">sort</button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let person of (persons | inRange:currentPage)" class="row">

            <td class="col-md-5">
              <span *ngIf="person !== selectedPerson" class="left-edge-cell__text">{{person.name}}</span>
              <span *ngIf="person === selectedPerson">
                <label class="sr-only" for="selectedPersonName">Name</label>
                <input type="text" class="form-control" id="selectedPersonName"
                       [(ngModel)]="person.name" placeholder="Name">
              </span>
            </td>

            <td class="col-md-3">
              <div *ngIf="person !== selectedPerson">{{person.gender}}</div>
              <div *ngIf="person === selectedPerson" class="cell__editable">
                <label class="sr-only" for="selectedPersonGender">Gender</label>
                <select id="selectedPersonGender" name="gender" class="form-control"
                        required [(ngModel)]="person.gender">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </td>

            <td class="col-md-2">
              <div *ngIf="person !== selectedPerson">{{person.age}}</div>
              <div *ngIf="person === selectedPerson" class="cell__editable">
                <label class="sr-only" for="selectedPersonAge">Age</label>
                <select id="selectedPersonAge" name="age" class="form-control"
                        required [(ngModel)]="person.age">
                  <option *ngFor="let age of ages" [value]="age">{{age}}</option>
                </select>
              </div>
            </td>

            <td class="col-md-2">
              <button class="btn btn-default edit" type="button"
                      [class.selected-person]="person === selectedPerson"
                      (click)="toggleEditPersonDetails(person)">
                      edit
              </button>
              <button class="btn btn-default pull-right" type="button"
                      (click)="deletePerson(person)">x
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-center">
      <ul class="pagination">
        <li *ngFor="let pageNumber of pages">
          <a (click)="gotoPage(pageNumber)">{{ pageNumber }}</a>
        </li>
      </ul>
    </div>

  </div>
  `
})

export class AppComponent {
  persons = PERSONS;
  selectedPerson: Person;
  toggleEditPersonDetails(person: Person): void {
    this.selectedPerson = (person === this.selectedPerson) ? undefined : person;
  };
  addNewPerson() {
    this.persons.push(this.model);
    console.log(this.persons);
    this.model = new Person(null, null, "", null);
  };
  deletePerson() {
    alert('Not yet :)');
  }
  model = new Person("", "", "", null);
  ages = AGES;
  // http://stackoverflow.com/a/34409303
  pages = generatePaginationPages(this.persons);
  gotoPage(pageNumber) {
    this.currentPage = pageNumber;
  };
  currentPage = 1;
}
