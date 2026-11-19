import gql from 'graphql-tag';

import gqlRequest from './gqlRequest';
import getCurrentUser from './session';

const PANTRY = gql`
  query MyPantry {
    myPantry {
      name
    }
  }
`;

// saved pantry names for the signed-in user, or null when signed out
export async function getSavedPantry(): Promise<string[] | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  try {
    return (
      await gqlRequest<{ myPantry: { name: string }[] }>(PANTRY)
    ).myPantry.map((p) => p.name);
  } catch {
    return [];
  }
}
