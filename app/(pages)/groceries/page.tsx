import gql from 'graphql-tag';

import BowlMascot from '../_components/Mascot/BowlMascot';
import GroceryList from '../_components/GroceryList/GroceryList';
import SignInOptions from '../_components/SignInButtons/SignInOptions';
import gqlRequest from '../_utils/gqlRequest';
import getCurrentUser from '../_utils/session';
import type { GroceryItem } from '../_utils/types';
import styles from '../_styles/ui.module.scss';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Grocery list · Meal Pal' };

const QUERY = gql`
  query MyGroceryList {
    myGroceryList {
      id
      name
      checked
      recipe {
        id
        title
      }
    }
  }
`;

export default async function GroceriesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className={`${styles.pageNarrow} ${styles.centered}`}>
        <div
          className={styles.blob}
          style={{ width: 170, margin: '0 auto 16px' }}
        >
          <BowlMascot />
        </div>
        <h1>Your grocery list</h1>
        <div
          className={`${styles.signInPrompt} ${styles.formCard}`}
          style={{ marginTop: 24 }}
        >
          <p>
            Sign in to keep a grocery list. Add missing ingredients from any
            recipe with one tap.
          </p>
          <SignInOptions callbackURL="/groceries" />
        </div>
      </main>
    );
  }

  let items: GroceryItem[] = [];
  let failed = false;
  try {
    items = (await gqlRequest<{ myGroceryList: GroceryItem[] }>(QUERY))
      .myGroceryList;
  } catch {
    failed = true;
  }

  return (
    <main className={styles.page}>
      <h1>Grocery list</h1>
      <p className={styles.lead}>
        Missing ingredients from recipes land here. Same item twice? We merge
        it.
      </p>
      {failed ? (
        <p className={styles.error}>
          We couldn&apos;t load your list right now. Please try again.
        </p>
      ) : (
        <GroceryList initialItems={items} />
      )}
    </main>
  );
}
