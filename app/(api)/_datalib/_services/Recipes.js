import prisma from '../_prisma/client.js';
import {
  badInput,
  forbidden,
  requiredText,
  toId,
} from '../_utils/validation.js';

function cleanInput(input) {
  return {
    title: requiredText(input.title, 'Title', 120),
    ingredients: requiredText(input.ingredients, 'Ingredients', 5000),
    instructions: requiredText(input.instructions, 'Instructions', 10000),
  };
}

// Loads a recipe and makes sure `userId` owns it.
async function findOwned(id, userId) {
  const recipe = await prisma.recipe.findUnique({ where: { id: toId(id) } });
  if (!recipe) throw badInput('Recipe not found');
  if (recipe.authorId !== userId) throw forbidden();
  return recipe;
}

export default class Recipes {
  static async create({ input, userId }) {
    return prisma.recipe.create({
      data: { ...cleanInput(input), authorId: userId },
    });
  }

  static async update({ id, input, userId }) {
    const recipe = await findOwned(id, userId);
    return prisma.recipe.update({
      where: { id: recipe.id },
      data: cleanInput(input),
    });
  }

  static async remove({ id, userId }) {
    const recipe = await findOwned(id, userId);
    // Reviews reference the recipe, so remove them in the same transaction.
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { recipeId: recipe.id } }),
      prisma.recipe.delete({ where: { id: recipe.id } }),
    ]);
    return true;
  }

  static async find({ id }) {
    return prisma.recipe.findUnique({ where: { id: toId(id) } });
  }

  static async findAll({ search } = {}) {
    const term = search?.trim();
    return prisma.recipe.findMany({
      where: term
        ? { title: { contains: term, mode: 'insensitive' } }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findReviewsByRecipeId(recipeId) {
    return prisma.review.findMany({
      where: { recipeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async ratingSummary(recipeId) {
    const { _avg, _count } = await prisma.review.aggregate({
      where: { recipeId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return { average: _avg.rating, count: _count.rating };
  }
}
