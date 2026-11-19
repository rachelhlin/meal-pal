'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';

import {
  addGroceryItemsAction,
  clearCheckedAction,
  moveCheckedToPantryAction,
  removeGroceryItemAction,
  setGroceryCheckedAction,
} from '../../_actions/kitchen';
import type { GroceryItem } from '../../_utils/types';
import styles from '../../_styles/ui.module.scss';

export default function GroceryList({
  initialItems,
}: {
  initialItems: GroceryItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const toBuy = items.filter((i) => !i.checked);
  const bought = items.filter((i) => i.checked);

  // update the screen right away, roll back if the server says no
  const optimistic = (
    next: GroceryItem[],
    action: () => Promise<{ ok: boolean; error?: string }>
  ) => {
    const before = items;
    setItems(next);
    setError(null);
    setMessage(null);
    start(async () => {
      const res = await action();
      if (!res.ok) {
        setItems(before);
        setError(res.error ?? 'Something went wrong');
      }
    });
  };

  const toggle = (item: GroceryItem) =>
    optimistic(
      items.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)),
      () => setGroceryCheckedAction(item.id, !item.checked)
    );

  const remove = (item: GroceryItem) =>
    optimistic(
      items.filter((i) => i.id !== item.id),
      () => removeGroceryItemAction(item.id)
    );

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const names = draft
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!names.length) return;
    setDraft('');
    start(async () => {
      const res = await addGroceryItemsAction(names);
      if (res.ok) setItems(res.data.items);
      else setError(res.error);
    });
  };

  const moveToKitchen = () =>
    optimistic(
      items.filter((i) => !i.checked),
      async () => {
        const res = await moveCheckedToPantryAction();
        if (res.ok) setMessage(`Moved ${res.data} to your kitchen.`);
        return res;
      }
    );

  const clearBought = () =>
    optimistic(
      items.filter((i) => !i.checked),
      clearCheckedAction
    );

  const row = (item: GroceryItem) => (
    <li key={item.id} className={styles.groceryRow}>
      <label>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => toggle(item)}
        />
        <span>
          <span className={styles.groceryName}>{item.name}</span>
          {item.recipe && (
            <span className={styles.muted}>
              {' '}
              for{' '}
              <Link href={`/recipes/${item.recipe.id}`}>
                {item.recipe.title}
              </Link>
            </span>
          )}
        </span>
      </label>
      <button
        type="button"
        className={styles.chipRemove}
        aria-label={`Remove ${item.name}`}
        onClick={() => remove(item)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </li>
  );

  return (
    <div className={styles.groceryLayout}>
      <section className={styles.groceryCard}>
        <form
          onSubmit={add}
          className={styles.kitchenRow}
          style={{ marginBottom: 20 }}
        >
          <label htmlFor="grocery-add" className={styles.visuallyHidden}>
            Add to your list
          </label>
          <input
            id="grocery-add"
            value={draft}
            maxLength={300}
            placeholder="Add something, e.g. lemons"
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={!draft.trim() || pending}
          >
            Add
          </button>
        </form>

        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}

        <h2 className={styles.groceryHeading}>To buy ({toBuy.length})</h2>
        {toBuy.length === 0 ? (
          <p className={styles.muted}>Nothing left to buy.</p>
        ) : (
          <ul className={styles.groceryItems}>{toBuy.map(row)}</ul>
        )}

        {bought.length > 0 && (
          <>
            <h2 className={styles.groceryHeading} style={{ marginTop: 28 }}>
              Got it ({bought.length})
            </h2>
            <ul className={`${styles.groceryItems} ${styles.groceryBought}`}>
              {bought.map(row)}
            </ul>
          </>
        )}
      </section>

      <aside className={styles.dashedCard} style={{ flex: '1 1 280px' }}>
        <h3>Done shopping?</h3>
        <p style={{ marginBottom: 18 }}>
          Tick off what you bought, then move it into your kitchen so &quot;What
          can I make?&quot; knows you have it.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            type="button"
            className={styles.button}
            onClick={moveToKitchen}
            disabled={!bought.length || pending}
          >
            Move to my kitchen
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={clearBought}
            disabled={!bought.length || pending}
          >
            Just clear them
          </button>
        </div>
        {message && (
          <p className={styles.success} aria-live="polite">
            {message} <Link href="/pantry">See what you can make</Link>
          </p>
        )}
      </aside>
    </div>
  );
}
