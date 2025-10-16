import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBook } from '../service/bookService';

export default function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const abortRef = useRef(null);

    useEffect(() => {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        getBook(id, { signal: controller.signal })
            .then(setBook)
            .catch((e) => setErr(e))
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [id]);

    if (loading)
        return (
            <main style={{ padding: 20 }}>
                <p>Carregando…</p>
            </main>
        );
    if (err)
        return (
            <main style={{ padding: 20 }}>
                <p>Erro: {err.message}</p>
            </main>
        );
    if (!book) return null;

    return (
        <main style={{ padding: 20 }}>
            <Link to=" /">← Voltar</Link>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr',
                    gap: 20,
                    alignItems: 'start',
                }}
            >
                <div>
                    {book.thumbnail ? (
                        <img
                            src={book.thumbnail}
                            alt={`${book.title} capa`}
                            style={{ width: 160, height: 'auto' }}
                        />
                    ) : (
                        <div
                            className="thumb-placeholder"
                            style={{
                                width: 160,
                                height: 220,
                                background: '#eee',
                            }}
                        />
                    )}
                </div>
                <div>
                    <h1 style={{ marginTop: 0 }}>{book.title}</h1>
                    <p>
                        <strong>Autores:</strong>{' '}
                        {book.authors.join(', ') || '—'}
                    </p>
                    <p>
                        <strong>Idiomas:</strong>{' '}
                        {book.languages.join(', ') || '—'}
                    </p>
                    {book.subjects?.length > 0 && (
                        <p>
                            <strong>Assuntos:</strong>{' '}
                            {book.subjects.join(', ')}
                        </p>
                    )}
                    <p>
                        <strong>Downloads:</strong> {book.downloadCount}
                    </p>

                    <div style={{ marginTop: 16 }}>
                        <strong>Formatos:</strong>{' '}
                        {Object.entries(book.formats)
                            .slice(0, 6)
                            .map(([mime, url]) => (
                                <a
                                    key={mime}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ marginRight: 8 }}
                                >
                                    {mime.split('/').pop()}
                                </a>
                            ))}
                    </div>

                    {}
                </div>
            </div>
        </main>
    );
}
