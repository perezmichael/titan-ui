export function AtlasLogo({ className }: { className?: string }) {
  return (
    <svg
      className={`${className} object-cover`}
      style={{ width: '28px', height: '28px' }}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="28" height="28" rx="4" fill="#1A1A2E" />
      <circle cx="14" cy="14" r="7" stroke="#4FC3F7" strokeWidth="1.5" fill="none" />
      <ellipse cx="14" cy="14" rx="3.5" ry="7" stroke="#4FC3F7" strokeWidth="1.5" fill="none" />
      <line x1="7" y1="14" x2="21" y2="14" stroke="#4FC3F7" strokeWidth="1.5" />
    </svg>
  );
}
