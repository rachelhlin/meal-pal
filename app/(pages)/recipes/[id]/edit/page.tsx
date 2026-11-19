import gql from 'graphql-tag';
import { notFound } from 'next/navigation';

import RecipeForm from '../../../_components/RecipeForm/RecipeForm';
import SignInOptions from '../../../_components/SignInButtons/SignInOptions';
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
      <main className={styles.pageNarrow}>
        <h1 style={{ marginBottom: 24 }}>Edit recipe</h1>
        <div className={`${styles.signInPrompt} ${styles.formCard}`}>
          <p>Sign in to edit your recipes.</p>
          <SignInOptions />
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
  // 404 for both so you can't tell which ids exist
  if (!recipe || recipe.author?.id !== user.id) notFound();

  return (
    <main className={styles.pageNarrow}>
      <h1 style={{ marginBottom: 24 }}>Edit recipe</h1>
      <div className={styles.formCard}>
        <RecipeForm
          action={updateRecipeAction.bind(null, recipe.id)}
          submitLabel="Save changes"
          defaults={{
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
          }}
        />
      </div>
    </main>
  );
}
