import gql from 'graphql-tag';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import DeleteButton from '../../_components/DeleteButton/DeleteButton';
import ReviewForm from '../../_components/ReviewForm/ReviewForm';
import SignInButton from '../../_components/SignInButton/SignInButton';
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

  return (
    <main className={styles.page}>
      <h1>{recipe.title}</h1>
      <p className={styles.muted}>
        {recipe.author && <>By {recipe.author.name} · </>}
        Shared {formatDate(recipe.createdAt)} ·{' '}
        <StarRating value={recipe.averageRating} count={recipe.reviewCount} />
      </p>

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
        <section>
          <h2>Ingredients</h2>
          <ul>
            {splitLines(recipe.ingredients).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Instructions</h2>
          <ol>
            {splitLines(recipe.instructions).map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      </div>

      <section className={styles.reviews}>
        <h2>Reviews</h2>
        {recipe.reviews.length === 0 && (
          <p className={styles.muted}>
            No reviews yet. Tried it? Be the first.
          </p>
        )}
        {recipe.reviews.map((review) => (
          <article key={review.id} className={styles.review}>
            <div className={styles.reviewHeader}>
              <StarRating value={review.rating} />
              {user && review.author?.id === user.id && (
                <DeleteButton
                  action={deleteReviewAction.bind(null, review.id)}
                  confirmText="Delete your review?"
                >
                  Delete
                </DeleteButton>
              )}
            </div>
            <p>{review.comment}</p>
            <p className={styles.muted}>
              {review.author ? `${review.author.name} · ` : ''}
              {formatDate(review.createdAt)}
            </p>
          </article>
        ))}

        <h3>Leave a review</h3>
        {!user ? (
          <div className={styles.signInPrompt}>
            <p>Sign in to rate and review this recipe.</p>
            <SignInButton />
          </div>
        ) : hasReviewed ? (
          <p className={styles.muted}>
            You&apos;ve already reviewed this recipe.
          </p>
        ) : (
          <ReviewForm recipeId={recipe.id} />
        )}
      </section>
    </main>
  );
}
