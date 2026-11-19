import Kitchen from '../_services/Kitchen.js';
import Recipes from '../_services/Recipes.js';
import { requireUser } from '../_utils/validation.js';

// everything here is per user, so every resolver starts with requireUser
const resolvers = {
  GroceryItem: {
    recipe: (item) =>
      item.recipeId ? Recipes.find({ id: item.recipeId }) : null,
  },

  Query: {
    myPantry: (_, __, ctx) => Kitchen.listPantry(requireUser(ctx)),
    myGroceryList: (_, __, ctx) => Kitchen.listGroceries(requireUser(ctx)),
  },

  Mutation: {
    addPantryItems: (_, { names }, ctx) =>
      Kitchen.addPantry(requireUser(ctx), names),
    removePantryItem: (_, { name }, ctx) =>
      Kitchen.removePantry(requireUser(ctx), name),
    clearPantry: (_, __, ctx) => Kitchen.clearPantry(requireUser(ctx)),

    addGroceryItems: (_, { names, recipeId }, ctx) =>
      Kitchen.addGroceries(requireUser(ctx), names, recipeId),
    addMissingToGroceryList: (_, { recipeId }, ctx) =>
      Kitchen.addMissingFromRecipe(requireUser(ctx), recipeId),
    setGroceryChecked: (_, { id, checked }, ctx) =>
      Kitchen.setChecked(requireUser(ctx), id, checked),
    removeGroceryItem: (_, { id }, ctx) =>
      Kitchen.removeGrocery(requireUser(ctx), id),
    clearCheckedGroceries: (_, __, ctx) =>
      Kitchen.clearChecked(requireUser(ctx)),
    moveCheckedToPantry: (_, __, ctx) =>
      Kitchen.moveCheckedToPantry(requireUser(ctx)),
  },
};

export default resolvers;
