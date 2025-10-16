import React from "react";

export default function BookCard({ book }) {
  return (
    <article className="book-card">
      <div className="thumb">
        {book.thumbnail ? (
          <img src={book.thumbnail} alt={`${book.title} capa`} />
        ) : (
          <div className="thumb-placeholder">Sem imagem</div>
        )}
      </div>
      <div className="meta">
        <h3>{book.title}</h3>
        <p className="authors">{book.authors.join(", ")}</p>
        <p className="info">
          Idiomas: {book.languages.join(", ") || "—"} • Downloads: {book.downloadCount}
        </p>
        <div className="formats">
          {Object.keys(book.formats).slice(0, 4).map((k) => (
            <a key={k} href={book.formats[k]} target="_blank" rel="noreferrer" className="format-link">
              {k.split("/").pop() || k}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
