import Link from 'next/link';

import StarRating from '../StarRating/StarRating';
import { splitLines } from '../../_utils/text';
import type { RecipeSummary } from '../../_utils/types';
import styles from '../../_styles/ui.module.scss';

export default function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  const ingredients = splitLines(recipe.ingredients);
  const preview = ingredients.slice(0, 3).join(', ');
  const more = ingredients.length - 3;

  return (
    <Link href={`/recipes/${recipe.id}`} className={styles.card}>
      <h2>{recipe.title}</h2>
      <p className={styles.muted}>
        {preview}
        {more > 0 && ` +${more} more`}
      </p>
      <StarRating value={recipe.averageRating} count={recipe.reviewCount} />
      {recipe.author && <p className={styles.muted}>by {recipe.author.name}</p>}
    </Link>
  );
}
