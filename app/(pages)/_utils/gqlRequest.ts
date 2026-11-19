import { print, type DocumentNode } from 'graphql';

import handleApolloRequest from '@actions/handleApolloRequest';

// throws on graphql errors so callers can just try/catch
export default async function gqlRequest<T>(
  query: DocumentNode,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const json = await handleApolloRequest(print(query), variables);
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  return json.data as T;
}
