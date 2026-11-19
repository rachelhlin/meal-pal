'use client';

import { useFormStatus } from 'react-dom';

import styles from '../../_styles/ui.module.scss';

export default function SubmitButton({
  children,
  variant = 'primary',
  small = false,
  fullWidth = false,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'danger';
  small?: boolean;
  fullWidth?: boolean;
}) {
  const { pending } = useFormStatus();
  const className = [
    styles.button,
    variant === 'danger' && styles.dangerButton,
    small && styles.smallButton,
    fullWidth && styles.fullWidth,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? 'Working…' : children}
    </button>
  );
}
