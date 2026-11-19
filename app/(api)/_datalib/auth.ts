import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import prisma from './_prisma/client.js';

// providers only turn on if their id + secret are in .env

const github =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }
    : undefined;

const google =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        prompt: 'select_account' as const, // otherwise it auto-picks whatever account you're logged into
      }
    : undefined;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  socialProviders: {
    ...(github ? { github } : {}),
    ...(google ? { google } : {}),
  },
  // same verified email on github and google = same account (better auth does this by default)
});

export type AuthProvider = 'github' | 'google';

export const enabledProviders: AuthProvider[] = [
  ...(github ? (['github'] as const) : []),
  ...(google ? (['google'] as const) : []),
];
