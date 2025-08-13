import React from 'react';

const ProfessionalPrismLogo: React.FC<{
  className?: string;
  showText?: boolean;
}> = ({ className = '', showText = false }) => {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
    >
      {/* Professional Crystal Icon */}
      <div className="relative h-full w-auto aspect-[130/150]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 130 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="primaryGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#2C5F5D" />
              <stop offset="50%" stopColor="#3D7875" />
              <stop offset="100%" stopColor="#4A9B96" />
            </linearGradient>
            <linearGradient
              id="accentGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#5BA8A3" />
              <stop offset="100%" stopColor="#7BC4BF" />
            </linearGradient>
            <linearGradient
              id="shadowGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1A4440" />
              <stop offset="100%" stopColor="#2C5F5D" />
            </linearGradient>
            <filter
              id="drop-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="6"
                stdDeviation="12"
                floodColor="#2C5F5D"
                floodOpacity="0.25"
              />
            </filter>
          </defs>

          <g transform="translate(65, 75)">
            <g filter="url(#drop-shadow)">
              <path
                d="M0 -48 L-28 -18 L-36 18 L0 42 L36 18 L28 -18 Z"
                fill="url(#primaryGradient)"
              />
              <path d="M0 -48 L-28 -18 L0 -12 Z" fill="#5BA8A3" />
              <path d="M0 -48 L28 -18 L0 -12 Z" fill="#6BB3AE" />
              <path d="M-28 -18 L-36 18 L0 -12 Z" fill="#4A9B96" />
              <path d="M28 -18 L36 18 L0 -12 Z" fill="#5BA8A3" />
              <path
                d="M-36 18 L0 42 L0 -12 Z"
                fill="url(#shadowGradient)"
              />
              <path d="M36 18 L0 42 L0 -12 Z" fill="#4A9B96" />
            </g>
            <g transform="translate(0, -6)">
              <rect
                x="-2.5"
                y="-12"
                width="5"
                height="24"
                fill="#ffffff"
                opacity="0.9"
                rx="1"
              />
              <rect
                x="-12"
                y="-2.5"
                width="24"
                height="5"
                fill="#ffffff"
                opacity="0.9"
                rx="1"
              />
            </g>
            <g stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.4">
              <path d="M0 -48 L0 42" />
              <path d="M-28 -18 L28 -18" />
              <path d="M-36 18 L36 18" />
            </g>
            <g fill="#7BC4BF" opacity="0.6">
              <circle cx="-28" cy="-18" r="1.5" />
              <circle cx="28" cy="-18" r="1.5" />
              <circle cx="-36" cy="18" r="1.5" />
              <circle cx="36" cy="18" r="1.5" />
            </g>
          </g>
        </svg>
      </div>

      {/* Professional Typography */}
      {showText && (
        <div className="flex flex-col ml-4">
          {/* Main PRISM text */}
          <div className="flex items-center mb-4">
            <span
              className="text-7xl font-bold tracking-tight"
              style={{
                color: '#1A4440',
                fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
                fontWeight: '700',
              }}
            >
              PRI
            </span>

            {/* Professional 'i' with medical cross */}
            <div className="relative mx-1">
              <svg width="14" height="18" viewBox="0 0 14 18" className="mt-2">
                <rect x="5" y="2" width="4" height="14" fill="#2C5F5D" rx="1" />
                <rect x="1" y="6" width="12" height="4" fill="#2C5F5D" rx="1" />
              </svg>
            </div>

            <span
              className="text-7xl font-bold tracking-tight"
              style={{
                color: '#4A9B96',
                fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
                fontWeight: '700',
              }}
            >
              Sm
            </span>

            <span
              className="text-2xl font-normal ml-3"
              style={{
                color: '#1A4440',
                fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
                fontSize: '1.5rem',
              }}
            >
              ™
            </span>
          </div>

          {/* Professional subtitle */}
          <div className="mb-4">
            <div
              className="text-2xl font-semibold tracking-wide leading-tight"
              style={{
                color: '#1A4440',
                fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
                letterSpacing: '0.05em',
                fontWeight: '600',
              }}
            >
              Predictive Readmission Intelligence System
            </div>

            {/* Professional accent line */}
            <div className="mt-3 h-0.5 w-40 bg-gradient-to-r from-teal-600 to-transparent"></div>
          </div>

          {/* Professional capability indicators */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-teal-600 rounded-full mr-2"></div>
              <span
                style={{
                  color: '#2C5F5D',
                  fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
                  fontWeight: '500',
                }}
              >
                Clinical Decision Support
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
              <span
                style={{
                  color: '#2C5F5D',
                  fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
                  fontWeight: '500',
                }}
              >
                Risk Assessment
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>
              <span
                style={{
                  color: '#2C5F5D',
                  fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
                  fontWeight: '500',
                }}
              >
                Patient Analytics
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// A helper function to determine if a class string contains width or height utilities
function hasSizeClass(className: string | undefined): boolean {
    if (!className) return false;
    return className.split(' ').some(cls => cls.startsWith('w-') || cls.startsWith('h-'));
}

import { cn } from "@/lib/utils"

export default ProfessionalPrismLogo;