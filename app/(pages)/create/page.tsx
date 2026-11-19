import RecipeForm from '../_components/RecipeForm/RecipeForm';
import SignInOptions from '../_components/SignInButtons/SignInOptions';
import { createRecipeAction } from '../_actions/recipes';
import getCurrentUser from '../_utils/session';
import styles from '../_styles/ui.module.scss';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Share a recipe · Meal Pal' };

export default async function CreatePage() {
  const user = await getCurrentUser();

  return (
    <main className={styles.pageNarrow}>
      <h1>Share a recipe</h1>
      <p className={styles.lead}>
        Write it the way you'd tell a friend. One ingredient or step per line.
      </p>
      <div className={styles.formCard}>
        {user ? (
          <RecipeForm action={createRecipeAction} submitLabel="Share recipe" />
        ) : (
          <div className={styles.signInPrompt}>
            <p>Sign in to share your own recipes.</p>
            <SignInOptions />
          </div>
        )}
      </div>
    </main>
  );
}
