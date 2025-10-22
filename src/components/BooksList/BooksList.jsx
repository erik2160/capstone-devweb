import React, { useEffect, useMemo, useState, useRef } from 'react';
import './filters.css';
import useBooks from '../../hooks/useBook';
import BookCard from '../BookCard/BookCard';
import Pagination from '../Pagination/Pagination';
import SkeletonCard from '../SkeletonCard/SkeletonCard';

export default function BooksList() {
    const {
        books,
        page,
        loading,
        booting,
        error,
        doSearch,
        nextUrl,
        prevUrl,
        count,
        goNext,
        goToPage,
        goPrev,
        lang,
        setLanguage,
    } = useBooks({ initialPage: 1, minSkeletonMs: 500 });

    const [q, setQ] = useState('');
    const firstSearch = useRef(true);
    const [category, setCategory] = useState('');
    const hasNext = Boolean(nextUrl);
    const hasPrev = Boolean(prevUrl);
    const pageSize = books.length || 32;
    const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    useEffect(() => {
        if (firstSearch.current) {
            firstSearch.current = false;
            return;
        }
        const t = setTimeout(() => doSearch(q.trim()), 400);
        return () => clearTimeout(t);
    }, [q, doSearch]);

    const CATEGORY_RULES = useMemo(
        () => [
            { key: 'fiction', label: 'Ficção', re: /(fiction|novel|romance)/i },
            { key: 'children', label: 'Infantil', re: /(children|juvenile)/i },
            { key: 'history', label: 'História', re: /(history|historical)/i },
            {
                key: 'science',
                label: 'Ciência',
                re: /(science|scientific|astronomy|physics|chemistry|biology)/i,
            },
            { key: 'poetry', label: 'Poesia', re: /(poetry|poems)/i },
            {
                key: 'drama',
                label: 'Drama/Teatro',
                re: /(drama|plays|theatre|theater)/i,
            },
            { key: 'fantasy', label: 'Fantasia', re: /(fantasy|fairy)/i },
            {
                key: 'philosophy',
                label: 'Filosofia',
                re: /(philosophy|ethics|logic)/i,
            },
            {
                key: 'religion',
                label: 'Religião',
                re: /(religion|theology|christian|bible)/i,
            },
            { key: 'travel', label: 'Viagem', re: /(travel|voyage|journey)/i },
            { key: 'biography', label: 'Biografia', re: /(biography|memoir)/i },
            { key: 'art', label: 'Arte', re: /(art|painting|music)/i },
            {
                key: 'mystery',
                label: 'Mistério/Crime',
                re: /(mystery|detective|crime)/i,
            },
        ],
        []
    );

    const filteredBooks = useMemo(() => {
        if (!category) return books;
        const rule = CATEGORY_RULES.find((r) => r.key === category);
        if (!rule) return books;
        return books.filter((b) => {
            const text = [...(b.subjects || []), ...(b.bookshelves || [])].join(
                ' | '
            );
            return rule.re.test(text);
        });
    }, [books, category, CATEGORY_RULES]);

    const SKELETON_COUNT = 14;

    return (
        <section className="books-section">
            {}
            <div className="filters">
                <label className="sr-only" htmlFor="q">
                    Buscar
                </label>
                <input
                    id="q"
                    className="filter-input"
                    aria-label="Buscar livros"
                    placeholder="Buscar por título, autor ou palavra-chave…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />

                <label className="sr-only" htmlFor="lang">
                    Idioma
                </label>
                <select
                    id="lang"
                    className="filter-select"
                    aria-label="Filtrar por idioma"
                    value={lang}
                    onChange={(e) => setLanguage(e.target.value)}
                    title="Idioma"
                >
                    <option value="">Todos os idiomas</option>
                    <option value="en">Inglês (en)</option>
                    <option value="pt">Português (pt)</option>
                    <option value="es">Espanhol (es)</option>
                    <option value="fr">Francês (fr)</option>
                    <option value="de">Alemão (de)</option>
                    <option value="it">Italiano (it)</option>
                    <option value="la">Latim (la)</option>
                </select>

                <label className="sr-only" htmlFor="category">
                    Categoria
                </label>
                <select
                    id="category"
                    className="filter-select"
                    aria-label="Filtrar por categoria"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    title="Categoria"
                >
                    <option value="">Todas as categorias</option>
                    {CATEGORY_RULES.map((c) => (
                        <option key={c.key} value={c.key}>
                            {c.label}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className="error">Erro: {error.message}</p>}

            <div className="books-grid">
                {booting || loading || books.length === 0
                    ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                          <SkeletonCard key={i} />
                      ))
                    : filteredBooks.map((b) => (
                          <BookCard key={b.id} book={b} />
                      ))}
            </div>

            <Pagination
                page={page}
                hasPrev={hasPrev}
                totalPages={totalPages}
                hasNext={hasNext}
                onPrev={goPrev}
                onNext={goNext}
                onGoToPage={goToPage}
            />

            {!loading && !booting && category && (
                <p style={{ textAlign: 'center', marginTop: 4, opacity: 0.8 }}>
                    Mostrando {filteredBooks.length} de {books.length}{' '}
                    resultados nesta página (categoria “
                    {CATEGORY_RULES.find((r) => r.key === category)?.label}”).
                </p>
            )}
        </section>
    );
}
