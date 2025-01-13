import prisma from '../_prisma/client.js';

export default class Clubs {
  // CREATE
  static async create({ userId, input, input2 }) {
    const { name, description} = input;

    const club = await prisma.club.create({
      data: {
        userId,
        name,
        description
      },
    });
    return club;
  }

  // READ
  static async find({ id }) {
    return prisma.club.findUnique({ where: { id } });
  }

  static async findAll() {
    return prisma.club.findMany();
  }

  // OTHER
  static async addReview({ clubId, name, description, rating }) {
    try {
      // Create a new review and associate it with the specified club
      const newReview = await prisma.review.create({
        data: {
          name,
          description,
          rating,
          clubId: parseInt(clubId), // Link review to the club
        },
      });
  
      return newReview; // Return the newly created review
    } catch (e) {
      console.error("Error adding review:", e.message);
      throw new Error("Failed to add review");
    }
  }
  
  static async get({ id }) {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          clubId: parseInt(id), // Get reviews linked to the club
        },
      });
  
      return reviews;
    } catch (e) {
      console.error("Error fetching reviews:", e.message);
      throw new Error("Failed to fetch reviews");
    }
  }
  

  

}
