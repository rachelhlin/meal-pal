import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';

import typeDefs from './_typeDefs/index';
import resolvers from './_resolvers/index';
import { auth } from './auth';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
}) as ApolloServer<object>;

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  // Identify the caller from their session cookie. Resolvers read `userId`
  // from this context, so identity can never be supplied by the client.
  context: async (req) => {
    const session = await auth.api.getSession({ headers: req.headers });
    return { userId: session?.user.id ?? null };
  },
});

export default handler;
