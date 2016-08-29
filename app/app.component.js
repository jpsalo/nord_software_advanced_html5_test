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
var chance = require('chance');
var ch = new chance();
var Person = (function () {
    function Person(id, name, gender, age) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.age = age;
    }
    return Person;
}());
exports.Person = Person;
var GENDER = ['Male', 'Female'];
function generatePerson() {
    var gender = GENDER[ch.integer({ min: 0, max: 1 })];
    // let gender = ch.gender(); NOTE: This is not working.
    var person = {
        id: ch.string({ length: 10, alpha: true }),
        name: ch.first({ gender: gender }) + ' ' + ch.last(),
        gender: gender,
        age: ch.age()
    };
    return new Person(person.id, person.name, person.gender, person.age);
}
function generatePaginationPages(dataArray) {
    var numberOfPages = Math.ceil(dataArray.length / 20);
    var paginationPages = [];
    for (var i = 0; i < numberOfPages; i++) {
        paginationPages.push(i + 1);
    }
    return paginationPages;
}
var NUMBER_OF_INITIAL_PERSONS = 100;
var VISIBLE_PAGINATION_LINKS = 4;
var PERSONS = [];
for (var i = 0; i <= NUMBER_OF_INITIAL_PERSONS; i++) {
    PERSONS.push(generatePerson());
}
function generateAges() {
    var ages = [];
    for (var i = 1; i <= 120; i++) {
        ages.push(i);
    }
    return ages;
}
var AGES = generateAges();
var OrderByAndSlicePipe = (function () {
    function OrderByAndSlicePipe() {
    }
    OrderByAndSlicePipe.prototype.transform = function (persons, value, ascending, page) {
        var resultArray;
        function parseValue(value) {
            return typeof value === 'string' ? value.toLowerCase() : value;
        }
        if (value) {
            if (ascending) {
                resultArray = persons.sort(function (a, b) {
                    if (parseValue(a[value]) < parseValue(b[value]))
                        return -1;
                    if (parseValue(a[value]) > parseValue(b[value]))
                        return 1;
                    return 0;
                });
            }
            else {
                resultArray = persons.sort(function (a, b) {
                    if (parseValue(a[value]) > parseValue(b[value]))
                        return -1;
                    if (parseValue(a[value]) < parseValue(b[value]))
                        return 1;
                    return 0;
                });
            }
        }
        else {
            resultArray = persons;
        }
        var end = page * 20;
        var last = persons.length < end ? persons.length : end;
        var first = end - 20;
        return resultArray.slice(first, last);
    };
    OrderByAndSlicePipe = __decorate([
        core_1.Pipe({ name: 'orderByAndSlice' }), 
        __metadata('design:paramtypes', [])
    ], OrderByAndSlicePipe);
    return OrderByAndSlicePipe;
}());
exports.OrderByAndSlicePipe = OrderByAndSlicePipe;
var AppComponent = (function () {
    function AppComponent() {
        this.persons = PERSONS;
        this.model = new Person("", "", "", null);
        this.ages = AGES;
        // http://stackoverflow.com/a/34409303
        this.pages = generatePaginationPages(this.persons);
        this.currentPage = 1;
    }
    AppComponent.prototype.toggleEditPersonDetails = function (person) {
        this.selectedPerson = (person === this.selectedPerson) ? undefined : person;
    };
    ;
    AppComponent.prototype.addNewPerson = function () {
        this.model.id = ch.string({ length: 10, alpha: true });
        // http://stackoverflow.com/a/34497504
        // this.persons.unshift(this.model);
        // By using the 'natural' order, we get new person to appear on top of the list.
        this.orderByValue = '';
        this.gotoPage(1);
        this.persons = [this.model].concat(this.persons);
        this.model = new Person(null, null, "", null);
        this.pages = generatePaginationPages(this.persons);
    };
    ;
    AppComponent.prototype.deletePerson = function (person) {
        // TODO:  Add confirm for deletion.
        this.persons.splice(this.persons.indexOf(person), 1);
        this.persons = this.persons.concat();
        this.pages = generatePaginationPages(this.persons);
    };
    AppComponent.prototype.gotoPage = function (pageNumber) {
        this.currentPage = pageNumber;
    };
    ;
    AppComponent.prototype.sortBy = function (value) {
        if (this.currentPage !== 1)
            this.gotoPage(1);
        this.orderByValue = value;
        this.orderByAscending = !this.orderByAscending;
    };
    ;
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
    ;
    AppComponent.prototype.gotoPreviousPage = function () {
        if (this.currentPage !== this.pages[0])
            this.gotoPage(this.currentPage - 1);
    };
    ;
    AppComponent.prototype.gotoNextPage = function () {
        if (this.currentPage !== this.pages[this.pages.length - 1])
            this.gotoPage(this.currentPage + 1);
    };
    ;
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            pipes: [OrderByAndSlicePipe],
            template: "\n\n  <nav class=\"navbar navbar-default navbar-static-top\">\n    <div class=\"container-fluid\">\n      <div class=\"navbar-header\">\n        <a class=\"navbar-brand\" href=\"#\">\n          <img alt=\"Brand\" src=\"../logo-new.svg\">\n        </a>\n      </div>\n    </div>\n  </nav>\n\n  <div class=\"container\">\n\n    <div class=\"section__add-person row\">\n      <h1>Add a person</h1>\n      <form class=\"form-inline\" (ngSubmit)=\"addNewPerson()\"\n            #newPersonForm=\"ngForm\">\n        <div class=\"form-group col-md-5\">\n          <label class=\"sr-only\" for=\"personName\">Name</label>\n          <input type=\"text\" name=\"name\" id=\"personName\"\n                 class=\"form-control full-width input-lg\"\n                 #newPerson placeholder=\"Name\" required [(ngModel)]=\"model.name\">\n        </div>\n        <div class=\"form-group col-md-3\">\n          <label class=\"sr-only\" for=\"personGender\">Gender</label>\n          <select id=\"personGender\" name=\"gender\"\n                  class=\"form-control full-width input-lg\" required\n                  [(ngModel)]=\"model.gender\">\n            <option value=\"\" disabled selected>Gender</option>\n            <option value=\"Female\">Female</option>\n            <option value=\"Male\">Male</option>\n            <option value=\"Other\">Other</option>\n          </select>\n        </div>\n\n        <div class=\"form-group col-md-3 no-gutter__right\">\n          <label class=\"sr-only\" for=\"personAge\">Age</label>\n          <select id=\"personAge\" name=\"age\"\n                  class=\"form-control full-width input-lg\" required\n                  [(ngModel)]=\"model.age\">\n            <option value=null disabled selected>Age</option>\n            <option *ngFor=\"let age of ages\" [value]=\"age\">{{age}}</option>\n          </select>\n        </div>\n        <div class=\"col-md-1\n                pull-right\">\n          <button type=\"submit\" class=\"btn btn-default pull-right btn-lg\"\n                  (click)=\"addNewPerson(newPerson.value)\"\n                  [disabled]=\"!newPersonForm.form.valid\" aria-label=\"Left Align\">\n            <span class=\"glyphicon glyphicon-plus icon-add\" aria-hidden=\"true\"></span>\n          </button>\n        </div>\n      </form>\n    </div>\n\n    <div class=\"row section__persons-list\">\n\n      <table class=\"table table-striped\" btn-lg>\n\n        <thead>\n          <tr class=\"row\">\n            <th>\n              <span class=\"heading-text left-edge-cell__text\">Name</span>\n              <button type=\"button\" class=\"btn btn-link\" aria-label=\"Left Align\"\n                       (click)=\"sortBy('name')\">\n                <span class=\"glyphicon glyphicon-signal icon-sort\"\n                      [class.active]=\"orderByValue === 'name'\"\n                      [class.ascending]=\"orderByValue === 'name' && orderByAscending\"\n                      aria-hidden=\"true\"></span>\n              </button>\n            </th>\n            <th>\n              <span class=\"heading-text\">Gender</span>\n              <button type=\"button\" class=\"btn btn-link\" aria-label=\"Left Align\"\n                       (click)=\"sortBy('gender')\">\n                <span class=\"glyphicon glyphicon-signal icon-sort\"\n                      [class.active]=\"orderByValue === 'gender'\"\n                      [class.ascending]=\"orderByValue === 'gender' && orderByAscending\"\n                      aria-hidden=\"true\"></span>\n              </button>\n            </th>\n            <th>\n              <span class=\"heading-text\">Age</span>\n              <button type=\"button\" class=\"btn btn-link\" aria-label=\"Left Align\"\n                       (click)=\"sortBy('age')\">\n                <span class=\"glyphicon glyphicon-signal icon-sort\"\n                      [class.active]=\"orderByValue === 'age'\"\n                      [class.ascending]=\"orderByValue === 'age' && orderByAscending\"\n                      aria-hidden=\"true\"></span>\n              </button>\n            </th>\n          </tr>\n        </thead>\n\n        <tbody>\n          <tr *ngFor=\"let person of\n              (persons | orderByAndSlice:orderByValue:orderByAscending:currentPage);trackBy:person?.id\"\n              class=\"row\">\n\n            <td class=\"col-md-5\">\n              <span *ngIf=\"person !== selectedPerson\" class=\"left-edge-cell__text\">\n                    {{person.name}}\n              </span>\n              <span *ngIf=\"person === selectedPerson\">\n                <label class=\"sr-only\" for=\"selectedPersonName\">Name</label>\n                <input type=\"text\" class=\"form-control input-lg cell__input\"\n                       id=\"selectedPersonName\"\n                       [(ngModel)]=\"person.name\" placeholder=\"Name\">\n              </span>\n            </td>\n\n            <td class=\"col-md-3\">\n              <div *ngIf=\"person !== selectedPerson\">{{person.gender}}</div>\n              <div *ngIf=\"person === selectedPerson\" class=\"cell__editable\">\n                <label class=\"sr-only\" for=\"selectedPersonGender\">Gender</label>\n                <select id=\"selectedPersonGender\" name=\"gender\"\n                        class=\"form-control input-lg\"\n                        required [(ngModel)]=\"person.gender\">\n                  <option value=\"Female\">Female</option>\n                  <option value=\"Male\">Male</option>\n                  <option value=\"Other\">Other</option>\n                </select>\n              </div>\n            </td>\n\n            <td class=\"col-md-2\">\n              <div *ngIf=\"person !== selectedPerson\">{{person.age}}</div>\n              <div *ngIf=\"person === selectedPerson\" class=\"cell__editable\">\n                <label class=\"sr-only\" for=\"selectedPersonAge\">Age</label>\n                <select id=\"selectedPersonAge\" name=\"age\"\n                        class=\"form-control input-lg\"\n                        required [(ngModel)]=\"person.age\">\n                  <option *ngFor=\"let age of ages\" [value]=\"age\">{{age}}</option>\n                </select>\n              </div>\n            </td>\n\n            <td class=\"col-md-2\">\n              <button type=\"button\" class=\"btn btn-link edit\" aria-label=\"Left Align\"\n                      (click)=\"toggleEditPersonDetails(person)\">\n                <span class=\"glyphicon glyphicon-pencil icon-edit\"\n                      [class.active]=\"person === selectedPerson\"\n                      aria-hidden=\"true\">\n                </span>\n              </button>\n              <button type=\"button\" class=\"btn btn-link pull-right\"\n                      aria-label=\"Left Align\"\n                      (click)=\"deletePerson(person)\">\n                <span class=\"glyphicon glyphicon-remove icon-remove\"\n                      aria-hidden=\"true\">\n                </span>\n              </button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n\n    <nav class=\"text-center\" aria-label=\"Page navigation\">\n      <ul class=\"pagination pagination-lg\">\n        <li [class.invisible]=\"!isPaginationArrowVisible('previous')\">\n          <a aria-label=\"Previous\" (click)=\"gotoPreviousPage()\">\n            <span aria-hidden=\"true\">&hellip;</span>\n          </a>\n        </li>\n        <li *ngFor=\"let pageNumber of pages\"\n            [class.active]=\"pageNumber === currentPage\">\n          <a (click)=\"gotoPage(pageNumber)\">{{ pageNumber }}</a>\n        </li>\n        <li [class.invisible]=\"!isPaginationArrowVisible('next')\">\n          <a aria-label=\"Next\" (click)=\"gotoNextPage()\">\n            <span aria-hidden=\"true\">&hellip;</span>\n          </a>\n        </li>\n      </ul>\n    </nav>\n\n  </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map