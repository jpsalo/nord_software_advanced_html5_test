import { Component } from '@angular/core';

// http://stackoverflow.com/a/39007605
import { OrderByAndSlicePipe } from './orderby-slice.pipe';

import { Person } from './person';
import { PersonService } from './person.service';

let modalConfirmCallback: any;
function registerModalConfirmCallback(data) {
  modalConfirmCallback = data;
}

function executeModalConfirmCallback() {
  if (modalConfirmCallback) {
    modalConfirmCallback.callback(modalConfirmCallback.params);
    modalConfirmCallback = undefined;
  }
}

function generatePaginationPages(dataArray): number[] {
  let numberOfPages = Math.ceil(dataArray.length / VISIBLE_ITEMS_IN_PAGE);
  let paginationPages = [];
  for (let i = 0; i < numberOfPages; i++) {
    paginationPages.push(i + 1);
  }
  return paginationPages;
}

function isEmpty(str: string): boolean {
  return (!str || 0 === str.length);
}

const VISIBLE_PAGINATION_LINKS: number = 4;
const VISIBLE_ITEMS_IN_PAGE: number = 20;
const MIN_AGE: number = 1;
const MAX_AGE: number = 120;

function generateAges(): number[] {
  let ages = [];
  for (let i = MIN_AGE; i <= MAX_AGE; i++) {
     ages.push(i);
  }
  return ages;
}

const AGES: number[] = generateAges();

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  providers: [PersonService],
  pipes: [OrderByAndSlicePipe]
})

export class AppComponent {
  model = new Person("", "", "", null);
  persons: Person[];
  ages = AGES;
  selectedPerson: Person;
  personFieldInEdit: boolean;
  visibleItemsInPage = VISIBLE_ITEMS_IN_PAGE;

  constructor(private personService: PersonService) { }

  getPersons(): void {
    this.persons = this.personService.getPersons();
  }

  ngOnInit(): void {
    this.getPersons();
    this.pages = generatePaginationPages(this.persons);
  }

  toggleEditPersonDetails(person: Person): void {
    if (person === this.selectedPerson) this.endEditPersonDetails(person);
    else this.editPersonDetails(person);
  }

  editPersonDetails(person: Person): void {
    this.selectedPerson = person;
  }

  endEditPersonDetails(person: Person): void {
    this.selectedPerson = undefined;
  }

  addNewPerson(): void {
    this.persons = this.personService.addNewPerson(this.model, this.persons);
    // By using the 'natural' order, we get new person to appear on top of the list.
    this.orderByValue = '';
    this.gotoPage(1);
    this.model = new Person(null, null, "", null);
    this.pages = generatePaginationPages(this.persons);
  }

  deletePerson(person: Person): void {
    let data = {
      callback: this.doDeletePerson.bind(this),
      params: person
    };
    registerModalConfirmCallback(data);
    this.openModal();
  }

  doDeletePerson(person: Person): void {
    this.persons = this.personService.deletePerson(person, this.persons);
    this.pages = generatePaginationPages(this.persons);
  }

  orderByValue: string;
  orderByAscending: boolean;
  sortBy(value: string): void {
    if (this.currentPage !== 1) this.gotoPage(1);
    this.orderByValue = value;
    this.orderByAscending = !this.orderByAscending;
  }

  // http://stackoverflow.com/a/34409303
  pages: number[];
  currentPage = 1;
  gotoPage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

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
  }

  gotoPreviousPage(): void {
    if (this.currentPage !== this.pages[0]) this.gotoPage(this.currentPage - 1);
  }

  gotoNextPage(): void {
    if (this.currentPage !== this.pages[this.pages.length - 1])
      this.gotoPage(this.currentPage + 1);
  }

  onKey(event: any, person: Person): void {
    if ((event.keyCode == 13 || event.keyCode == 27) && !isEmpty(person.name)) {
      event.target.blur();
      this.endEditPersonDetails(person);
    }
  }

  modalVisible: boolean;
  openModal(): void {
    this.modalVisible = true;
  }

  closeModal(confirmDelete: boolean): void {
    this.modalVisible = false;
    if (confirmDelete) executeModalConfirmCallback();
  }

}
