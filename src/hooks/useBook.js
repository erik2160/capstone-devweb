import { useEffect, useState, useRef, useCallback } from 'react';
import { getBooks } from '../services/bookService';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function useBooks({
    initialPage = 1,
    initialSearch = '',
    initialLang = '',
    minSkeletonMs = 500,
} = {}) {
    const [books, setBooks] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(initialPage);
    const [search, setSearch] = useState(initialSearch);
    const [lang, setLang] = useState(initialLang);

    const [loading, setLoading] = useState(true);
    const [booting, setBooting] = useState(true);
    const [error, setError] = useState(null);

    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);

    const abortRef = useRef(null);

    const runFetch = useCallback(
        async ({ page: p, search: q, url, languages } = {}) => {
            if (abortRef.current) abortRef.current.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setLoading(true);
            setError(null);

            try {
                const dataPromise = getBooks({
                    page: p ?? page,
                    search: q ?? search,
                    url,
                    languages: languages ?? lang,
                    signal: controller.signal,
                });

                const [data] = await Promise.all([
                    dataPromise,
                    sleep(minSkeletonMs),
                ]);

                setBooks(data?.results ?? []);
                setCount(data?.count ?? 0);
                setNextUrl(data?.next ?? null);
                setPrevUrl(data?.previous ?? null);

                if (typeof p === 'number') setPage(p);
                if (typeof q === 'string') setSearch(q);
                if (typeof languages === 'string') setLang(languages);
            } catch (e) {
                if (e.name !== 'AbortError') setError(e);
            } finally {
                setLoading(false);
                setBooting(false);
            }
        },
        [page, search, lang, minSkeletonMs]
    );

    useEffect(() => {
        runFetch({
            page: initialPage,
            search: initialSearch,
            languages: initialLang,
        });
    }, []);

    const doSearch = useCallback(
        (q) => {
            if (q === search) return;
            runFetch({ page: 1, search: q, languages: lang });
        },
        [runFetch, lang, search]
    );

    const setLanguage = useCallback(
        (l) => runFetch({ page: 1, search, languages: l || '' }),
        [runFetch, search]
    );

    function getPageFromUrl(url) {
        if (!url) return null;
        try {
            const u = new URL(url);
            const pg = u.searchParams.get('page');
            return pg ? Number(pg) : null;
        } catch {
            return null;
        }
    }

    const goNext = useCallback(() => {
        if (!nextUrl) return;
        const nextPage = getPageFromUrl(nextUrl);
        if (nextPage) setPage(nextPage);
        else setPage((p) => p + 1);
        runFetch({ url: nextUrl });
    }, [nextUrl, runFetch]);

    const goPrev = useCallback(() => {
        if (!prevUrl) return;
        const prevPage = getPageFromUrl(prevUrl);
        if (prevPage) setPage(prevPage);
        else setPage((p) => Math.max(1, p - 1));
        runFetch({ url: prevUrl });
    }, [prevUrl, runFetch]);

    const goToPage = useCallback(
        (p) => {
            setPage(p);
            runFetch({ page: p, search, languages: lang });
        },
        [runFetch, search, lang]
    );

    return {
        books,
        count,
        page,
        search,
        lang,
        loading,
        booting,
        error,
        nextUrl,
        prevUrl,
        doSearch,
        setLanguage,
        goNext,
        goPrev,
        goToPage,
    };
}
