import React from 'react';
import { cn } from "@/lib/utils";

const Logo: React.FC<{ width?: number; height?: number; className?: string }> = ({ 
  width = 40, 
  height = 40, 
  className = "" 
}) => {
  // A simple approximation: take the numeric part of the first h- or w- class.
  const sizeClass = className.split(' ').find(c => c.startsWith('h-') || c.startsWith('w-'));
  const size = sizeClass ? parseInt(sizeClass.split('-')[1]) * 4 : Math.min(width, height);


  return (
    <div className={cn("flex items-center", className)}>
      {/* Geometric Crystal Icon */}
      <svg
        width={size * 0.8}
        height={size}
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        {/* Crystal/Diamond shape with multiple facets */}
        <g transform="translate(50, 60)">
          {/* Back faces */}
          <path
            d="M0 -45 L-25 -15 L-35 15 L0 40 L35 15 L25 -15 Z"
            fill="hsl(var(--primary))"
          />
          
          {/* Left face */}
          <path
            d="M0 -45 L-25 -15 L-35 15 L0 40 Z"
            fill="hsl(var(--primary) / 0.8)"
          />
          
          {/* Right face */}
          <path
            d="M0 -45 L25 -15 L35 15 L0 40 Z"
            fill="hsl(var(--accent))"
          />
          
          {/* Top left facet */}
          <path
            d="M0 -45 L-25 -15 L0 -10 Z"
            fill="hsl(var(--accent) / 0.7)"
          />
          
          {/* Top right facet */}
          <path
            d="M0 -45 L25 -15 L0 -10 Z"
            fill="hsl(var(--accent) / 0.9)"
          />
          
          {/* Middle left facet */}
          <path
            d="M-25 -15 L-35 15 L0 -10 Z"
            fill="hsl(var(--primary) / 0.6)"
          />
          
          {/* Middle right facet */}
          <path
            d="M25 -15 L35 15 L0 -10 Z"
            fill="hsl(var(--accent) / 0.8)"
          />
          
          {/* Bottom left facet */}
          <path
            d="M-35 15 L0 40 L0 -10 Z"
            fill="hsl(var(--primary) / 0.7)"
          />
          
          {/* Bottom right facet */}
          <path
            d="M35 15 L0 40 L0 -10 Z"
            fill="hsl(var(--accent) / 0.7)"
          />
          
          {/* Highlight lines */}
          <g stroke="hsl(var(--primary-foreground))" strokeWidth="1" fill="none" opacity="0.3">
            <path d="M0 -45 L0 40" />
            <path d="M-25 -15 L25 -15" />
            <path d="M-35 15 L35 15" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Logo;
