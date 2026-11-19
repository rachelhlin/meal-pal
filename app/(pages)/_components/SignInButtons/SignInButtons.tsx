'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import type { AuthProvider } from '@datalib/auth';
import { authClient } from '../../_utils/authClient';
import styles from '../../_styles/ui.module.scss';

const LABELS: Record<AuthProvider, string> = {
  github: 'Continue with GitHub',
  google: 'Continue with Google',
};

export default function SignInButtons({
  providers,
  callbackURL,
}: {
  providers: AuthProvider[];
  callbackURL?: string;
}) {
  const pathname = usePathname();
  const [pending, setPending] = useState<AuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (providers.length === 0) {
    return (
      <p className={styles.error}>
        Sign-in isn&apos;t configured on this server yet.
      </p>
    );
  }

  async function signIn(provider: AuthProvider) {
    setPending(provider);
    setError(null);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: callbackURL ?? pathname,
    });
    // success redirects away, so this only runs if it failed
    if (error) {
      setError(error.message ?? 'Sign-in failed. Please try again.');
      setPending(null);
    }
  }

  return (
    <div className={styles.signInButtons}>
      {providers.map((provider) => (
        <button
          key={provider}
          type="button"
          className={styles.secondaryButton}
          disabled={pending !== null}
          onClick={() => signIn(provider)}
        >
          {pending === provider ? 'Redirecting…' : LABELS[provider]}
        </button>
      ))}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
