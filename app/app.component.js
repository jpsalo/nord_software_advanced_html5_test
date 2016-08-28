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
function generatePerson() {
    var gender = ch.gender();
    var person = {
        id: ch.string({ length: 10, alpha: true }),
        name: ch.first({ gender: gender }) + ' ' + ch.last(),
        gender: gender,
        age: ch.age()
    };
    return new Person(person.id, person.name, person.gender, person.age);
}
var PERSONS = [];
for (var i = 0; i <= 100; i++) {
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
var AppComponent = (function () {
    function AppComponent() {
        this.persons = PERSONS;
        this.model = new Person(null, null, "", null);
        this.ages = AGES;
    }
    AppComponent.prototype.toggleEditPersonDetails = function (person) {
        this.selectedPerson = (person === this.selectedPerson) ? undefined : person;
    };
    ;
    AppComponent.prototype.addNewPerson = function () {
        this.persons.push(this.model);
        console.log(this.persons);
        this.model = new Person(null, null, "", null);
    };
    ;
    AppComponent.prototype.deletePerson = function () {
        alert('Not yet :)');
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n  <div class=\"container\">\n\n    <div class=\"section__add-person row\">\n      <h1>Add a person</h1>\n      <form class=\"form-inline\" (ngSubmit)=\"addNewPerson()\"\n            #newPersonForm=\"ngForm\">\n        <div class=\"form-group col-md-5\">\n          <label class=\"sr-only\" for=\"personName\">Name</label>\n          <input type=\"text\" name=\"name\" id=\"personName\"\n                 class=\"form-control full-width input-lg\"\n                 #newPerson placeholder=\"Name\" required [(ngModel)]=\"model.name\">\n        </div>\n        <div class=\"form-group col-md-3\">\n          <label class=\"sr-only\" for=\"personGender\">Gender</label>\n          <select id=\"personGender\" name=\"gender\"\n                  class=\"form-control full-width input-lg\" required\n                  [(ngModel)]=\"model.gender\">\n            <option value=\"\" disabled selected>Gender</option>\n            <option value=\"Female\">Female</option>\n            <option value=\"Male\">Male</option>\n            <option value=\"Other\">Other</option>\n          </select>\n        </div>\n\n        <div class=\"form-group col-md-3 no-gutter__right\">\n          <label class=\"sr-only\" for=\"personAge\">Age</label>\n          <select id=\"personAge\" name=\"age\"\n                  class=\"form-control full-width input-lg\" required\n                  [(ngModel)]=\"model.age\">\n            <option value=null disabled selected>Age</option>\n            <option *ngFor=\"let age of ages\" [value]=\"age\">{{age}}</option>\n          </select>\n        </div>\n        <div class=\"col-md-1\n                pull-right\">\n          <button type=\" input-lgsubmit\"\n                  class=\"btn btn-default pull-right btn-lg\"\n                  (click)=\"addNewPerson(newPerson.value)\"\n                  [disabled]=\"!newPersonForm.form.valid\">+</button>\n        </div>\n      </form>\n    </div>\n\n    <div class=\"row\">\n\n            <table class=\"table table-striped\" btn-lg>\n\n        <thead>\n          <tr class=\"row\">\n            <th>\n              <span class=\"left-edge-cell__text\">Name</span>\n              <button class=\"btn btn-default\" type=\"button\">sort</button>\n            </th>\n            <th>\n              <span>Gender</span>\n              <button class=\"btn btn-default\" type=\"button\">sort</button>\n            </th>\n            <th>\n              <span>Age</span>\n              <button class=\"btn btn-default\" type=\"button\">sort</button>\n            </th>\n          </tr>\n        </thead>\n\n        <tbody>\n          <tr *ngFor=\"let person of persons\" class=\"row\">\n\n            <td class=\"col-md-5\">\n              <span *ngIf=\"person !== selectedPerson\" class=\"left-edge-cell__text\">{{person.name}}</span>\n              <span *ngIf=\"person === selectedPerson\">\n                <label class=\"sr-only\" for=\"selectedPersonName\">Name</label>\n                <input type=\"text\" class=\"form-control\" id=\"selectedPersonName\"\n                       [(ngModel)]=\"person.name\" placeholder=\"Name\">\n              </span>\n            </td>\n\n            <td class=\"col-md-3\">\n              <div *ngIf=\"person !== selectedPerson\">{{person.gender}}</div>\n              <div *ngIf=\"person === selectedPerson\" class=\"cell__editable\">\n                <label class=\"sr-only\" for=\"selectedPersonGender\">Gender</label>\n                <select id=\"selectedPersonGender\" name=\"gender\" class=\"form-control\"\n                        required [(ngModel)]=\"person.gender\">\n                  <option value=\"Female\">Female</option>\n                  <option value=\"Male\">Male</option>\n                  <option value=\"Other\">Other</option>\n                </select>\n              </div>\n            </td>\n\n            <td class=\"col-md-2\">\n              <div *ngIf=\"person !== selectedPerson\">{{person.age}}</div>\n              <div *ngIf=\"person === selectedPerson\" class=\"cell__editable\">\n                <label class=\"sr-only\" for=\"selectedPersonAge\">Age</label>\n                <select id=\"selectedPersonAge\" name=\"age\" class=\"form-control\"\n                        required [(ngModel)]=\"person.age\">\n                  <option *ngFor=\"let age of ages\" [value]=\"age\">{{age}}</option>\n                </select>\n              </div>\n            </td>\n\n            <td class=\"col-md-2\">\n              <button class=\"btn btn-default edit\" type=\"button\"\n                      [class.selected-person]=\"person === selectedPerson\"\n                      (click)=\"toggleEditPersonDetails(person)\">\n                      edit\n              </button>\n              <button class=\"btn btn-default pull-right\" type=\"button\"\n                      (click)=\"deletePerson(person)\">x\n              </button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map