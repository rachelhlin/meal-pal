import prisma from '../_prisma/client.js';

export default class Reviews {
  // CREATE
  static async create({ input }) {
    const { name, description, rating, clubId } = input;
  
    try {
      // Ensure the club exists
      const club = await prisma.club.findUnique({
        where: { id: parseInt(clubId) },
      });
  
      if (!club) {
        throw new Error("Club not found");
      }
  
      // Create the review
      const review = await prisma.review.create({
        data: {
          name,
          description,
          rating,
          clubId: parseInt(clubId), // Link review to the club
        },
      });
  
      return review;
    } catch (e) {
      console.error("Error creating review:", e.message);
      throw new Error("Failed to create review");
    }
  }
  

  // READ
  static async find({ id }) {
    try {
      return await prisma.review.findUnique({
        where: { id: parseInt(id) },
        include: { clubReviewed: true }, // Include associated club
      });
    } catch (e) {
      console.error("Error finding review:", e.message);
      throw new Error("Failed to find review");
    }
  }
  

  static async findAll() {
    try {
      return await prisma.review.findMany({
        include: { clubReviewed: true }, // Include associated clubs
      });
    } catch (e) {
      console.error("Error finding reviews:", e.message);
      throw new Error("Failed to find reviews");
    }
  }
  
}
