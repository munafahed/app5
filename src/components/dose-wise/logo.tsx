import type { SVGProps } from 'react';

export function DoseWiseLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="120"
      height="30"
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M25,5 C12.5,5 5,12.5 5,25 C5,33.5 10,42.5 20,45 C15,35 15,15 20,5 Z"
        fill="url(#logo-gradient)"
      />
      <text
        x="40"
        y="32"
        fontFamily="Inter, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
      >
        DoseWise
      </text>
    </svg>
  );
}
