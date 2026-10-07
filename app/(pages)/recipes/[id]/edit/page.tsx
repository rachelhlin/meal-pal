import gql from 'graphql-tag';
import { notFound } from 'next/navigation';

import RecipeForm from '../../../_components/RecipeForm/RecipeForm';
import SignInButton from '../../../_components/SignInButton/SignInButton';
import { updateRecipeAction } from '../../../_actions/recipes';
import gqlRequest from '../../../_utils/gqlRequest';
import getCurrentUser from '../../../_utils/session';
import styles from '../../../_styles/ui.module.scss';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit recipe · Meal Pal' };

const QUERY = gql`
  query EditRecipe($id: ID!) {
    recipe(id: $id) {
      id
      title
      ingredients
      instructions
      author {
        id
      }
    }
  }
`;

interface EditableRecipe {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  author: { id: string } | null;
}

export default async function EditRecipePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className={styles.page}>
        <h1>Edit recipe</h1>
        <div className={styles.signInPrompt}>
          <p>Sign in to edit your recipes.</p>
          <SignInButton />
        </div>
      </main>
    );
  }

  let recipe: EditableRecipe | null = null;
  try {
    recipe = (
      await gqlRequest<{ recipe: EditableRecipe | null }>(QUERY, {
        id: params.id,
      })
    ).recipe;
  } catch {
    recipe = null;
  }
  // Same 404 for "missing" and "not yours", so we don't reveal which recipes exist.
  if (!recipe || recipe.author?.id !== user.id) notFound();

  return (
    <main className={styles.page}>
      <h1>Edit recipe</h1>
      <RecipeForm
        action={updateRecipeAction.bind(null, recipe.id)}
        submitLabel="Save changes"
        defaults={{
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        }}
      />
    </main>
  );
}
