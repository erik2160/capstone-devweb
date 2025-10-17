// src/api/gutendexApi.js
const BASE = 'https://gutendex.com';

// LISTA (com filtro por idioma)
export async function fetchBooks({
    page = 1,
    search = '',
    languages = '',
    url,
    signal,
} = {}) {
    const finalUrl =
        url ??
        `${BASE}/books?${new URLSearchParams({
            page,
            ...(search ? { search } : {}),
            ...(languages ? { languages } : {}), // ✅ voltou
        }).toString()}`;

    const res = await fetch(finalUrl, { signal });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text}`);
    }
    return res.json();
}

// DETALHES (por ids=)
export async function fetchBookById(id, { signal } = {}) {
    const url = `${BASE}/books?ids=${id}`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.results || data.results.length === 0)
        throw new Error('Livro não encontrado');
    return data.results[0];
}
