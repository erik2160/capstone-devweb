import React from 'react';

export default function Pagination({ page, hasPrev, hasNext, onPrev, onNext }) {
    return (
        <nav
            aria-label="Paginação"
            style={{
                display: 'flex',
                gap: 8,
                justifyContent: 'center',
                margin: '16px 0',
            }}
        >
            <button
                onClick={onPrev}
                disabled={!hasPrev}
                aria-disabled={!hasPrev}
            >
                ← Anterior
            </button>
            <span style={{ padding: '6px 10px' }}>Página {page}</span>
            <button
                onClick={onNext}
                disabled={!hasNext}
                aria-disabled={!hasNext}
            >
                Próxima →
            </button>
        </nav>
    );
}
