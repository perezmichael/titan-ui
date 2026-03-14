export function PowerBILogo({ className }: { className?: string }) {
  return (
    <svg
      className={`${className} object-cover`}
      style={{ width: '28px', height: '28px' }}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="28" height="28" rx="4" fill="#F2C811" />
      <rect x="6" y="14" width="4" height="8" fill="#333333" />
      <rect x="12" y="10" width="4" height="12" fill="#333333" />
      <rect x="18" y="6" width="4" height="16" fill="#333333" />
    </svg>
  );
}
