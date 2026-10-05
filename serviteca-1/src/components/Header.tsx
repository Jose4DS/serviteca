import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Wrench } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const { t } = useAccessibility();

  return (
    <header className="w-full flex items-center justify-between py-3 px-6 select-none">
      <div 
        onClick={onLogoClick}
        className={`flex items-center gap-3 ${onLogoClick ? 'cursor-pointer' : ''}`}
        title="SERVITECA"
      >
        {/* Emblem logo */}
        <div className="w-11 h-11 rounded-lg bg-black flex items-center justify-center text-white shadow-sm border border-neutral-700">
          <Wrench className="w-6 h-6 text-[#5AC135]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-black m-0 leading-tight">
            {t('app.title', 'SERVITECA')}
          </h1>
        </div>
      </div>
    </header>
  );
};
