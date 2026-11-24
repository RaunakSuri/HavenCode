import React from 'react';

/**
 * BrandLogo: renders either the full HavenCode logo SVG or the standalone icon mark
 * from /logo.svg.
 * 
 * Props:
 * - variant: 'full' | 'icon' (default: 'full')
 * - className: additional classes applied to the root element
 * - iconOnly: boolean (shorthand for variant="icon")
 * - size: number | string (optional width/height constraint)
 */
export function BrandIcon({ className = "w-9 h-9", ...props }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient
          id="havenBrandGrad"
          x1="8"
          y1="4"
          x2="56"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#66E0FF" />
          <stop offset="0.5" stopColor="#1E90FF" />
          <stop offset="1" stopColor="#1B4FD8" />
        </linearGradient>
      </defs>
      <g transform="translate(0, 0)">
        <path
          d="M32 4 L58 22 V52 a8 8 0 0 1 -8 8 H14 a8 8 0 0 1 -8 -8 V22 Z"
          fill="url(#havenBrandGrad)"
          stroke="url(#havenBrandGrad)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M32 4 L58 22 V30 C46 24 18 24 6 30 V22 Z"
          fill="#fff"
          opacity="0.14"
        />
        <g
          fill="none"
          stroke="#fff"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="25,33 17,41 25,49" />
          <polyline points="39,33 47,41 39,49" />
          <line x1="35" y1="30" x2="29" y2="52" />
        </g>
      </g>
    </svg>
  );
}

export function BrandLogo({ className = "h-8 w-auto", ...props }) {
  return (
    <img
      src="/logo.svg"
      alt="HavenCode"
      className={className}
      {...props}
    />
  );
}

export default BrandLogo;
