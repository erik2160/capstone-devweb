import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBook } from '../service/bookService';

const FORMAT_PRIORITY = [
    'text/html; charset=utf-8',
    'text/html',
    'application/epub+zip',
    'application/pdf',
    'text/plain; charset=utf-8',
    'text/plain',
];

function sortFormats(formats) {
    const entries = Object.entries(formats || {});
    const score = (m) => {
        const i = FORMAT_PRIORITY.indexOf(m);
        return i === -1 ? 999 : i;
    };
    return entries.sort(([a], [b]) => score(a) - score(b));
}

function Skeleton() {
    return (
        <main style={{ padding: 20 }}>
            <div style={{ marginBottom: 12 }}>
                <div
                    style={{
                        width: 80,
                        height: 32,
                        background: '#e9ecef',
                        borderRadius: 8,
                    }}
                />
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr',
                    gap: 20,
                    alignItems: 'start',
                }}
            >
                <div
                    style={{
                        width: 180,
                        aspectRatio: '3/4',
                        background: '#e9ecef',
                        borderRadius: 12,
                    }}
                />
                <div>
                    <div
                        style={{
                            height: 20,
                            width: '80%',
                            background: '#e9ecef',
                            borderRadius: 8,
                            marginBottom: 10,
                        }}
                    />
                    <div
                        style={{
                            height: 14,
                            width: '60%',
                            background: '#e9ecef',
                            borderRadius: 8,
                            marginBottom: 8,
                        }}
                    />
                    <div
                        style={{
                            height: 14,
                            width: '40%',
                            background: '#e9ecef',
                            borderRadius: 8,
                            marginBottom: 12,
                        }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div
                            style={{
                                width: 90,
                                height: 32,
                                background: '#e9ecef',
                                borderRadius: 10,
                            }}
                        />
                        <div
                            style={{
                                width: 120,
                                height: 32,
                                background: '#e9ecef',
                                borderRadius: 10,
                            }}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function BookDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const abortRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        abortRef.current = controller;

        let alive = true;
        setLoading(true);
        setErr(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        getBook(id, { signal: controller.signal })
            .then((data) => {
                if (!alive || controller.signal.aborted) return;
                setBook(data);
            })
            .catch((e) => {
                if (
                    e.name === 'AbortError' ||
                    e.message === 'The operation was aborted.'
                )
                    return;
                if (!alive) return;
                setErr(e);
            })
            .finally(() => {
                if (!alive || controller.signal.aborted) return;
                setLoading(false);
            });

        return () => {
            alive = false;
            controller.abort();
        };
    }, [id]);

    if (loading) return <Skeleton />;
    if (err) {
        return (
            <main style={{ padding: 20 }}>
                <button onClick={() => navigate(-1)} className="btn">
                    ← Voltar
                </button>
                <p style={{ marginTop: 12 }}>Erro ao carregar: {err.message}</p>
            </main>
        );
    }
    if (!book) return null;

    const formats = sortFormats(book.formats);

    return (
        <main style={{ padding: 20 }}>
            <button
                onClick={() => navigate(-1)}
                className="btn"
                aria-label="Voltar"
            >
                ← Voltar
            </button>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr',
                    gap: 20,
                    alignItems: 'start',
                    marginTop: 12,
                }}
            >
                <div>
                    {book.thumbnail ? (
                        <img
                            src={book.thumbnail}
                            alt={`Capa de ${book.title}`}
                            style={{ width: 180, borderRadius: 12 }}
                        />
                    ) : (
                        <div
                            style={{
                                width: 180,
                                aspectRatio: '3/4',
                                background: '#e9ecef',
                                borderRadius: 12,
                            }}
                        />
                    )}
                </div>

                <div>
                    <h1 style={{ margin: 0 }}>{book.title}</h1>
                    <p>
                        <strong>Autor(es):</strong>{' '}
                        {book.authors?.join(', ') || '—'}
                    </p>
                    <p>
                        <strong>Idioma(s):</strong>{' '}
                        {book.languages?.join(', ') || '—'}
                    </p>
                    <p>
                        <strong>Downloads:</strong> {book.downloadCount}
                    </p>

                    <div style={{ marginTop: 14 }}>
                        <strong>Formatos:</strong>{' '}
                        <div
                            style={{
                                display: 'flex',
                                gap: 8,
                                flexWrap: 'wrap',
                                marginTop: 6,
                            }}
                        >
                            {formats.slice(0, 10).map(([mime, url]) => (
                                <a
                                    key={mime}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        border: '1px solid #e2e8f0',
                                        padding: '6px 10px',
                                        borderRadius: 8,
                                    }}
                                >
                                    {mime
                                        .split(';')[0]
                                        .split('/')
                                        .pop()
                                        .toUpperCase()}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
