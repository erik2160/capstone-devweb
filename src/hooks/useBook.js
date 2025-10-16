import { useEffect, useState, useRef, useCallback } from 'react';
import { getBooks } from '../service/bookService';

function pageFromUrl(u) {
    try {
        const p = new URL(u).searchParams.get('page');
        return p ? parseInt(p, 10) : null;
    } catch {
        return null;
    }
}

export default function useBooks({ initialPage = 1, initialSearch = '' } = {}) {
    const [books, setBooks] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(initialPage);
    const [search, setSearch] = useState(initialSearch);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);

    const abortRef = useRef(null);
    const pageSize = 32;

    const runFetch = useCallback(async ({ page: p, search: q, url } = {}) => {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            setLoading(true);
            setError(null);
            const {
                results,
                count: total,
                next,
                previous,
            } = await getBooks({
                page: p,
                search: q,
                url,
                signal: controller.signal,
            });

            setBooks(results);
            setCount(total);
            setNextUrl(next);
            setPrevUrl(previous);

            if (typeof p === 'number') {
                setPage(p);
            } else if (url) {
                const prevPage = previous ? pageFromUrl(previous) : null;
                const nextPage = next ? pageFromUrl(next) : null;
                const current =
                    prevPage != null
                        ? prevPage + 1
                        : nextPage != null
                        ? Math.max(nextPage - 1, 1)
                        : 1;
                setPage(current);
            }

            if (typeof q === 'string') setSearch(q);
        } catch (e) {
            if (e.name !== 'AbortError') setError(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        runFetch({ page: initialPage, search: initialSearch });
    }, []);

    const goToPage = useCallback(
        (p) => {
            if (p < 1) return;
            const maxPage = Math.ceil(count / pageSize) || 1;
            runFetch({ page: Math.min(p, maxPage), search });
        },
        [count, pageSize, runFetch, search]
    );

    const doSearch = useCallback(
        (q) => {
            runFetch({ page: 1, search: q });
        },
        [runFetch]
    );

    const goNext = useCallback(() => {
        if (nextUrl) runFetch({ url: nextUrl });
    }, [nextUrl, runFetch]);

    const goPrev = useCallback(() => {
        if (prevUrl) runFetch({ url: prevUrl });
    }, [prevUrl, runFetch]);

    return {
        books,
        count,
        page,
        search,
        loading,
        error,
        nextUrl,
        prevUrl,
        goToPage,
        doSearch,
        goNext,
        goPrev,
    };
}
