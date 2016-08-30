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
var OrderByAndSlicePipe = (function () {
    function OrderByAndSlicePipe() {
    }
    OrderByAndSlicePipe.prototype.transform = function (persons, value, ascending, page, visibleItems) {
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
        // Then show only a subset of the persons.
        var end = page * visibleItems;
        var last = persons.length < end ? persons.length : end;
        var first = end - visibleItems;
        return resultArray.slice(first, last);
    };
    OrderByAndSlicePipe = __decorate([
        core_1.Pipe({ name: 'orderByAndSlice' }), 
        __metadata('design:paramtypes', [])
    ], OrderByAndSlicePipe);
    return OrderByAndSlicePipe;
}());
exports.OrderByAndSlicePipe = OrderByAndSlicePipe;
//# sourceMappingURL=orderby-slice.pipe.js.map