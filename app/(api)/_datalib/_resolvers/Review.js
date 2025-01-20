import Reviews from '../_services/Reviews.js';
import Recipes from '../_services/Recipes.js';

const resolvers = {
  Review: {
    recipe: (review) => {
      return Recipes.find({ id: review.recipeId });
    },
  },

  Query: {
    review: (_, { id }) => Reviews.find({ id }),
    reviews: () => Reviews.findAll(),
  },

  Mutation: {
    createReview: (_, { input }) => Reviews.create({ input }),
  },
};

export default resolvers;
