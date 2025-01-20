import prisma from '../_prisma/client.js';

export default class Reviews {
  // CREATE
  static async create({ input }) {
    const { rating, comment, recipeId } = input;
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        recipeId,
      },
    });
    return review;
  }

  // READ
  static async find({ id }) {
    return prisma.review.findUnique({ where: { id } });
  }

  static async findAll() {
    return prisma.review.findMany();
  }
}
