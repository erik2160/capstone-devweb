// src/api/gutendexApi.js
const BASE = 'https://gutendex.com/books/';

export async function fetchBooks({ page, search = '', url, signal } = {}) {
    // Se veio url completa (ex.: "https://gutendex.com/books/?page=2"), usamos ela.
    const finalUrl = url
        ? url
        : `${BASE}?${new URLSearchParams({
              page: page ?? 1,
              search: search || '',
          }).toString()}`;

    const res = await fetch(finalUrl, { signal });
    if (!res.ok) {
        throw new Error(`Falha ao buscar livros (${res.status})`);
    }
    return res.json();
}

export async function fetchBookById(id, { signal } = {}) {
    const res = await fetch(`${BASE}${id}`, { signal });
    if (!res.ok) throw new Error(`Livro ${id} não encontrado`);
    return res.json();
}
