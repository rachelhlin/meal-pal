'use server';

import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';

import handler from '@datalib/apolloServer';

export default async function handleApolloRequest(
  query: string,
  variables: object = {},
  revalidateCache?: { path?: string; type?: 'page' | 'layout'; tag?: string }
) {
  // pass the cookie through so the api knows who's logged in
  let cookie: string | null = null;
  try {
    cookie = headers().get('cookie');
  } catch {
    // no request (build time), so just treat as logged out
  }

  // url doesn't matter, we call the handler directly instead of over http
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
