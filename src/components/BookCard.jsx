/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
    return (
        <article className="book-card">
            <Link
                to={`/book/${book.id}`}
                className="thumb"
                aria-label={`Abrir detalhes de ${book.title}`}
            >
                {book.thumbnail ? (
                    <img src={book.thumbnail} alt={`${book.title} capa`} />
                ) : (
                    <div className="thumb-placeholder">Sem imagem</div>
                )}
            </Link>
            <div className="meta">
                <h3>
                    <Link to={`/book/${book.id}`}>{book.title}</Link>
                </h3>
                <p className="authors">{book.authors.join(', ')}</p>
                <p className="info">
                    Idiomas: {book.languages.join(', ') || '—'} • Downloads:{' '}
                    {book.downloadCount}
                </p>
                <div className="formats">
                    {Object.keys(book.formats)
                        .slice(0, 4)
                        .map((k) => (
                            <a
                                key={k}
                                href={book.formats[k]}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {k.split('/').pop() || k}
                            </a>
                        ))}
                </div>
            </div>
        </article>
    );
}
