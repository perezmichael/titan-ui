export function SharePointLogo({ className }: { className?: string }) {
  return (
    <svg
      className={`${className} object-cover`}
      style={{ width: '28px', height: '28px' }}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="28" height="28" rx="4" fill="#0078D4" />
      <circle cx="10" cy="14" r="5" fill="#50A0E0" />
      <circle cx="17" cy="11" r="4" fill="#80C0F0" />
      <circle cx="19" cy="17" r="5" fill="white" />
      <text x="15.5" y="20.5" fontSize="7" fontWeight="bold" fill="#0078D4">S</text>
    </svg>
  );
}
