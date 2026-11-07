import React from 'react';
import { NetworkType } from '../types';

interface NetworkIconProps {
  network: NetworkType | string;
  className?: string;
  colored?: boolean;
}

// 1. Instagram Icon (Camera lens inside rounded square)
export const InstagramIcon: React.FC<{ className?: string; colored?: boolean }> = ({ 
  className = "w-4 h-4", 
  colored = false 
}) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={colored ? "url(#ig-gradient)" : "currentColor"} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    aria-label="Instagram"
  >
    {colored && (
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f58529" />
          <stop offset="50%" stopColor="#dd2a7b" />
          <stop offset="100%" stopColor="#8134af" />
        </linearGradient>
      </defs>
    )}
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// 2. Facebook Icon (Classic 'f')
export const FacebookIcon: React.FC<{ className?: string; colored?: boolean }> = ({ 
  className = "w-4 h-4", 
  colored = false 
}) => (
  <svg 
    viewBox="0 0 24 24" 
    fill={colored ? "#1877F2" : "currentColor"} 
    className={className}
    aria-label="Facebook"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// 3. TikTok Icon (Official musical note 'd')
export const TikTokIcon: React.FC<{ className?: string; colored?: boolean }> = ({ 
  className = "w-4 h-4", 
  colored = false 
}) => (
  <svg 
    viewBox="0 0 24 24" 
    fill={colored ? "#25F4EE" : "currentColor"} 
    className={className}
    aria-label="TikTok"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.87-4.49V8.62a8.28 8.28 0 0 0 4.9 1.58V6.75a4.86 4.86 0 0 1-1-.06z" />
  </svg>
);

// 4. LinkedIn Icon (Official 'in')
export const LinkedInIcon: React.FC<{ className?: string; colored?: boolean }> = ({ 
  className = "w-4 h-4", 
  colored = false 
}) => (
  <svg 
    viewBox="0 0 24 24" 
    fill={colored ? "#0A66C2" : "currentColor"} 
    className={className}
    aria-label="LinkedIn"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

// 5. YouTube Icon (Rounded rectangle with play triangle)
export const YouTubeIcon: React.FC<{ className?: string; colored?: boolean }> = ({ 
  className = "w-4 h-4", 
  colored = false 
}) => (
  <svg 
    viewBox="0 0 24 24" 
    fill={colored ? "#FF0000" : "currentColor"} 
    className={className}
    aria-label="YouTube"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// 6. Kwai Icon (Kwai Video Camera with orange palette)
export const KwaiIcon: React.FC<{ className?: string; colored?: boolean }> = ({ 
  className = "w-4 h-4", 
  colored = false 
}) => (
  <svg 
    viewBox="0 0 24 24" 
    fill={colored ? "#FF5000" : "currentColor"} 
    className={className}
    aria-label="Kwai"
  >
    {/* Stylized camera with playful smile shape representative of Kwai */}
    <rect x="2" y="5" width="14" height="14" rx="4" />
    <path d="M16 10l5-3v10l-5-3v-4z" />
    <circle cx="9" cy="12" r="2.5" fill="#0b0f19" />
  </svg>
);

// Unified Network Icon Selector Component
export const NetworkIcon: React.FC<NetworkIconProps> = ({ 
  network, 
  className = "w-4 h-4", 
  colored = false 
}) => {
  const norm = (network || '').toLowerCase().trim();

  if (norm.includes('insta')) {
    return <InstagramIcon className={className} colored={colored} />;
  }
  if (norm.includes('face')) {
    return <FacebookIcon className={className} colored={colored} />;
  }
  if (norm.includes('tik')) {
    return <TikTokIcon className={className} colored={colored} />;
  }
  if (norm.includes('link')) {
    return <LinkedInIcon className={className} colored={colored} />;
  }
  if (norm.includes('you')) {
    return <YouTubeIcon className={className} colored={colored} />;
  }
  if (norm.includes('kwa')) {
    return <KwaiIcon className={className} colored={colored} />;
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};
