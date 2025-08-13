import React from 'react';

const Logo: React.FC<{ width?: number; height?: number; className?: string }> = ({ 
  width = 500, 
  height = 350, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center ${className}`} style={{ width, height }}>
      {/* AI Neural Network Crystal */}
      <div className="relative mr-8">
        <svg
          width={width * 0.28}
          height={height * 0.85}
          viewBox="0 0 140 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="50%" stopColor="#0099CC" />
              <stop offset="100%" stopColor="#006699" />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FF88" />
              <stop offset="100%" stopColor="#00CC6A" />
            </linearGradient>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
            </radialGradient>
            
            {/* Filters */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#00D4FF" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          <g transform="translate(70, 80)">
            {/* Outer glow effect */}
            <circle cx="0" cy="0" r="65" fill="url(#glowGradient)" opacity="0.4" />
            
            {/* Main crystal structure */}
            <g filter="url(#drop-shadow)">
              {/* Back faces */}
              <path
                d="M0 -50 L-30 -20 L-40 20 L0 45 L40 20 L30 -20 Z"
                fill="url(#primaryGradient)"
                opacity="0.9"
              />
              
              {/* Faceted surfaces with modern styling */}
              <path d="M0 -50 L-30 -20 L0 -15 Z" fill="#00E6FF" opacity="0.8" />
              <path d="M0 -50 L30 -20 L0 -15 Z" fill="#00F0FF" opacity="0.9" />
              <path d="M-30 -20 L-40 20 L0 -15 Z" fill="#0099DD" opacity="0.7" />
              <path d="M30 -20 L40 20 L0 -15 Z" fill="#00CCFF" opacity="0.8" />
              <path d="M-40 20 L0 45 L0 -15 Z" fill="#007AAA" opacity="0.6" />
              <path d="M40 20 L0 45 L0 -15 Z" fill="#0099CC" opacity="0.7" />
            </g>
            
            {/* AI Neural network nodes */}
            <g filter="url(#glow)">
              {/* Core nodes */}
              <circle cx="0" cy="-25" r="4" fill="#00FF88" />
              <circle cx="-15" cy="-5" r="3" fill="#00FF88" />
              <circle cx="15" cy="-5" r="3" fill="#00FF88" />
              <circle cx="-20" cy="15" r="3" fill="#00FF88" />
              <circle cx="20" cy="15" r="3" fill="#00FF88" />
              <circle cx="0" cy="25" r="4" fill="#00FF88" />
              
              {/* Connection lines */}
              <g stroke="#00FF88" strokeWidth="1.5" opacity="0.6">
                <line x1="0" y1="-25" x2="-15" y2="-5" />
                <line x1="0" y1="-25" x2="15" y2="-5" />
                <line x1="-15" y1="-5" x2="-20" y2="15" />
                <line x1="15" y1="-5" x2="20" y2="15" />
                <line x1="-15" y1="-5" x2="0" y2="25" />
                <line x1="15" y1="-5" x2="0" y2="25" />
                <line x1="-20" y1="15" x2="0" y2="25" />
                <line x1="20" y1="15" x2="0" y2="25" />
              </g>
              
              {/* Pulse effect nodes */}
              <g opacity="0.4">
                <circle cx="0" cy="-25" r="8" fill="none" stroke="#00FF88" strokeWidth="1">
                  <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="25" r="8" fill="none" stroke="#00FF88" strokeWidth="1">
                  <animate attributeName="r" values="8;12;8" dur="2s" begin="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" begin="1s" repeatCount="indefinite" />
                </circle>
              </g>
            </g>
            
            {/* Healthcare cross symbol integration */}
            <g transform="translate(0, -15)" opacity="0.3">
              <rect x="-2" y="-8" width="4" height="16" fill="#00FF88" rx="2" />
              <rect x="-8" y="-2" width="16" height="4" fill="#00FF88" rx="2" />
            </g>
            
            {/* Edge highlights */}
            <g stroke="#fff" strokeWidth="0.5" fill="none" opacity="0.4">
              <path d="M0 -50 L0 45" />
              <path d="M-30 -20 L30 -20" />
              <path d="M-40 20 L40 20" />
            </g>
          </g>
          
          {/* Floating data particles */}
          <g opacity="0.6">
            <circle cx="20" cy="30" r="1.5" fill="#00D4FF">
              <animateTransform attributeName="transform" type="translate" 
                values="0,0; 10,-10; 0,0" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="110" cy="50" r="1" fill="#00FF88">
              <animateTransform attributeName="transform" type="translate" 
                values="0,0; -8,12; 0,0" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="25" cy="120" r="1.5" fill="#00D4FF">
              <animateTransform attributeName="transform" type="translate" 
                values="0,0; 15,-5; 0,0" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </div>
      
      {/* Modern Typography */}
      <div className="flex flex-col">
        {/* Main PRISM text */}
        <div className="flex items-center mb-3">
          <div className="relative">
            <span 
              className="text-7xl font-black tracking-tight"
              style={{ 
                background: 'linear-gradient(135deg, #001F3F 0%, #003D7A 50%, #0066CC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                textShadow: '0 4px 20px rgba(0, 102, 204, 0.3)'
              }}
            >
              PRI
            </span>
            
            {/* AI-enhanced 'i' dot */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="animate-pulse">
                <circle cx="8" cy="8" r="6" fill="url(#accentGradient)" opacity="0.8" />
                <circle cx="8" cy="8" r="3" fill="#00FF88" />
                <circle cx="8" cy="8" r="8" fill="none" stroke="#00FF88" strokeWidth="1" opacity="0.3">
                  <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </div>
          
          <span 
            className="text-7xl font-black tracking-tight ml-2"
            style={{ 
              background: 'linear-gradient(135deg, #00B4D8 0%, #00D4FF 50%, #00FF88 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
              textShadow: '0 4px 20px rgba(0, 255, 136, 0.3)'
            }}
          >
            Sm
          </span>
          
          {/* Modern AI badge */}
          <div className="ml-4 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold">
            AI
          </div>
          
          <span 
            className="text-xl font-light ml-2 opacity-60"
            style={{ 
              color: '#001F3F',
              fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
            }}
          >
            ™
          </span>
        </div>
        
        {/* Enhanced subtitle with tech styling */}
        <div className="relative">
          <div 
            className="text-2xl font-medium tracking-wide"
            style={{ 
              color: '#001F3F',
              fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
              letterSpacing: '0.08em'
            }}
          >
            Predictive Readmission Intelligence System
          </div>
          
          {/* Subtle underline accent */}
          <div className="mt-2 h-1 w-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent rounded-full opacity-60"></div>
          
          {/* Tech keywords */}
          <div className="flex gap-3 mt-3">
            <span className="px-2 py-1 text-xs bg-cyan-100 text-cyan-800 rounded-full font-medium">
              Machine Learning
            </span>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
              Healthcare AI
            </span>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
              Predictive Analytics
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
