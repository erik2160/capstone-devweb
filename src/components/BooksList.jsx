import React, { useState } from "react";
import useBooks from "../hooks/useBook";
import BookCard from "./BookCard";
import Pagination from "./Pagination";

export default function BooksList() {
  const { books, count, page, loading, error, goToPage, doSearch } = useBooks({ initialPage: 1 });
  const [q, setQ] = useState("");

  const hasNext = books.length > 0 && (page * 32) < count;
  const hasPrev = page > 1;

  return (
    <section className="books-section">
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          doSearch(q.trim());
        }}
      >
        <input
          placeholder="Pesquisar título ou autor..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {loading && <p>Carregando livros...</p>}
      {error && <p className="error">Erro: {error.message}</p>}

      <div className="books-grid">
        {books.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>

      <Pagination page={page} onPageChange={goToPage} hasNext={hasNext} hasPrev={hasPrev} />
    </section>
  );
}
