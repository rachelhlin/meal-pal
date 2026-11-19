// small bowl used in the navbar and next to ai tips
export default function LogoIcon({
  size = 36,
  steam = true,
}: {
  size?: number;
  steam?: boolean;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M6 22h36c0 11-8 18-18 18S6 33 6 22z"
        fill="#E8B984"
        stroke="#613503"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="30" r="2" fill="#613503" />
      <circle cx="30" cy="30" r="2" fill="#613503" />
      <path
        d="M21 34c2 2 4 2 6 0"
        fill="none"
        stroke="#613503"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {steam && (
        <path
          d="M18 8c-3 3 3 5 0 9M28 6c-3 3 3 5 0 9"
          fill="none"
          stroke="#A67032"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
