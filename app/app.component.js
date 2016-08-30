"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
// http://stackoverflow.com/a/39007605
var orderby_slice_pipe_1 = require('./orderby-slice.pipe');
var person_service_1 = require('./person.service');
var modalConfirmCallback;
function registerModalConfirmCallback(data) {
    modalConfirmCallback = data;
}
function executeModalConfirmCallback() {
    if (modalConfirmCallback) {
        modalConfirmCallback.callback(modalConfirmCallback.params);
        modalConfirmCallback = undefined;
    }
}
function generatePaginationPages(dataArray) {
    var numberOfPages = Math.ceil(dataArray.length / VISIBLE_ITEMS_IN_PAGE);
    var paginationPages = [];
    for (var i = 0; i < numberOfPages; i++) {
        paginationPages.push(i + 1);
    }
    return paginationPages;
}
function isEmpty(str) {
    return (!str || 0 === str.length);
}
var VISIBLE_PAGINATION_LINKS = 4;
var VISIBLE_ITEMS_IN_PAGE = 20;
var MIN_AGE = 1;
var MAX_AGE = 120;
function generateAges() {
    var ages = [];
    for (var i = MIN_AGE; i <= MAX_AGE; i++) {
        ages.push(i);
    }
    return ages;
}
var AGES = generateAges();
var AppComponent = (function () {
    function AppComponent(personService) {
        this.personService = personService;
        this.newPerson = this.personService.initializeNewPerson();
        this.ages = AGES;
        this.visibleItemsInPage = VISIBLE_ITEMS_IN_PAGE;
        this.currentPage = 1;
    }
    AppComponent.prototype.getPersons = function () {
        this.persons = this.personService.getPersons();
    };
    AppComponent.prototype.ngOnInit = function () {
        this.getPersons();
        this.pages = generatePaginationPages(this.persons);
    };
    AppComponent.prototype.toggleEditPersonDetails = function (person) {
        if (person === this.selectedPerson)
            this.endEditPersonDetails();
        else
            this.editPersonDetails(person);
    };
    AppComponent.prototype.editPersonDetails = function (person) {
        this.selectedPerson = person;
    };
    AppComponent.prototype.endEditPersonDetails = function () {
        this.selectedPerson = undefined;
    };
    AppComponent.prototype.addNewPerson = function () {
        this.persons = this.personService.addNewPerson(this.newPerson, this.persons);
        // By using the 'natural' order, we get new person to appear on top of the list.
        this.newPerson = this.personService.initializeNewPerson();
        this.orderByValue = '';
        this.gotoPage(1);
        this.pages = generatePaginationPages(this.persons);
    };
    AppComponent.prototype.deletePerson = function (person) {
        var data = {
            callback: this.doDeletePerson.bind(this),
            params: person
        };
        registerModalConfirmCallback(data);
        this.openModal();
    };
    AppComponent.prototype.doDeletePerson = function (person) {
        this.persons = this.personService.deletePerson(person, this.persons);
        this.pages = generatePaginationPages(this.persons);
    };
    AppComponent.prototype.sortBy = function (value) {
        if (this.currentPage !== 1)
            this.gotoPage(1);
        this.orderByValue = value;
        this.orderByAscending = !this.orderByAscending;
    };
    AppComponent.prototype.gotoPage = function (pageNumber) {
        this.currentPage = pageNumber;
    };
    AppComponent.prototype.isPaginationArrowVisible = function (direction) {
        var isVisible = false;
        if (direction === 'previous' && this.currentPage !== this.pages[0]) {
            isVisible = true;
        }
        else if (direction === 'next' &&
            this.currentPage !== this.pages[this.pages.length - 1]) {
            isVisible = true;
        }
        return isVisible;
    };
    AppComponent.prototype.gotoPreviousPage = function () {
        if (this.currentPage !== this.pages[0])
            this.gotoPage(this.currentPage - 1);
    };
    AppComponent.prototype.gotoNextPage = function () {
        if (this.currentPage !== this.pages[this.pages.length - 1])
            this.gotoPage(this.currentPage + 1);
    };
    AppComponent.prototype.onKey = function (event, person) {
        if ((event.keyCode == 13 || event.keyCode == 27) && !isEmpty(person.name)) {
            event.target.blur();
            this.endEditPersonDetails();
        }
    };
    AppComponent.prototype.openModal = function () {
        this.modalVisible = true;
    };
    AppComponent.prototype.closeModal = function (confirmDelete) {
        this.modalVisible = false;
        if (confirmDelete)
            executeModalConfirmCallback();
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/app.component.html',
            providers: [person_service_1.PersonService],
            pipes: [orderby_slice_pipe_1.OrderByAndSlicePipe]
        }), 
        __metadata('design:paramtypes', [person_service_1.PersonService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map