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
        <legend>Your rating</legend>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n}>
            <input type="radio" name="rating" value={n} required />
            {n} ★
          </label>
        ))}
      </fieldset>
      <label>
        Comment
        <textarea name="comment" required rows={3} maxLength={2000} />
      </label>
      {state.error && (
        <p role="alert" className={styles.error}>
          {state.error}
        </p>
      )}
      {state.success && (
        <p className={styles.success}>Thanks for the review!</p>
      )}
      <SubmitButton>Post review</SubmitButton>
    </form>
  );
}
