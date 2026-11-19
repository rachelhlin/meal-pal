'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';

import {
  addGroceryItemsAction,
  addMissingToListAction,
} from '../../_actions/kitchen';
import styles from '../../_styles/ui.module.scss';

// with names: adds exactly those (pantry results). without: server works out
// what's missing from the saved pantry (recipe page)
export default function AddToListButton({
  recipeId,
  names,
  label = 'Add missing to grocery list',
  className,
}: {
  recipeId: string;
  names?: string[];
  label?: string;
  className?: string;
}) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onClick = () =>
    start(async () => {
      setError(null);
      const res = names
        ? await addGroceryItemsAction(names, recipeId)
        : await addMissingToListAction(recipeId);
      if (!res.ok) return setError(res.error);
      const n = res.data.added;
      setMessage(
        n === 0
          ? 'Already on your list'
          : `Added ${n} ${n === 1 ? 'item' : 'items'}`
      );
    });

  return (
    <div className={styles.addToList}>
      <button
        type="button"
        className={className ?? styles.secondaryButton}
        onClick={onClick}
        disabled={pending}
      >
        {pending ? 'Adding…' : label}
      </button>
      <span aria-live="polite">
        {message && (
          <span className={styles.success}>
            {message}. <Link href="/groceries">See list</Link>
          </span>
        )}
        {error && <span className={styles.error}>{error}</span>}
      </span>
    </div>
  );
}
