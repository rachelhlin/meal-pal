import gql from 'graphql-tag';
import Link from 'next/link';

import RecipeCard from '../_components/RecipeCard/RecipeCard';
import gqlRequest from '../_utils/gqlRequest';
import type { RecipeSummary } from '../_utils/types';
import styles from '../_styles/ui.module.scss';

// Data comes from the DB, so never prerender this at build time.
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Explore recipes · Meal Pal' };

const QUERY = gql`
  query Recipes($search: String) {
    recipes(search: $search) {
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

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() ?? '';
  let recipes: RecipeSummary[] = [];
  let failed = false;

  try {
    const data = await gqlRequest<{ recipes: RecipeSummary[] }>(QUERY, {
      search: q || null,
    });
    recipes = data.recipes;
  } catch {
    failed = true;
  }

  return (
    <main className={styles.page}>
      <h1>Explore recipes</h1>
      <form action="/explore" role="search" className={styles.search}>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by title…"
          aria-label="Search recipes"
        />
        <button type="submit" className={styles.button}>
          Search
        </button>
      </form>

      {failed ? (
        <p className={styles.error}>
          We couldn&apos;t load recipes right now. Please try again.
        </p>
      ) : recipes.length === 0 ? (
        <p className={styles.muted}>
          {q ? `No recipes match “${q}”.` : 'No recipes yet.'}{' '}
          <Link href="/create">Share one!</Link>
        </p>
      ) : (
        <div className={styles.grid}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </main>
  );
}
