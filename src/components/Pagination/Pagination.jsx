/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import './Pagination.css';

/**
 * Paginação avançada
 * - Botões: primeira, anterior, números com reticências, próximo, última
 * - Saltos rápidos: -5 / +5 páginas
 * - Campo "Go to page"
 */
export default function Pagination({
    page,
    totalPages,
    hasPrev,
    hasNext,
    onPrev,
    onNext,
    onGoToPage,
}) {
    const [goto, setGoto] = useState('');

    // janela de páginas ao redor da atual
    const pages = useMemo(() => {
        const window = 2; // mostra 2 antes e 2 depois
        const start = Math.max(1, page - window);
        const end = Math.min(totalPages, page + window);

        const out = [];
        if (start > 1) out.push(1);
        if (start > 2) out.push('…');
        for (let p = start; p <= end; p++) out.push(p);
        if (end < totalPages - 1) out.push('…');
        if (end < totalPages) out.push(totalPages);
        return out;
    }, [page, totalPages]);

    const jump = (delta) => {
        const target = Math.min(totalPages, Math.max(1, page + delta));
        if (target !== page) onGoToPage(target);
    };

    const go = (e) => {
        e.preventDefault();
        const n = Number(goto);
        if (!Number.isFinite(n)) return;
        const target = Math.min(totalPages, Math.max(1, Math.floor(n)));
        if (target && target !== page) onGoToPage(target);
        setGoto('');
    };

    if (totalPages <= 1) return null;

    return (
        <nav className="pagination">
            <div className="pag-row">
                <button
                    className="pag-btn"
                    onClick={() => onGoToPage(1)}
                    disabled={page === 1}
                >
                    « Início
                </button>
                <button
                    className="pag-btn"
                    onClick={() => jump(-5)}
                    disabled={page <= 5}
                >
                    « –5
                </button>
                <button
                    className="pag-btn"
                    onClick={onPrev}
                    disabled={!hasPrev}
                >
                    ← Anterior
                </button>

                <ul className="pag-list" aria-label="Pagination">
                    {pages.map((p, i) =>
                        p === '…' ? (
                            <li key={`dots-${i}`} className="pag-dots">
                                …
                            </li>
                        ) : (
                            <li key={p}>
                                <button
                                    className={`pag-num ${
                                        p === page ? 'is-active' : ''
                                    }`}
                                    onClick={() => onGoToPage(p)}
                                    aria-current={
                                        p === page ? 'page' : undefined
                                    }
                                >
                                    {p}
                                </button>
                            </li>
                        )
                    )}
                </ul>

                <button
                    className="pag-btn"
                    onClick={onNext}
                    disabled={!hasNext}
                >
                    Próximo →
                </button>
                <button
                    className="pag-btn"
                    onClick={() => jump(5)}
                    disabled={page >= totalPages - 4}
                >
                    +5 »
                </button>
                <button
                    className="pag-btn"
                    onClick={() => onGoToPage(totalPages)}
                    disabled={page === totalPages}
                >
                    Final »
                </button>
            </div>

            <form className="pag-goto" onSubmit={go}>
                <label htmlFor="goto" className="sr-only">
                    Ir para página
                </label>
                <input
                    id="goto"
                    className="pag-input"
                    type="number"
                    min="1"
                    max={totalPages}
                    placeholder={`1–${totalPages}`}
                    value={goto}
                    onChange={(e) => setGoto(e.target.value)}
                />
                <button className="pag-go">Ir</button>
                <span className="pag-info">
                    Pág. {page} de {totalPages}
                </span>
            </form>
        </nav>
    );
}
