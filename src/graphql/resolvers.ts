import User from '../models/User';

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    user: async (parent: any, args: { id: string }) =>
      await User.query().findById(args.id),
    users: async () => await User.query(),
  },
};

export default resolvers;
