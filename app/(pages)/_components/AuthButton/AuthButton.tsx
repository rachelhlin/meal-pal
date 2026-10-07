'use client';

import { usePathname, useRouter } from 'next/navigation';

import { authClient } from '../../_utils/authClient';

// Navbar sign in / sign out control.
export default function AuthButton({ className }: { className?: string }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (isPending) return null;

  if (!session) {
    return (
      <button
        type="button"
        className={className}
        onClick={() =>
          authClient.signIn.social({
            provider: 'github',
            callbackURL: pathname,
          })
        }
      >
        Sign in
      </button>
    );
  }

  return (
    <button
      type="button"
      className={className}
      title={`Signed in as ${session.user.name}`}
      onClick={() =>
        authClient.signOut({
          fetchOptions: { onSuccess: () => router.refresh() },
        })
      }
    >
      Sign out
    </button>
  );
}
