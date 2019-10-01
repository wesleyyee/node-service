const Knex = require('knex');
import { Model } from 'objection';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import passport from 'passport';
import { Profile } from 'passport-facebook';
import session from 'express-session';
import uuid from 'uuid';
const FacebookStrategy = require('passport-facebook');

import { resolvers, schemas } from './graphql';
import User from './models/User';

require('dotenv').config();

const knexConfig = require('../knexfile');
// Initialize knex.
export const knex = Knex(knexConfig.development);

// Create or migrate:
knex.migrate.latest();

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex);

const facebookOptions = {
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: 'http://localhost:4000/auth/facebook/callback',
  profileFields: ['id', 'email', 'first_name', 'last_name'],
};

const facebookCallback = (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: (cb: any, newUser: any) => void
) => {
  const newUser = {
    facebookId: profile ? profile.id : undefined,
    firstName: profile.name ? profile.name.givenName : '',
    lastName: profile.name ? profile.name.familyName : '',
    email: profile
      ? profile.emails && profile.emails[0] && profile.emails[0].value
      : '',
  };
  User.query().insert(newUser);
  done(null, newUser);
};

passport.serializeUser((user: { facebookId: string }, done) => {
  done(null, user.facebookId);
});

passport.deserializeUser((id: string, done) => {
  const matchingUser = User.query().where('facebookId', id);
  done(null, matchingUser);
});

passport.use(new FacebookStrategy(facebookOptions, facebookCallback));

const app = express();
app.use(
  session({
    genid: req => uuid(),
    secret: process.env.SESSION_SECRECT || '',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  context: ({ req }) => {
    return {
      user: req.user,
      logout: () => req.logout(),
    };
  },
  playground: {
    settings: {
      'request.credentials': 'same-origin',
    },
  },
});
server.applyMiddleware({ app, cors: false });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
