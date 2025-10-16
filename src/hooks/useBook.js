import { useEffect, useState, useRef, useCallback } from 'react';
import { getBooks } from '../service/bookService';

export default function useBooks({ initialPage = 1, initialSearch = '' } = {}) {
    const [books, setBooks] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(initialPage);
    const [search, setSearch] = useState(initialSearch);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const abortRef = useRef(null);

    const fetchPage = useCallback(
        async (opts = {}) => {
            setLoading(true);
            setError(null);
            if (abortRef.current) abortRef.current.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const data = await getBooks({
                    page: opts.page ?? page,
                    search: opts.search ?? search,
                    signal: controller.signal,
                });
                setBooks(data.results);
                setCount(data.count);
                setPage(data.page || (opts.page ?? page));
            } catch (err) {
                if (err.name !== 'AbortError') setError(err);
            } finally {
                setLoading(false);
                abortRef.current = null;
            }
        },
        [page, search]
    );

    useEffect(() => {
        fetchPage({ page: initialPage, search: initialSearch });
    }, []);

    const goToPage = (p) => {
        fetchPage({ page: p });
    };

    const doSearch = (q) => {
        setSearch(q);
        fetchPage({ page: 1, search: q });
    };

    return {
        books,
        count,
        page,
        search,
        loading,
        error,
        goToPage,
        doSearch,
    };
}
