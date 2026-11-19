// the little soup bowl. decorative unless a label is passed
export default function BowlMascot({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  const a11y = label
    ? { role: 'img', 'aria-label': label }
    : { 'aria-hidden': true };

  return (
    <svg viewBox="0 0 240 240" className={className} {...a11y}>
      <path
        d="M92 44c-14 14 14 22 0 38M122 30c-14 14 14 22 0 38M152 44c-14 14 14 22 0 38"
        fill="none"
        stroke="#FFFBF5"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <ellipse
        cx="120"
        cy="112"
        rx="96"
        ry="20"
        fill="#F6D57A"
        stroke="#613503"
        strokeWidth="7"
      />
      <path
        d="M24 112h192c0 58-43 92-96 92S24 170 24 112z"
        fill="#FFFBF5"
        stroke="#613503"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M96 210h48"
        stroke="#613503"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="90" cy="148" r="7" fill="#613503" />
      <circle cx="150" cy="148" r="7" fill="#613503" />
      <ellipse cx="70" cy="164" rx="13" ry="8" fill="#F4B6A6" />
      <ellipse cx="170" cy="164" rx="13" ry="8" fill="#F4B6A6" />
      <path
        d="M106 164c8 9 20 9 28 0"
        fill="none"
        stroke="#613503"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
