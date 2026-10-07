import styles from '../../_styles/ui.module.scss';

export default function StarRating({
  value,
  count,
}: {
  value: number | null;
  count?: number;
}) {
  if (value === null)
    return <span className={styles.muted}>No reviews yet</span>;

  const filled = Math.round(value);
  return (
    <span
      className={styles.stars}
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      {'★'.repeat(filled)}
      <span className={styles.starsOff}>{'★'.repeat(5 - filled)}</span>
      {count !== undefined && <span className={styles.muted}> ({count})</span>}
    </span>
  );
}
