import gql from 'graphql-tag';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import AddToListButton from '../../_components/AddToListButton/AddToListButton';
import DeleteButton from '../../_components/DeleteButton/DeleteButton';
import ReviewForm from '../../_components/ReviewForm/ReviewForm';
import SignInOptions from '../../_components/SignInButtons/SignInOptions';
import StarRating from '../../_components/StarRating/StarRating';
import { deleteRecipeAction, deleteReviewAction } from '../../_actions/recipes';
import gqlRequest from '../../_utils/gqlRequest';
import getCurrentUser from '../../_utils/session';
import { formatDate, splitLines } from '../../_utils/text';
import type { RecipeDetail } from '../../_utils/types';
import styles from '../../_styles/ui.module.scss';

export const dynamic = 'force-dynamic';

const QUERY = gql`
  query Recipe($id: ID!) {
    recipe(id: $id) {
      id
      title
      ingredients
      instructions
      createdAt
      averageRating
      reviewCount
      author {
        id
        name
      }
      reviews {
        id
        rating
        comment
        createdAt
        author {
          id
          name
        }
      }
    }
  }
`;

async function loadRecipe(id: string): Promise<RecipeDetail | null> {
  try {
    return (await gqlRequest<{ recipe: RecipeDetail | null }>(QUERY, { id }))
      .recipe;
  } catch {
    return null; // malformed id, etc.
  }
}

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  const [user, recipe] = await Promise.all([
    getCurrentUser(),
    loadRecipe(params.id),
  ]);
  if (!recipe) notFound();

  const isOwner = !!user && recipe.author?.id === user.id;
  const hasReviewed =
    !!user && recipe.reviews.some((r) => r.author?.id === user.id);
  const ingredients = splitLines(recipe.ingredients);
  const steps = splitLines(recipe.instructions);

  return (
    <main className={styles.page}>
      <Link href="/explore" className={styles.backLink}>
        Back to recipes
      </Link>

      <div className={styles.titleBlock}>
        <h1>{recipe.title}</h1>
        <ul className={styles.infoPills}>
          {recipe.author && <li>by {recipe.author.name}</li>}
          <li>
            {recipe.averageRating === null ? (
              'No reviews yet'
            ) : (
              <span
                role="img"
                aria-label={`${recipe.averageRating.toFixed(
                  1
                )} out of 5 stars from ${recipe.reviewCount} reviews`}
              >
                <span className={styles.stars}>★</span>{' '}
                {recipe.averageRating.toFixed(1)} ({recipe.reviewCount}{' '}
                {recipe.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </li>
          <li>{formatDate(recipe.createdAt)}</li>
          <li>{ingredients.length} ingredients</li>
        </ul>
      </div>

      {isOwner && (
        <div className={styles.actions}>
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className={styles.secondaryButton}
          >
            Edit
          </Link>
          <DeleteButton
            action={deleteRecipeAction.bind(null, recipe.id)}
            confirmText="Delete this recipe and all its reviews? This can't be undone."
          >
            Delete recipe
          </DeleteButton>
        </div>
      )}

      <div className={styles.recipeBody}>
        <aside className={styles.ingredientsCard}>
          <h2>Ingredients</h2>
          <p className={styles.muted}>Tap to check things off.</p>
          <ul>
            {ingredients.map((item, i) => (
              <li key={i}>
                <label>
                  <input type="checkbox" />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
          {user ? (
            <AddToListButton
              recipeId={recipe.id}
              label="Add what I'm missing to my list"
              className={`${styles.yellowButton} ${styles.fullWidth}`}
            />
          ) : (
            <Link
              href="/pantry"
              className={`${styles.yellowButton} ${styles.fullWidth}`}
            >
              What else can I make?
            </Link>
          )}
        </aside>

        <section className={styles.steps}>
          <h2>Let&apos;s make it</h2>
          <ol>
            {steps.map((step, i) => (
              <li key={i}>
                <span className={styles.stepNum} aria-hidden="true">
                  {i + 1}
                </span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className={styles.reviews}>
        <h2>Notes from other cooks</h2>
        <div className={styles.reviewsLayout}>
          <div className={styles.reviewList}>
            {recipe.reviews.length === 0 && (
              <p className={styles.muted}>
                No reviews yet. Tried it? Be the first!
              </p>
            )}
            {recipe.reviews.map((review) => (
              <article key={review.id} className={styles.bubbleRow}>
                <span className={styles.avatar} aria-hidden="true">
                  {(review.author?.name ?? '?').charAt(0).toUpperCase()}
                </span>
                <div className={styles.bubble}>
                  <div className={styles.reviewHeader}>
                    <strong>{review.author?.name ?? 'Someone'}</strong>
                    <StarRating value={review.rating} />
                  </div>
                  <p>{review.comment}</p>
                  <div
                    className={styles.reviewHeader}
                    style={{ marginTop: 8, marginBottom: 0 }}
                  >
                    <span className={styles.muted}>
                      {formatDate(review.createdAt)}
                    </span>
                    {user && review.author?.id === user.id && (
                      <DeleteButton
                        action={deleteReviewAction.bind(null, review.id)}
                        confirmText="Delete your review?"
                        small
                      >
                        Delete
                      </DeleteButton>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={`${styles.reviewSide} ${styles.dashedCard}`}>
            <h3>Made it? Tell us!</h3>
            {!user ? (
              <div className={styles.signInPrompt}>
                <p>Sign in to rate this recipe and leave a note.</p>
                <SignInOptions />
              </div>
            ) : hasReviewed ? (
              <p>You&apos;ve already reviewed this one. Thanks!</p>
            ) : (
              <ReviewForm recipeId={recipe.id} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
