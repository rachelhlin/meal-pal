import prisma from '../_prisma/client.js';
import {
  badInput,
  forbidden,
  requiredText,
  toId,
} from '../_utils/validation.js';

export default class Reviews {
  static async create({ input, userId }) {
    const recipeId = toId(input.recipeId);
    const rating = input.rating;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw badInput('Rating must be a whole number from 1 to 5');
    }
    const comment = requiredText(input.comment, 'Comment', 2000);

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) throw badInput('Recipe not found');

    const existing = await prisma.review.findFirst({
      where: { recipeId, authorId: userId },
    });
    if (existing) throw badInput('You have already reviewed this recipe');

    return prisma.review.create({
      data: { rating, comment, recipeId, authorId: userId },
    });
  }

  static async remove({ id, userId }) {
    const review = await prisma.review.findUnique({ where: { id: toId(id) } });
    if (!review) throw badInput('Review not found');
    if (review.authorId !== userId) throw forbidden();
    await prisma.review.delete({ where: { id: review.id } });
    return true;
  }

  static async find({ id }) {
    return prisma.review.findUnique({ where: { id: toId(id) } });
  }
}
