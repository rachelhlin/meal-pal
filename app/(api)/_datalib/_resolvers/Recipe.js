import Recipes from '../_services/Recipes.js';
import Users from '../_services/Users.js';
import { requireUser } from '../_utils/validation.js';

// Memoize the rating aggregate on the parent so averageRating + reviewCount share one query.
const summary = (recipe) =>
  (recipe._summary ??= Recipes.ratingSummary(recipe.id));

const resolvers = {
  Recipe: {
    createdAt: (recipe) => recipe.createdAt.toISOString(),
    updatedAt: (recipe) => recipe.updatedAt.toISOString(),
    author: (recipe) => Users.findAuthor(recipe.authorId),
    reviews: (recipe) => Recipes.findReviewsByRecipeId(recipe.id),
    averageRating: async (recipe) => (await summary(recipe)).average,
    reviewCount: async (recipe) => (await summary(recipe)).count,
  },

  Query: {
    recipe: (_, { id }) => Recipes.find({ id }),
    recipes: (_, { search }) => Recipes.findAll({ search }),
  },

  Mutation: {
    createRecipe: (_, { input }, ctx) =>
      Recipes.create({ input, userId: requireUser(ctx) }),
    updateRecipe: (_, { id, input }, ctx) =>
      Recipes.update({ id, input, userId: requireUser(ctx) }),
    deleteRecipe: (_, { id }, ctx) =>
      Recipes.remove({ id, userId: requireUser(ctx) }),
  },
};

export default resolvers;
