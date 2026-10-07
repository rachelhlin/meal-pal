import prisma from '../_prisma/client.js';

export default class Users {
  // Only expose what's safe to show publicly (never the email).
  static async findAuthor(id) {
    if (!id) return null;
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  }
}
