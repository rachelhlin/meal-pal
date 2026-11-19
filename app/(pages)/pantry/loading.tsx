import BowlMascot from '../_components/Mascot/BowlMascot';
import styles from '../_styles/ui.module.scss';

export default function Loading() {
  return (
    <main className={styles.pageNarrow} style={{ textAlign: 'center' }}>
      <div style={{ width: 160, margin: '40px auto 16px' }}>
        <BowlMascot />
      </div>
      <p
        role="status"
        style={{
          fontFamily: 'var(--font-heading-stack)',
          fontSize: 24,
          fontWeight: 600,
        }}
      >
        Stirring the pot…
      </p>
    </main>
  );
}
