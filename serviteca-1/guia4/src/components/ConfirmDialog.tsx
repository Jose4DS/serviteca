import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description: string;
  /** Texto de advertencia (cascada). Se muestra en recuadro amarillo. */
  warning?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  warning,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
}: ConfirmDialogProps) {
  const { idioma } = useAccessibility();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const titleId = 'confirm-dialog-title';

  // Mover el foco al botón Cancelar al abrir
  useEffect(() => {
    if (open) {
      // Pequeño delay para que el DOM esté listo
      const raf = requestAnimationFrame(() => cancelRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  // Foco trampa: Tab / Shift+Tab ciclan entre los dos botones
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const els = [cancelRef.current, confirmRef.current].filter(Boolean) as HTMLButtonElement[];
    if (els.length < 2) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  if (!open) return null;

  const resolvedTitle = title ?? t('confirm.title', idioma);
  const resolvedConfirm = confirmLabel ?? t('confirm.yes', idioma);
  const resolvedCancel = cancelLabel ?? t('confirm.cancel', idioma);

  return (
    /* Overlay semitransparente sobre el frame 1280×720 */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      aria-hidden="false"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      {/* Panel del modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        style={{
          background: 'white',
          border: '2px solid #4a7c59',
          borderRadius: 10,
          padding: '28px 32px',
          width: 420,
          maxWidth: '90vw',
          boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
          fontFamily: 'Times New Roman, serif',
        }}
      >
        {/* Título */}
        <h2
          id={titleId}
          style={{
            color: '#6B2A2A',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          ⚠️ {resolvedTitle}
        </h2>

        {/* Descripción del registro */}
        <p
          style={{
            fontSize: 15,
            color: '#333',
            marginBottom: warning ? 12 : 24,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>

        {/* Advertencia de cascada */}
        {warning && (
          <div
            role="alert"
            style={{
              background: '#fff3cd',
              border: '2px solid #e0a800',
              borderRadius: 6,
              padding: '10px 14px',
              marginBottom: 24,
              fontSize: 14,
              color: '#856404',
              lineHeight: 1.5,
            }}
          >
            ⚠ {warning}
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            ref={cancelRef}
            onClick={onCancel}
            style={{
              background: '#4a7c59',
              color: 'white',
              border: '2px solid #2e5c3a',
              borderRadius: 6,
              padding: '9px 22px',
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'Times New Roman, serif',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            {resolvedCancel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{
              background: '#6B2A2A',
              color: 'white',
              border: '2px solid #4a1a1a',
              borderRadius: 6,
              padding: '9px 22px',
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'Times New Roman, serif',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            🗑️ {resolvedConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
