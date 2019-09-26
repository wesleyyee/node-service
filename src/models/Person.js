"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var objection_1 = require("objection");
var Person = /** @class */ (function (_super) {
    __extends(Person, _super);
    function Person() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Person.prototype.examplePersonMethod = function (arg) {
        return 1;
    };
    //
    // Example of numeric timestamps. Presumably this would be in a base
    // class or a mixin, and not just one of your leaf models.
    //
    Person.prototype.$beforeInsert = function () {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    };
    Person.prototype.$beforeUpdate = function () {
        this.updatedAt = new Date();
    };
    Person.prototype.$parseDatabaseJson = function (json) {
        json = _super.prototype.$parseDatabaseJson.call(this, json);
        toDate(json, 'createdAt');
        toDate(json, 'updatedAt');
        return json;
    };
    Person.prototype.$formatDatabaseJson = function (json) {
        json = _super.prototype.$formatDatabaseJson.call(this, json);
        toTime(json, 'createdAt');
        toTime(json, 'updatedAt');
        return json;
    };
    // Table name is the only required property.
    Person.tableName = 'persons';
    // Optional JSON schema. This is not the database schema! Nothing is generated
    // based on this. This is only used for validation. Whenever a model instance
    // is created it is checked against this schema. http://json-schema.org/.
    Person.jsonSchema = {
        type: 'object',
        required: ['firstName', 'lastName'],
        properties: {
            id: { type: 'integer' },
            parentId: { type: ['integer', 'null'] },
            firstName: { type: 'string', minLength: 1, maxLength: 255 },
            lastName: { type: 'string', minLength: 1, maxLength: 255 },
            age: { type: 'number' },
            address: {
                type: 'object',
                properties: {
                    street: { type: 'string' },
                    city: { type: 'string' },
                    zipCode: { type: 'string' }
                }
            }
        }
    };
    // Where to look for models classes.
    Person.modelPaths = [__dirname];
    // This object defines the relations to other models. The modelClass strings
    // will be joined to `modelPaths` to find the class definition, to avoid
    // require loops. The other solution to avoid require loops is to make
    // relationMappings a thunk. See Movie.ts for an example.
    Person.relationMappings = {
        pets: {
            relation: objection_1.Model.HasManyRelation,
            // This model defines the `modelPaths` property. Therefore we can simply use
            // the model module names in `modelClass`.
            modelClass: 'Animal',
            join: {
                from: 'persons.id',
                to: 'animals.ownerId'
            }
        },
        movies: {
            relation: objection_1.Model.ManyToManyRelation,
            modelClass: 'Movie',
            join: {
                from: 'persons.id',
                // ManyToMany relation needs the `through` object to describe the join table.
                through: {
                    from: 'persons_movies.personId',
                    to: 'persons_movies.movieId'
                },
                to: 'movies.id'
            }
        },
        children: {
            relation: objection_1.Model.HasManyRelation,
            modelClass: Person,
            join: {
                from: 'persons.id',
                to: 'persons.parentId'
            }
        },
        parent: {
            relation: objection_1.Model.BelongsToOneRelation,
            modelClass: Person,
            join: {
                from: 'persons.parentId',
                to: 'persons.id'
            }
        }
    };
    return Person;
}(objection_1.Model));
exports["default"] = Person;
function toDate(obj, fieldName) {
    if (obj != null && typeof obj[fieldName] === 'number') {
        obj[fieldName] = new Date(obj[fieldName]);
    }
    return obj;
}
function toTime(obj, fieldName) {
    if (obj != null && obj[fieldName] != null && obj[fieldName].getTime) {
        obj[fieldName] = obj[fieldName].getTime();
    }
    return obj;
}
