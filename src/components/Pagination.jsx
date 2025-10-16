import React from "react";

export default function Pagination({ page, onPageChange, hasNext, hasPrev }) {
  return (
    <div className="pagination">
      <button onClick={() => onPageChange(page - 1)} disabled={!hasPrev}>
        ← Anterior
      </button>
      <span>Página {page}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={!hasNext}>
        Próxima →
      </button>
    </div>
  );
}
