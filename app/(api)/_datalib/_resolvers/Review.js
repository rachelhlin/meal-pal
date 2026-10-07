import Reviews from '../_services/Reviews.js';
import Recipes from '../_services/Recipes.js';
import Users from '../_services/Users.js';
import { requireUser } from '../_utils/validation.js';

const resolvers = {
  Review: {
    createdAt: (review) => review.createdAt.toISOString(),
    author: (review) => Users.findAuthor(review.authorId),
    recipe: (review) => Recipes.find({ id: review.recipeId }),
  },

  Query: {
    review: (_, { id }) => Reviews.find({ id }),
  },

  Mutation: {
    createReview: (_, { input }, ctx) =>
      Reviews.create({ input, userId: requireUser(ctx) }),
    deleteReview: (_, { id }, ctx) =>
      Reviews.remove({ id, userId: requireUser(ctx) }),
  },
};

export default resolvers;
