import { toNextJsHandler } from 'better-auth/next-js';

import { auth } from '@datalib/auth';

export const { POST, GET } = toNextJsHandler(auth);
