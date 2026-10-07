'use client';

import { usePathname } from 'next/navigation';

import { authClient } from '../../_utils/authClient';
import styles from '../../_styles/ui.module.scss';

export default function SignInButton({
  label = 'Sign in with GitHub',
}: {
  label?: string;
}) {
  const pathname = usePathname();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() =>
        authClient.signIn.social({ provider: 'github', callbackURL: pathname })
      }
    >
      {label}
    </button>
  );
}
