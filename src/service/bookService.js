import * as api from '../api/gutendexApi';

function normalizeBook(raw) {
    return {
        id: raw.id,
        title: raw.title,
        authors: (raw.authors || []).map((a) => a.name),
        subjects: raw.subjects || [],
        bookshelves: raw.bookshelves || [],
        languages: raw.languages || [],
        downloadCount: raw.download_count || 0,
        formats: raw.formats || {},
        thumbnail:
            (raw.formats &&
                (raw.formats['image/jpeg'] || raw.formats['image/png'])) ||
            null,
    };
}

export async function getBooks({
    page = 1,
    search = '',
    url,
    languages,
    signal,
} = {}) {
    const data = await api.fetchBooks({ page, search, url, languages, signal });
    return {
        count: data.count,
        next: data.next,
        previous: data.previous,
        page,
        results: (data.results || []).map(normalizeBook),
    };
}

export async function getBook(id, { signal } = {}) {
    const raw = await api.fetchBookById(id, { signal });
    return normalizeBook(raw);
}
