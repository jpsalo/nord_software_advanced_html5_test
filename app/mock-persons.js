"use strict";
var person_1 = require('./person');
var chance = require('chance');
var randomGenerator = new chance();
var GENDERS = ['Male', 'Female', 'Other'];
var NUMBER_OF_INITIAL_PERSONS = 100;
function generateId() {
    return randomGenerator.string({ length: 10, alpha: true });
}
function generatePerson() {
    var gender = GENDERS[randomGenerator.integer({ min: 0, max: GENDERS.length - 1 })];
    // let gender = randomGenerator.gender(); NOTE: This is not working.
    var name;
    if (gender !== 'Other') {
        name = randomGenerator.first({ gender: gender }) + ' ' + randomGenerator.last();
    }
    else {
        name = randomGenerator.name();
    }
    var person = {
        id: generateId(),
        name: name,
        gender: gender,
        age: randomGenerator.age()
    };
    return new person_1.Person(person.id, person.name, person.gender, person.age);
}
function generatePersons() {
    var persons = [];
    for (var i = 0; i <= NUMBER_OF_INITIAL_PERSONS; i++) {
        persons.push(generatePerson());
    }
    return persons;
}
exports.PERSONS = generatePersons();
//# sourceMappingURL=mock-persons.js.map