import * as Knex from 'knex';
import { Model } from 'objection';
import { ApolloServer } from 'apollo-server';
import { resolvers, schemas } from './graphql';

const knexConfig = require('../knexfile');
// Initialize knex.
export const knex = Knex(knexConfig.development);

// Create or migrate:
knex.migrate.latest();

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex);

const server = new ApolloServer({ typeDefs: schemas, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }: { url: string }) => {
  console.log(`🚀  Server ready at ${url}`);
});
