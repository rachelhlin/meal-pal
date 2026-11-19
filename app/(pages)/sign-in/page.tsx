import { redirect } from 'next/navigation';

import BowlMascot from '../_components/Mascot/BowlMascot';
import SignInOptions from '../_components/SignInButtons/SignInOptions';
import getCurrentUser from '../_utils/session';
import styles from '../_styles/ui.module.scss';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Sign in · Meal Pal' };

// only allow paths on this site, not full urls (open redirect)
function safeNext(next?: string) {
  return next && next.startsWith('/') && !next.startsWith('//')
    ? next
    : '/explore';
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = safeNext(searchParams.next);
  if (await getCurrentUser()) redirect(next);

  return (
    <main className={`${styles.pageNarrow} ${styles.centered}`}>
      <div
        className={styles.blob}
        style={{ width: 180, margin: '0 auto 16px' }}
      >
        <BowlMascot />
      </div>
      <h1>Welcome back!</h1>
      <div
        className={`${styles.signInPrompt} ${styles.formCard}`}
        style={{ marginTop: 24 }}
      >
        <p>Sign in to share recipes, leave reviews, and get AI cooking tips.</p>
        <SignInOptions callbackURL={next} />
        <p className={styles.muted}>
          Using the same email on both? You&apos;ll land in the same account
          either way.
        </p>
      </div>
    </main>
  );
}
