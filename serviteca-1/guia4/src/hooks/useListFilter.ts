import { useState, useMemo } from 'react';

const PAGE_SIZE = 10;

interface UseListFilterOptions<T> {
  /** Array completo ya cargado en memoria (no se relee localStorage) */
  data: T[];
  /** Función que decide si un ítem coincide con la query de texto */
  filterFn: (item: T, query: string) => boolean;
  /** Tamaño de página. Default: 10 */
  pageSize?: number;
}

interface UseListFilterResult<T> {
  // Texto de búsqueda
  query: string;
  setQuery: (q: string) => void;
  // Paginación
  page: number;
  totalPages: number;
  goNext: () => void;
  goPrev: () => void;
  // Ítems de la página actual (ya filtrados y paginados)
  pageItems: T[];
  // Total de ítems tras filtrar (útil para mostrar "N resultados")
  filteredCount: number;
  /** Limpia la query y vuelve a página 1 */
  reset: () => void;
}

/**
 * Hook genérico de búsqueda + paginación.
 * Opera completamente en memoria: no relee localStorage en cada keystroke.
 */
export function useListFilter<T>({
  data,
  filterFn,
  pageSize = PAGE_SIZE,
}: UseListFilterOptions<T>): UseListFilterResult<T> {
  const [query, setQueryRaw] = useState('');
  const [page, setPage] = useState(1);

  // Al cambiar la query siempre volvemos a página 1
  function setQuery(q: string) {
    setQueryRaw(q);
    setPage(1);
  }

  // Filtrado en memoria — solo recalcula cuando cambian data o query
  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return data;
    return data.filter(item => filterFn(item, q));
  }, [data, query, filterFn]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Clampear page si filtered shrinks
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  function goNext() {
    setPage(p => Math.min(p + 1, totalPages));
  }

  function goPrev() {
    setPage(p => Math.max(p - 1, 1));
  }

  function reset() {
    setQueryRaw('');
    setPage(1);
  }

  return {
    query,
    setQuery,
    page: safePage,
    totalPages,
    goNext,
    goPrev,
    pageItems,
    filteredCount: filtered.length,
    reset,
  };
}
