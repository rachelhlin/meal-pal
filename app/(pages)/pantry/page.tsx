import gql from 'graphql-tag';
import Link from 'next/link';

import AddToListButton from '../_components/AddToListButton/AddToListButton';
import KitchenForm from '../_components/KitchenForm/KitchenForm';
import LogoIcon from '../_components/Mascot/LogoIcon';
import StarRating from '../_components/StarRating/StarRating';
import gqlRequest from '../_utils/gqlRequest';
import { getSavedPantry } from '../_utils/kitchen';
import getCurrentUser from '../_utils/session';
import type { RecipeSummary } from '../_utils/types';
import styles from '../_styles/ui.module.scss';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'What can I make? · Meal Pal' };

const QUERY = gql`
  query Pantry($ingredients: [String!]!, $useAi: Boolean) {
    recommendRecipes(ingredients: $ingredients, useAi: $useAi) {
      pantry
      aiUsed
      aiNote
      matches {
        score
        matched
        missing
        reason
        substitutions {
          missing
          suggestion
        }
        recipe {
          id
          title
          averageRating
          reviewCount
          author {
            id
            name
          }
        }
      }
    }
  }
`;

interface PantryMatch {
  score: number;
  matched: string[];
  missing: string[];
  reason: string | null;
  substitutions: { missing: string; suggestion: string }[];
  recipe: Pick<
    RecipeSummary,
    'id' | 'title' | 'averageRating' | 'reviewCount' | 'author'
  >;
}

interface PantryResult {
  pantry: string[];
  aiUsed: boolean;
  aiNote: string | null;
  matches: PantryMatch[];
}

export default async function PantryPage({
  searchParams,
}: {
  searchParams: { items?: string; ai?: string | string[] };
}) {
  const typed = (searchParams.items ?? '')
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  // ai=0 turns it off. arrays come from the old form that sent ai=0&ai=1
  const ai = searchParams.ai;
  const useAi = Array.isArray(ai) ? ai.includes('1') : ai !== '0';
  const user = await getCurrentUser();
  const savedPantry = user ? await getSavedPantry() : null;
  // signed in with a saved kitchen? use it when nothing was typed
  const ingredients = typed.length > 0 ? typed : savedPantry ?? [];

  if (ingredients.length === 0) {
    return (
      <main className={styles.pageNarrow}>
        <h1>What can I make?</h1>
        <p className={styles.lead}>
          Add what&apos;s in your kitchen and we&apos;ll find recipes
          you&apos;re closest to making.
          {!user && ' Sign in to get AI tips for anything you are missing.'}
        </p>
        <KitchenForm showAiOption={!!user} saved={!!user} />
      </main>
    );
  }

  let result: PantryResult | null = null;
  let error: string | null = null;
  try {
    result = (
      await gqlRequest<{ recommendRecipes: PantryResult }>(QUERY, {
        ingredients,
        useAi,
      })
    ).recommendRecipes;
  } catch (e) {
    error = e instanceof Error ? e.message : 'Something went wrong';
  }

  return (
    <main className={styles.page}>
      <div className={styles.headerRow}>
        <h1>Here&apos;s what you can make</h1>
      </div>

      <ul
        className={styles.chips}
        aria-label="Ingredients you have"
        style={{ marginBottom: 20 }}
      >
        {(result?.pantry ?? ingredients).map((item) => (
          <li key={item} className={styles.chip}>
            {item}
          </li>
        ))}
      </ul>

      <details className={styles.changeIngredients}>
        <summary>Change ingredients</summary>
        <KitchenForm
          initialItems={user ? savedPantry ?? [] : ingredients}
          showAiOption={!!user}
          useAiDefault={useAi}
          saved={!!user}
        />
      </details>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      {result && (
        <section aria-live="polite">
          {result.aiNote && <p className={styles.notice}>{result.aiNote}</p>}

          {result.matches.length === 0 ? (
            <div className={styles.emptyState}>
              <p>
                No recipes use those ingredients yet. Try adding a few more, or
                share one of your own.
              </p>
              <Link href="/create" className={styles.button}>
                Share a recipe
              </Link>
            </div>
          ) : (
            <ol className={styles.matchList}>
              {result.matches.map((m) => {
                const total = m.matched.length + m.missing.length;
                return (
                  <li key={m.recipe.id} className={styles.matchCard}>
                    <div className={styles.matchTop}>
                      <div style={{ flex: '1 1 360px', minWidth: 0 }}>
                        <h2>
                          <Link href={`/recipes/${m.recipe.id}`}>
                            {m.recipe.title}
                          </Link>
                        </h2>
                        <StarRating
                          value={m.recipe.averageRating}
                          count={m.recipe.reviewCount}
                          variant="pill"
                        />
                        {m.recipe.author && (
                          <span className={styles.muted}>
                            {' '}
                            by {m.recipe.author.name}
                          </span>
                        )}
                      </div>
                      <div className={styles.matchProgress}>
                        <p>
                          You have {m.matched.length} of {total}
                        </p>
                        <div
                          className={styles.progressTrack}
                          role="img"
                          aria-label={`You have ${m.matched.length} of ${total} ingredients`}
                        >
                          <div
                            className={styles.progressFill}
                            style={{ width: `${Math.round(m.score * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {m.reason && (
                      <div className={styles.tipRow}>
                        <LogoIcon size={44} steam={false} />
                        <p className={styles.tipBubble}>
                          <span className={styles.aiBadge}>AI tip</span>
                          {m.reason}
                        </p>
                      </div>
                    )}

                    <div className={styles.matchCols}>
                      <div>
                        <h3>
                          {m.missing.length > 0
                            ? 'Still need'
                            : 'You have everything!'}
                        </h3>
                        {m.missing.length > 0 && (
                          <ul className={styles.chips} style={{ gap: 8 }}>
                            {m.missing.map((item) => (
                              <li key={item} className={styles.missingChip}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {m.substitutions.length > 0 && (
                        <div>
                          <h3>Easy swaps</h3>
                          <ul className={styles.substitutions}>
                            {m.substitutions.map((s) => (
                              <li key={s.missing}>
                                <strong>No {s.missing}?</strong> {s.suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {user && m.missing.length > 0 && (
                      <div style={{ marginTop: 20 }}>
                        <AddToListButton
                          recipeId={m.recipe.id}
                          names={m.missing}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          {result.aiUsed && (
            <p className={styles.muted}>
              AI tips can be wrong, so double-check swaps if you have allergies.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
