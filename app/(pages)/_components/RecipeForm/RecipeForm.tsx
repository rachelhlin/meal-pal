'use client';

import { useFormState } from 'react-dom';

import type { FormState, createRecipeAction } from '../../_actions/recipes';
import SubmitButton from '../SubmitButton/SubmitButton';
import styles from '../../_styles/ui.module.scss';

const initialState: FormState = {};

interface RecipeFormProps {
  // Same shape as createRecipeAction; edit passes an action with the id already bound.
  action: typeof createRecipeAction;
  submitLabel: string;
  defaults?: { title: string; ingredients: string; instructions: string };
}

// Used for both creating and editing a recipe.
export default function RecipeForm({
  action,
  submitLabel,
  defaults,
}: RecipeFormProps) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className={styles.form}>
      <label>
        Title
        <input
          name="title"
          required
          maxLength={120}
          defaultValue={defaults?.title}
          placeholder="Grandma's tomato soup"
        />
      </label>
      <label>
        Ingredients <span className={styles.muted}>(one per line)</span>
        <textarea
          name="ingredients"
          required
          rows={6}
          maxLength={5000}
          defaultValue={defaults?.ingredients}
        />
      </label>
      <label>
        Instructions <span className={styles.muted}>(one step per line)</span>
        <textarea
          name="instructions"
          required
          rows={8}
          maxLength={10000}
          defaultValue={defaults?.instructions}
        />
      </label>
      {state.error && (
        <p role="alert" className={styles.error}>
          {state.error}
        </p>
      )}
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
