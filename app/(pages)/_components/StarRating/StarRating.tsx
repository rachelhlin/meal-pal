import styles from '../../_styles/ui.module.scss';

// "stars" draws five stars (reviews), "pill" is the compact ★ 4.9 (42) badge
export default function StarRating({
  value,
  count,
  variant = 'stars',
}: {
  value: number | null;
  count?: number;
  variant?: 'stars' | 'pill';
}) {
  if (value === null)
    return <span className={styles.muted}>No reviews yet</span>;

  const label = `${value.toFixed(1)} out of 5 stars${
    count !== undefined ? ` from ${count} reviews` : ''
  }`;

  if (variant === 'pill') {
    return (
      <span className={styles.ratingPill} role="img" aria-label={label}>
        <span className={styles.star}>★</span> {value.toFixed(1)}
        {count !== undefined && <span className={styles.count}>({count})</span>}
      </span>
    );
  }

  const filled = Math.round(value);
  return (
    <span className={styles.stars} role="img" aria-label={label}>
      {'★'.repeat(filled)}
      <span className={styles.starsOff}>{'★'.repeat(5 - filled)}</span>
    </span>
  );
}
