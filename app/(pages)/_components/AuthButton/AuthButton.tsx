'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { authClient } from '../../_utils/authClient';

export default function AuthButton({ className }: { className?: string }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (isPending) return null;

  if (!session) {
    const next = pathname === '/sign-in' ? '/explore' : pathname;
    return (
      <Link
        href={`/sign-in?next=${encodeURIComponent(next)}`}
        className={className}
      >
        Sign in
      </Link>
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
