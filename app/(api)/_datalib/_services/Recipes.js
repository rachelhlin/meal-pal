import prisma from '../_prisma/client.js';

export default class Recipes {
  // CREATE
  static async create({ input }) {
    const { title, ingredients, instructions } = input;
    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        instructions,
      },
    });
    return recipe;
  }

  // READ
  static async find({ id }) {
    return prisma.recipe.findUnique({ where: { id } });
  }

  static async findAll() {
    return prisma.recipe.findMany();
  }

  // Fetch reviews for a specific recipe
  static async findReviewsByRecipeId(recipeId) {
    return prisma.review.findMany({ where: { recipeId } });
  }
}
