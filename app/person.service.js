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
var mock_persons_1 = require('./mock-persons');
var chance = require('chance');
var randomGenerator = new chance();
function generateId() {
    return randomGenerator.string({ length: 10, alpha: true });
}
var PersonService = (function () {
    function PersonService() {
    }
    PersonService.prototype.getPersons = function () {
        return mock_persons_1.PERSONS;
    };
    PersonService.prototype.addNewPerson = function (personData, persons) {
        personData.id = generateId();
        persons.unshift(personData);
        return persons.slice();
    };
    PersonService.prototype.deletePerson = function (person, persons) {
        persons.splice(persons.indexOf(person), 1);
        return persons.slice();
    };
    PersonService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], PersonService);
    return PersonService;
}());
exports.PersonService = PersonService;
//# sourceMappingURL=person.service.js.map