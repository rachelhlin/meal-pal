import gql from 'graphql-tag';
import Link from 'next/link';

import RecipeCard from '../_components/RecipeCard/RecipeCard';
import gqlRequest from '../_utils/gqlRequest';
import type { RecipeSummary } from '../_utils/types';
import styles from '../_styles/ui.module.scss';

// otherwise next tries to build this at deploy time with no db
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
      <p className={styles.lead}>
        Everything the community has shared, newest first.
      </p>
      <form action="/explore" role="search" className={styles.search}>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search recipes, e.g. banana bread"
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
        <div className={styles.emptyState}>
          <p>
            {q ? `No recipes match “${q}” yet.` : 'No recipes yet.'} Want to add
            one?
          </p>
          <Link href="/create" className={styles.button}>
            Share a recipe
          </Link>
        </div>
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
