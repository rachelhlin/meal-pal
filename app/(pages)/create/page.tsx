import RecipeForm from '../_components/RecipeForm/RecipeForm';
import SignInButton from '../_components/SignInButton/SignInButton';
import { createRecipeAction } from '../_actions/recipes';
import getCurrentUser from '../_utils/session';
import styles from '../_styles/ui.module.scss';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Share a recipe · Meal Pal' };

export default async function CreatePage() {
  const user = await getCurrentUser();

  return (
    <main className={styles.page}>
      <h1>Share a recipe</h1>
      {user ? (
        <RecipeForm action={createRecipeAction} submitLabel="Share recipe" />
      ) : (
        <div className={styles.signInPrompt}>
          <p>Sign in to share your own recipes.</p>
          <SignInButton />
        </div>
      )}
    </main>
  );
}
