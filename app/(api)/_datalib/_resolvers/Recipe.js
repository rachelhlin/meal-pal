import Recipes from '../_services/Recipes.js';

const resolvers = {
  Recipe: {
    reviews: (recipe) => {
      return Recipes.findReviewsByRecipeId(recipe.id);
    },
  },
  
  Query: {
    recipe: (_, { id }) => Recipes.find({ id }),
    recipes: () => Recipes.findAll(),
  },

  Mutation: {
    createRecipe: (_, { input }) => Recipes.create({ input }),
  },
};

export default resolvers;
