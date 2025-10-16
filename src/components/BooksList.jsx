import React, { useEffect, useState } from 'react';
import useBooks from '../hooks/useBook';
import BookCard from './BookCard';
import Pagination from './Pagination';
import SkeletonCard from './SkeletonCard';

export default function BooksList() {
    const {
        books,
        page,
        loading,
        error,
        doSearch,
        nextUrl,
        prevUrl,
        goNext,
        goPrev,
    } = useBooks({ initialPage: 1 });

    const [q, setQ] = useState('');
    const hasNext = Boolean(nextUrl);
    const hasPrev = Boolean(prevUrl);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    useEffect(() => {
        const t = setTimeout(() => {
            doSearch(q.trim());
        }, 400);
        return () => clearTimeout(t);
    }, [q]);

    const SKELETON_COUNT = 12;

    return (
        <section className="books-section">
            <form
                onSubmit={(e) => e.preventDefault()}
                style={{ marginBottom: 12 }}
            >
                <input
                    aria-label="Buscar livros"
                    placeholder="Buscar por título, autor ou palavra-chave…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    style={{ padding: 10, width: '100%', maxWidth: 520 }}
                />
            </form>

            {error && <p className="error">Erro: {error.message}</p>}

            <div className="books-grid">
                {loading
                    ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                          <SkeletonCard key={i} />
                      ))
                    : books.map((b) => <BookCard key={b.id} book={b} />)}
            </div>

            <Pagination
                page={page}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onPrev={goPrev}
                onNext={goNext}
            />
        </section>
    );
}
