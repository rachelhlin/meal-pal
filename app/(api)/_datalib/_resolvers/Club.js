import Clubs from '../_services/Club.js';


const resolvers = {
  Club: {
    // Resolve the list of reviews associated with a club
    reviews: ({ id }) => Clubs.getReviews({ clubId: id }),
  },

  Query: {
    // Fetch a single club by ID
    club: (_, { id }) => Clubs.find({ id }),

    // Fetch all clubs
    clubs: () => Clubs.findAll(),
  },

  Mutation: {
    // Create a new club
    createClub: (_, { userId, input }) => Clubs.create({ userId, input }),

    // Add a review to a club
    addReview: (_, { clubId, name, description, rating }) =>
      Clubs.addReview({ clubId, name, description, rating }),
  },
};

export default resolvers;
