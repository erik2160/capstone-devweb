const BASE = 'https://gutendex.com/books/';

export async function fetchBooks({
    page,
    search = '',
    url,
    languages,
    signal,
} = {}) {
    const finalUrl = url
        ? url
        : `${BASE}?${new URLSearchParams({
              page: page ?? 1,
              search: search || '',
              ...(languages ? { languages } : {}),
          })}`;
    const res = await fetch(finalUrl, { signal });
    if (!res.ok) throw new Error(`Falha ao buscar livros (${res.status})`);
    return res.json();
}

export async function fetchBookById(id, { signal } = {}) {
    const res = await fetch(`${BASE}?ids=${id}`, { signal });
    if (!res.ok) throw new Error(`Livro ${id} não encontrado`);
    const data = await res.json();
    if (!data.results?.length) throw new Error(`Livro ${id} não encontrado`);
    return data.results[0];
}
