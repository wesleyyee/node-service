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
var path_1 = require("path");
var Movie = /** @class */ (function (_super) {
    __extends(Movie, _super);
    function Movie() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Table name is the only required property.
    Movie.tableName = 'movies';
    // Optional JSON schema. This is not the database schema! Nothing is generated
    // based on this. This is only used for validation. Whenever a model instance
    // is created it is checked against this schema. http://json-schema.org/.
    Movie.jsonSchema = {
        type: 'object',
        required: ['name'],
        properties: {
            id: { type: 'integer' },
            name: { type: 'string', minLength: 1, maxLength: 255 }
        }
    };
    // This relationMappings is a thunk, which prevents require loops:
    Movie.relationMappings = function () { return ({
        actors: {
            relation: objection_1.Model.ManyToManyRelation,
            // The related model. This can be either a Model subclass constructor or an
            // absolute file path to a module that exports one. We use the file path version
            // here to prevent require loops.
            modelClass: path_1.join(__dirname, 'Person'),
            join: {
                from: 'movies.id',
                // ManyToMany relation needs the `through` object to describe the join table.
                through: {
                    from: 'persons_movies.movieId',
                    to: 'persons_movies.personId'
                },
                to: 'persons.id'
            }
        }
    }); };
    return Movie;
}(objection_1.Model));
exports["default"] = Movie;
