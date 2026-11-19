import Recommendations from '../_services/Recommendations.js';

const resolvers = {
  Query: {
    recommendRecipes: (_, { ingredients, useAi }, ctx) =>
      Recommendations.forPantry({
        ingredients,
        useAi,
        userId: ctx?.userId ?? null,
      }),
  },
};

export default resolvers;
