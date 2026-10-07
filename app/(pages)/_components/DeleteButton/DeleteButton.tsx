'use client';

import SubmitButton from '../SubmitButton/SubmitButton';

// A delete button that asks "are you sure?" before running a server action.
export default function DeleteButton({
  action,
  confirmText,
  children = 'Delete',
}: {
  action: () => Promise<void>;
  confirmText: string;
  children?: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <SubmitButton variant="danger">{children}</SubmitButton>
    </form>
  );
}
