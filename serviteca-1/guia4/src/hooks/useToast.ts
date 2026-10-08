import { useState, useEffect, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'warning';

export interface Toast {
  message: string;
  type: ToastType;
}

interface UseToastResult {
  toast: Toast | null;
  showToast: (message: string, type?: ToastType) => void;
  clearToast: () => void;
}

const DURATION_MS = 3000;

/**
 * Muestra un mensaje auto-descartable a los 3 segundos.
 * - showToast() cancela el timer anterior y reinicia el contador.
 * - clearToast() lo descarta inmediatamente.
 */
export function useToast(): UseToastResult {
  const [toast, setToast] = useState<Toast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearToast() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }

  function showToast(message: string, type: ToastType = 'success') {
    // Cancela cualquier timer previo
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, DURATION_MS);
  }

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { toast, showToast, clearToast };
}
