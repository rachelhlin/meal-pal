'use client';

import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';

import { createReviewAction, type FormState } from '../../_actions/recipes';
import SubmitButton from '../SubmitButton/SubmitButton';
import styles from '../../_styles/ui.module.scss';

const initialState: FormState = {};

export default function ReviewForm({ recipeId }: { recipeId: string }) {
  const [state, formAction] = useFormState(
    createReviewAction.bind(null, recipeId),
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className={styles.form}>
      <fieldset className={styles.ratingPicker}>
        <legend>How many stars?</legend>
        <div className={styles.ratingOptions}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n}>
              <input type="radio" name="rating" value={n} required />
              {n}
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        Your note
        <textarea
          name="comment"
          required
          rows={4}
          maxLength={2000}
          placeholder="What worked, what you'd change"
        />
      </label>
      {state.error && (
        <p role="alert" className={styles.error}>
          {state.error}
        </p>
      )}
      {state.success && (
        <p className={styles.success}>Thanks for the review!</p>
      )}
      <SubmitButton fullWidth>Post review</SubmitButton>
    </form>
  );
}
