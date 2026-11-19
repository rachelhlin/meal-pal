'use client';

import SubmitButton from '../SubmitButton/SubmitButton';

export default function DeleteButton({
  action,
  confirmText,
  children = 'Delete',
  small = false,
}: {
  action: () => Promise<void>;
  confirmText: string;
  children?: React.ReactNode;
  small?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <SubmitButton variant="danger" small={small}>
        {children}
      </SubmitButton>
    </form>
  );
}
