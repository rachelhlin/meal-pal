import Link from 'next/link';

import StarRating from '../StarRating/StarRating';
import { splitLines } from '../../_utils/text';
import type { RecipeSummary } from '../../_utils/types';
import styles from '../../_styles/ui.module.scss';

const ICONS = [
  'M5 11a4 4 0 0 1 2-7h10a4 4 0 0 1 2 7v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z', // bread
  'M4 10h11v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zM15 12h6', // pan
  'M3 11h18a9 9 0 0 1-18 0zM9 7c-1 1 1 2 0 3M13 6c-1 1 1 2 0 3', // bowl
  'M12 13v8M9 3c0 5 1 10 3 10s3-5 3-10c-2-1-4-1-6 0z', // whisk
];
const TINTS = ['#FCE9C6', '#F6D57A', '#F3DEC2'];

export default function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  const ingredients = splitLines(recipe.ingredients);
  const preview = ingredients.slice(0, 4).join(', ');
  const more = ingredients.length - 4;
  // pick an icon from the id so each recipe keeps the same one
  const n = Number(recipe.id) || 0;

  return (
    <Link href={`/recipes/${recipe.id}`} className={styles.card}>
      <span
        className={styles.cardIcon}
        style={{ background: TINTS[n % TINTS.length] }}
        aria-hidden="true"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#613503"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={ICONS[n % ICONS.length]} />
        </svg>
      </span>
      <span className={styles.cardTitle}>{recipe.title}</span>
      <span className={styles.muted}>
        {preview}
        {more > 0 && ` +${more} more`}
      </span>
      <span className={styles.cardMeta}>
        <StarRating
          value={recipe.averageRating}
          count={recipe.reviewCount}
          variant="pill"
        />
        {recipe.author && <span>by {recipe.author.name}</span>}
      </span>
    </Link>
  );
}
