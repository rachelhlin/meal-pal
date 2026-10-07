import { headers } from 'next/headers';

import { auth } from '@datalib/auth';

// Server-side: the signed-in user for this request, or null.
export default async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: headers() });
  return session?.user ?? null;
}
