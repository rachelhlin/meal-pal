'use server';

import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';

import handler from '@datalib/apolloServer';

export default async function handleApolloRequest(
  query: string,
  variables: object = {},
  revalidateCache?: { path?: string; type?: 'page' | 'layout'; tag?: string }
) {
  // Forward the visitor's cookies so the API can tell who is signed in.
  let cookie: string | null = null;
  try {
    cookie = headers().get('cookie');
  } catch {
    // no request scope (e.g. build time): treat as signed out
  }

  // Dummy URL: we call the Apollo handler in-process rather than over the network.
  const req = new Request('http://a', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const res = await handler(req);

  if (revalidateCache?.path) {
    revalidatePath(revalidateCache.path, revalidateCache.type);
  }
  if (revalidateCache?.tag) {
    revalidateTag(revalidateCache.tag);
  }

  return res.json();
}
