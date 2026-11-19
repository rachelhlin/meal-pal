import gql from 'graphql-tag';
import Link from 'next/link';

import BowlMascot from '../_components/Mascot/BowlMascot';
import KitchenForm from '../_components/KitchenForm/KitchenForm';
import RecipeCard from '../_components/RecipeCard/RecipeCard';
import gqlRequest from '../_utils/gqlRequest';
import { getSavedPantry } from '../_utils/kitchen';
import type { RecipeSummary } from '../_utils/types';
import styles from '../_styles/ui.module.scss';

export const dynamic = 'force-dynamic';

const QUERY = gql`
  query LatestRecipes {
    recipes {
      id
      title
      ingredients
      createdAt
      averageRating
      reviewCount
      author {
        id
        name
      }
    }
  }
`;

export default async function Home() {
  const savedPantry = await getSavedPantry();
  let recipes: RecipeSummary[] = [];
  try {
    // TODO: add a limit arg to the query instead of slicing here
    recipes = (
      await gqlRequest<{ recipes: RecipeSummary[] }>(QUERY)
    ).recipes.slice(0, 6);
  } catch {
    // home page should still load if the db is down
  }

  return (
    <main>
      <div className={styles.page} style={{ paddingBottom: 0, minHeight: 0 }}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1>What should we cook today?</h1>
            <p className={styles.lead}>
              Tell us what&apos;s in your kitchen and we&apos;ll find cozy
              recipes from other home cooks that use it.
            </p>
            <KitchenForm
              saved={savedPantry !== null}
              initialItems={savedPantry ?? []}
            />
          </div>
          <div className={styles.heroArt}>
            <div className={styles.blob}>
              <BowlMascot label="A smiling bowl of soup" />
            </div>
          </div>
        </section>

        <section style={{ paddingBottom: 72 }}>
          <div className={styles.headerRow}>
            <h2 style={{ fontSize: 40 }}>Fresh from the community</h2>
            <Link href="/explore">See all recipes</Link>
          </div>
          {recipes.length > 0 ? (
            <div className={styles.grid}>
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No recipes yet. Yours could be the first one here!</p>
              <Link href="/create" className={styles.button}>
                Share a recipe
              </Link>
            </div>
          )}
        </section>
      </div>

      <section className={styles.shareBand}>
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 40c120-30 240-30 360 0s240 30 360 0 240-30 360 0 240 30 360 0v20H0z"
            fill="#E8B984"
          />
        </svg>
        <div className={styles.shareInner}>
          <div>
            <div style={{ flex: '1 1 440px' }}>
              <h2>Have a recipe everyone asks for?</h2>
              <p>
                Share it with the community. Other cooks can rate it and leave
                little notes.
              </p>
            </div>
            <Link href="/create" className={styles.button}>
              Share a recipe
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
