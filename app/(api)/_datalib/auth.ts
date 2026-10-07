import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import prisma from './_prisma/client.js';

// Server-side auth config. Needs BETTER_AUTH_SECRET, BETTER_AUTH_URL,
// GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env (see .env.example).
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
