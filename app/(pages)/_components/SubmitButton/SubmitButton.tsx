'use client';

import { useFormStatus } from 'react-dom';

import styles from '../../_styles/ui.module.scss';

export default function SubmitButton({
  children,
  variant = 'primary',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'danger';
}) {
  const { pending } = useFormStatus();
  const className =
    variant === 'danger'
      ? `${styles.button} ${styles.dangerButton}`
      : styles.button;

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? 'Working…' : children}
    </button>
  );
}
