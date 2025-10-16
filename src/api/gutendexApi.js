const BASE = "https://gutendex.com";

export async function fetchBooks({ page = 1, search = "", signal } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (page) params.set("page", page);
  const url = `${BASE}/books?${params.toString()}`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} - ${text}`);
  }
  return res.json();
}

export async function fetchBookById(id, { signal } = {}) {
  const url = `${BASE}/books/${id}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
