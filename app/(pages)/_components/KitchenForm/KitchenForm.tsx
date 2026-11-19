'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  removePantryItemAction,
  savePantryItemsAction,
} from '../../_actions/kitchen';
import styles from '../../_styles/ui.module.scss';

const SUGGESTIONS = ['eggs', 'rice', 'pasta', 'chicken', 'bananas', 'cheese'];

const split = (text: string) =>
  text
    .split(/[,\n]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

// saved: signed in, so chips are stored on the account as you add/remove them
export default function KitchenForm({
  initialItems = [],
  showAiOption = false,
  useAiDefault = true,
  saved = false,
}: {
  initialItems?: string[];
  showAiOption?: boolean;
  useAiDefault?: boolean;
  saved?: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState<string[]>(initialItems);
  const [draft, setDraft] = useState('');
  const [useAi, setUseAi] = useState(useAiDefault);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  const add = (text: string) => {
    const next = split(text).filter((i) => !items.includes(i));
    setDraft('');
    setError(null);
    if (!next.length) return;
    setItems([...items, ...next].slice(0, 40));
    if (saved) {
      startSaving(async () => {
        const res = await savePantryItemsAction(next);
        // server returns the cleaned-up list ("eggs" -> "egg"), use that
        if (res.ok) setItems(res.data);
        else setError(res.error);
      });
    }
  };

  const remove = (item: string) => {
    setItems(items.filter((i) => i !== item));
    if (saved) {
      startSaving(async () => {
        const res = await removePantryItemAction(item);
        if (!res.ok) setError(res.error);
      });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // whatever is still typed in the box counts too
    const all = [...items, ...split(draft).filter((i) => !items.includes(i))];
    if (all.length === 0) {
      setError('Add at least one ingredient first.');
      return;
    }
    const params = new URLSearchParams({ items: all.join(',') });
    if (!useAi) params.set('ai', '0');
    router.push(`/pantry?${params}`);
  };

  const suggestions = SUGGESTIONS.filter((s) => !items.includes(s)).slice(0, 4);

  return (
    <form className={styles.kitchenForm} onSubmit={onSubmit}>
      <p className={styles.kitchenTitle}>
        In my kitchen
        {saved && (
          <span
            className={styles.hint}
            style={{ marginLeft: 10, fontFamily: 'var(--font-body-stack)' }}
            aria-live="polite"
          >
            {saving ? 'Saving…' : 'Saved to your account'}
          </span>
        )}
      </p>

      {items.length > 0 ? (
        <ul
          className={styles.chips}
          aria-label="Ingredients you have"
          style={{ marginBottom: 18 }}
        >
          {items.map((item) => (
            <li key={item} className={styles.chipRemovable}>
              {item}
              <button
                type="button"
                className={styles.chipRemove}
                aria-label={`Remove ${item}`}
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
          ))}
        </ul>
      ) : (
        <div className={styles.suggestions}>
          <span>Try:</span>
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => add(s)}>
              + {s}
            </button>
          ))}
        </div>
      )}

      <label
        htmlFor="kitchen-add"
        style={{ display: 'block', fontWeight: 800, marginBottom: 8 }}
      >
        Add an ingredient
      </label>
      <div className={styles.kitchenRow}>
        <input
          id="kitchen-add"
          value={draft}
          maxLength={200}
          placeholder="e.g. honey, or a few separated by commas"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // enter adds a chip instead of submitting, as long as something is typed
            if (e.key === 'Enter' && draft.trim()) {
              e.preventDefault();
              add(draft);
            }
          }}
        />
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => add(draft)}
          disabled={!draft.trim()}
        >
          Add
        </button>
      </div>

      {showAiOption && (
        <label
          className={styles.checkboxLabel}
          style={{ display: 'flex', marginTop: 16 }}
        >
          <input
            type="checkbox"
            checked={useAi}
            onChange={(e) => setUseAi(e.target.checked)}
          />
          Include AI tips and swaps
        </label>
      )}

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <button
        type="submit"
        className={`${styles.button} ${styles.fullWidth}`}
        style={{ marginTop: 18 }}
      >
        Find recipes
      </button>
    </form>
  );
}
