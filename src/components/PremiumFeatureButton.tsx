import React from 'react';
import { Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  canAccess: boolean;
  isDemoUser: boolean;
  tooltipMessage?: string;
}

export const PremiumFeatureButton: React.FC<PremiumFeatureButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  canAccess,
  isDemoUser,
  tooltipMessage
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (canAccess && !disabled) {
      onClick?.();
    } else if (!canAccess && !isDemoUser) {
      navigate('/subscription');
    }
  };

  const getTooltipMessage = () => {
    if (isDemoUser) return 'Sign up to access this feature';
    if (!canAccess) return 'Upgrade to premium to use this feature';
    return tooltipMessage;
  };

  const isDisabled = disabled || (!canAccess && isDemoUser);

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`${className} ${
          isDisabled 
            ? 'cursor-not-allowed opacity-50' 
            : !canAccess 
            ? 'cursor-pointer relative' 
            : ''
        }`}
        title={getTooltipMessage()}
      >
        {children}
        {!canAccess && !isDemoUser && (
          <Crown className="w-4 h-4 absolute -top-1 -right-1 text-yellow-500" />
        )}
      </button>
      
      {/* Tooltip */}
      {getTooltipMessage() && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {getTooltipMessage()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      )}
    </div>
  );
};