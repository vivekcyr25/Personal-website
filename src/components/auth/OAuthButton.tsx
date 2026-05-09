import React from 'react';
import { motion } from 'framer-motion';

interface OAuthButtonProps {
  provider: 'google' | 'github';
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.83 2.07-1.79 2.7l2.85 2.22c1.67-1.55 2.63-3.83 2.63-6.55z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.85-2.22c-.79.53-1.8.85-3.11.85-2.39 0-4.41-1.61-5.14-3.77H1.03v2.33C2.51 15.96 5.52 18 9 18z" />
    <path fill="#FBBC05" d="M3.86 10.68c-.19-.56-.3-1.16-.3-1.78s.11-1.22.3-1.78V4.79H1.03C.38 6.07 0 7.51 0 9s.38 2.93 1.03 4.21l2.83-2.53z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0 5.52 0 2.51 2.04 1.03 4.79l2.83 2.53c.73-2.16 2.75-3.77 5.14-3.77z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const OAuthButton: React.FC<OAuthButtonProps> = ({ provider, onClick, isLoading, disabled }) => {
  const isGoogle = provider === 'google';
  
  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all relative overflow-hidden
        ${isGoogle 
          ? 'bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-50' 
          : 'bg-[#111827] text-white hover:bg-gray-800 shadow-sm'}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Liquid Reflection Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
        animate={isLoading ? { translateX: ['100%', '-100%'] } : {}}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
      
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Connecting...</span>
        </div>
      ) : (
        <>
          {isGoogle ? <GoogleIcon /> : <GitHubIcon />}
          <span>Continue with {isGoogle ? 'Google' : 'GitHub'}</span>
        </>
      )}
    </motion.button>
  );
};

export default OAuthButton;
