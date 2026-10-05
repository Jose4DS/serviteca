import React, { useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { MahoganyButton } from './MahoganyButton';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface MessageBoxProps {
  type: 'error' | 'success';
  title: string;
  message: string;
  onClose: () => void;
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  type,
  title,
  message,
  onClose,
}) => {
  const { speak, t } = useAccessibility();

  useEffect(() => {
    // Read aloud via TTS if active
    speak(`${title}. ${message}`);
  }, [title, message, speak]);

  const isSuccess = type === 'success';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-none p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="msgbox-title"
    >
      <div className="bg-[#5AC135] text-black w-full max-w-md rounded-2xl p-6 shadow-xl border-2 border-[#459d24] flex flex-col items-center text-center animate-in fade-in duration-200">
        <div className="mb-3">
          {isSuccess ? (
            <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center text-black">
              <CheckCircle2 className="w-9 h-9 text-black" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-red-600/20 flex items-center justify-center text-black">
              <AlertCircle className="w-9 h-9 text-red-900" />
            </div>
          )}
        </div>

        <h3 id="msgbox-title" className="text-2xl font-bold mb-2 tracking-wide text-black">
          {title}
        </h3>

        <p className="text-lg mb-6 text-black font-semibold">
          {message}
        </p>

        <MahoganyButton
          onClick={onClose}
          className="min-w-32 py-2.5 text-lg"
          autoFocus
        >
          {t('btn.close', 'Aceptar')}
        </MahoganyButton>
      </div>
    </div>
  );
};
