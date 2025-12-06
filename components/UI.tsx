import React, { useEffect, useState } from 'react';

// Qubic Token Icon
export const QubicIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Card: Premium matte finish with subtle borders and shadows, plus hover animation
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties }> = ({ children, className = '', onClick, style }) => (
  <div 
    onClick={onClick}
    className={`bg-card-gradient border border-borderSubtle rounded-xl p-6 shadow-panel transition-all duration-300 relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''} hover:-translate-y-1 hover:shadow-glow-primary ${className}`}
    style={style}
  >
    {/* Subtle top sheen */}
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40"></div>
    {/* Hover border glow */}
    <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/30 rounded-xl transition-all duration-300 pointer-events-none"></div>
    {children}
  </div>
);

// Button: Glowing Cyan with Pulse
export const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}> = ({ children, onClick, disabled, variant = 'primary', className = '' }) => {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 focus:ring-2 focus:ring-accent/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-mono";
  
  // Primary: Glowing Neon Cyan
  const primaryStyles = "bg-gradient-to-r from-accent to-cyan-300 text-background border border-transparent hover:shadow-[0_0_20px_rgba(31,240,255,0.6)] hover:brightness-110 hover:scale-[1.02] relative overflow-hidden";
  
  // Secondary: Dark outline
  const secondaryStyles = "bg-secondaryBg border border-primary/30 text-primary hover:text-accent hover:border-accent/50 hover:shadow-glow";

  const ghostStyles = "bg-transparent text-textMuted hover:text-accent hover:bg-accent/5";

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variant === 'primary' ? primaryStyles : variant === 'secondary' ? secondaryStyles : ghostStyles} ${className}`}
    >
      {variant === 'primary' && !disabled && (
        <span className="absolute inset-0 bg-white/20 animate-pulse-slow pointer-events-none"></span>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

// Input: Rounded with focus glow
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`bg-secondaryBg/60 border border-borderSubtle rounded-lg px-4 py-3 text-textPrimary placeholder-textMuted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 focus:shadow-glow w-full transition-all duration-200 font-mono text-sm backdrop-blur-sm ${props.className}`}
  />
);

// Badge: Colored status indicators
export const Badge: React.FC<{ label: string; color?: 'primary' | 'success' | 'danger' | 'accent' | 'neutral' }> = ({ label, color = 'neutral' }) => {
  const colors = {
    primary: 'bg-primary/20 text-primary border-primary/40 shadow-[0_0_10px_rgba(117,26,255,0.2)]',
    success: 'bg-success/10 text-success border-success/30 shadow-[0_0_10px_rgba(26,255,176,0.1)]',
    danger: 'bg-danger/10 text-danger border-danger/30 shadow-[0_0_10px_rgba(255,102,128,0.1)]',
    accent: 'bg-accent/10 text-accent border-accent/30 shadow-[0_0_10px_rgba(31,240,255,0.1)]',
    neutral: 'bg-gray-800 text-gray-400 border-gray-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border ${colors[color]} uppercase tracking-widest`}>
      {label}
    </span>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
  <h3 className="text-accent text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2 mb-4 drop-shadow-[0_0_5px_rgba(31,240,255,0.5)]">
    {icon}
    {children}
  </h3>
);

// Sparkline SVG
const Sparkline: React.FC<{ data: number[]; color: string; width?: number; height?: number }> = ({ data, color, width = 60, height = 20 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  
  const points = data.map((val, i) => {
    const x = i * step;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <filter id={`glow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polyline 
        points={points} 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        filter={`url(#glow-${color})`}
      />
    </svg>
  );
};

// KpiCard: Mini analytics block
export const KpiCard: React.FC<{ 
  label: string; 
  value: React.ReactNode; 
  subValue?: string | React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  sparklineData?: number[];
  color?: string;
  className?: string;
}> = ({ label, value, subValue, trend, sparklineData, color = '#1FF0FF', className = '' }) => (
  <div className={`bg-card-gradient border border-borderSubtle rounded-xl p-5 flex flex-col justify-between h-full hover:border-accent/50 transition-all duration-300 relative overflow-hidden group hover:shadow-glow ${className}`}>
    <div className="flex justify-between items-start mb-2 relative z-10">
      <span className="text-[10px] uppercase tracking-widest text-textSecondary font-bold group-hover:text-accent transition-colors">{label}</span>
      {trend && (
         <span className={`text-[10px] ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-textMuted'}`}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
         </span>
      )}
    </div>
    
    <div className="flex items-end justify-between relative z-10">
      <div>
        <div className="text-xl font-bold text-textPrimary tracking-tight font-mono">{value}</div>
        {subValue && <div className="text-[10px] text-textMuted mt-1 tracking-wide">{subValue}</div>}
      </div>
      
      {sparklineData && (
        <div className="opacity-60 group-hover:opacity-100 transition-opacity">
           <Sparkline data={sparklineData} color={color} />
        </div>
      )}
    </div>
    
    {/* Hover Glow Background */}
    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors pointer-events-none"></div>
  </div>
);

// Typewriter Effect for Text
export const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 20); // Speed of typing

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="font-mono text-sm leading-relaxed text-gray-200">
      {displayedText}
      <span className="typewriter-cursor"></span>
    </span>
  );
};