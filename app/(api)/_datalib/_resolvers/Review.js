import Reviews from '../_services/Review.js';

const resolvers = {
  Review: {
    // Resolves the `clubReviewed` field for a Review
    clubReviewed: async (parent) => {
      try {
        return await prisma.club.findUnique({
          where: { id: parent.clubId },
        });
      } catch (e) {
        console.error("Error resolving clubReviewed:", e.message);
        return null;
      }
    },
  },

  Query: {
    // Fetch a single review by its ID
    review: async (_, { id }) => {
      try {
        return await Reviews.find({ id });
      } catch (e) {
        console.error("Error fetching review:", e.message);
        throw new Error("Failed to fetch review");
      }
    },

    // Fetch all reviews
    reviews: async () => {
      try {
        return await Reviews.findAll();
      } catch (e) {
        console.error("Error fetching reviews:", e.message);
        throw new Error("Failed to fetch reviews");
      }
    },
  },

  Mutation: {
    // Create a new review
    createReview: async (_, { input }) => {
      try {
        return await Reviews.create({ input });
      } catch (e) {
        console.error("Error creating review:", e.message);
        throw new Error("Failed to create review");
      }
    },
  },
};

export default resolvers;
