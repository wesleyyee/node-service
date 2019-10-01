import { Model, RelationMappings } from 'objection';

export interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export default class Person extends Model {
  // prettier-ignore
  readonly id!: number;
  firstName?: string;
  lastName?: string;
  address?: Address;
  facebookId?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Table name is the only required property.
  static tableName = 'persons';

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['firstName', 'lastName'],

    properties: {
      id: { type: 'integer' },
      firstName: { type: 'string', minLength: 1, maxLength: 255 },
      lastName: { type: 'string', minLength: 1, maxLength: 255 },
      facebookId: { type: 'string' },
      email: { type: 'string' },

      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
          zipCode: { type: 'string' },
        },
      },
    },
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  // This object defines the relations to other models. The modelClass strings
  // will be joined to `modelPaths` to find the class definition, to avoid
  // require loops. The other solution to avoid require loops is to make
  // relationMappings a thunk. See Movie.ts for an example.
  static relationMappings: RelationMappings = {};

  //
  // Example of numeric timestamps. Presumably this would be in a base
  // class or a mixin, and not just one of your leaf models.
  //

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  $parseDatabaseJson(json: object) {
    json = super.$parseDatabaseJson(json);
    toDate(json, 'createdAt');
    toDate(json, 'updatedAt');
    return json;
  }

  $formatDatabaseJson(json: object) {
    json = super.$formatDatabaseJson(json);
    toTime(json, 'createdAt');
    toTime(json, 'updatedAt');
    return json;
  }
}

function toDate(obj: any, fieldName: string): any {
  if (obj != null && typeof obj[fieldName] === 'number') {
    obj[fieldName] = new Date(obj[fieldName]);
  }
  return obj;
}

function toTime(obj: any, fieldName: string): any {
  if (obj != null && obj[fieldName] != null && obj[fieldName].getTime) {
    obj[fieldName] = obj[fieldName].getTime();
  }
  return obj;
}
