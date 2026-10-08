import { t } from '../utils/i18n';
import type { Idioma } from '../types';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  idioma: Idioma;
}

export default function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  idioma,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginTop: 16,
        paddingTop: 12,
        borderTop: '1px solid #d8e8d8',
        fontFamily: 'Times New Roman, serif',
        fontSize: 14,
      }}
      aria-label="Paginación"
    >
      <button
        onClick={onPrev}
        disabled={page <= 1}
        aria-label={t('list.prev', idioma)}
        style={btnStyle(page <= 1)}
        onMouseEnter={e => { if (page > 1) e.currentTarget.style.filter = 'brightness(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
      >
        ← {t('list.prev', idioma)}
      </button>

      <span style={{ color: '#3a6b47', fontWeight: 'bold', minWidth: 100, textAlign: 'center' }}>
        {t('list.page', idioma)} <strong>{page}</strong> {t('list.of', idioma)} <strong>{totalPages}</strong>
      </span>

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        aria-label={t('list.next', idioma)}
        style={btnStyle(page >= totalPages)}
        onMouseEnter={e => { if (page < totalPages) e.currentTarget.style.filter = 'brightness(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
      >
        {t('list.next', idioma)} →
      </button>
    </div>
  );
}

function btnStyle(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? '#ccc' : '#4a7c59',
    color: 'white',
    border: `2px solid ${disabled ? '#aaa' : '#2e5c3a'}`,
    borderRadius: 6,
    padding: '6px 16px',
    fontFamily: 'Times New Roman, serif',
    fontWeight: 'bold',
    fontSize: 13,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };
}
