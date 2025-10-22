import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBook } from '../../services/bookService';
import { useAuth } from '../../context/AuthContext';
import * as loan from '../../services/loanService';
import './details.css';

// const FORMAT_PRIORITY = [
//     'text/html; charset=utf-8',
//     'text/html',
//     'application/epub+zip',
//     'application/pdf',
//     'text/plain; charset=utf-8',
//     'text/plain',
// ];

// function sortFormats(formats) {
//     const entries = Object.entries(formats || {});
//     const score = (m) => {
//         const i = FORMAT_PRIORITY.indexOf(m);
//         return i === -1 ? 999 : i;
//     };
//     return entries.sort(([a], [b]) => score(a) - score(b));
// }

function Skeleton() {
    return (
        <main className="detail">
            <div className="detail-header">
                <div className="sk sk-back" />
            </div>
            <div className="detail-body">
                <div className="sk sk-cover" />
                <div className="detail-info">
                    <div className="sk sk-line lg" />
                    <div className="sk sk-line" />
                    <div className="sk sk-line sm" />
                    <div className="sk sk-chip-row">
                        <span className="sk sk-chip" />
                        <span className="sk sk-chip" />
                    </div>
                    <div className="sk sk-btn-row">
                        <span className="sk sk-btn" />
                        <span className="sk sk-btn" />
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
    const { user } = useAuth();
    const [hasLoaned, setHasLoaned] = useState(false);
    const [takenByOther, setTakenByOther] = useState(false);
    const [msg, setMsg] = useState('');
    const [hasOtherActive, setHasOtherActive] = useState(false);

    useEffect(() => {
        if (!book) return;
        const active = loan.getActiveLoanForBook(book.id);
        setHasLoaned(user ? loan.hasActiveLoan(user.id, book.id) : false);
        setTakenByOther(!!active && (!user || active.userId !== user.id));

        if (user) {
            const myActive = loan.getUserActiveLoan(user.id);
            setHasOtherActive(!!myActive && myActive.bookId !== book.id);
        } else {
            setHasOtherActive(false);
        }
    }, [user, book]);

    useEffect(() => {
        if (!book) return;
        const active = loan.getActiveLoanForBook(book.id);
        setHasLoaned(user ? loan.hasActiveLoan(user.id, book.id) : false);
        setTakenByOther(!!active && (!user || active.userId !== user.id));
    }, [user, book]);

    const handleBorrow = () => {
        if (!user) {
            setMsg('Faça login para emprestar este livro.');
            return;
        }

        try {
            loan.borrowBook(user.id, book);
            setHasLoaned(true);
            setMsg('Livro emprestado com sucesso!');
        } catch (e) {
            setMsg('⚠️ ' + e.message);
        }
    };

    const handleReturn = () => {
        if (!user) return;
        loan.returnBook(user.id, book.id);
        setHasLoaned(false);
        setTakenByOther(false);
        setMsg('Livro devolvido com sucesso!');
    };

    useEffect(() => {
        const controller = new AbortController();
        abortRef.current = controller;
        let alive = true;

        setLoading(true);
        setErr(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        getBook(id, { signal: controller.signal })
            .then((b) => {
                if (alive && !controller.signal.aborted) setBook(b);
            })
            .catch((e) => {
                if (
                    e.name === 'AbortError' ||
                    e.message === 'The operation was aborted.'
                )
                    return;
                if (alive) setErr(e);
            })
            .finally(() => {
                if (alive && !controller.signal.aborted) setLoading(false);
            });

        return () => {
            alive = false;
            controller.abort();
        };
    }, [id]);

    useEffect(() => {
        if (user && book) {
            setHasLoaned(loan.hasActiveLoan(user.id, book.id));
        }
    }, [user, book]);

    if (loading) return <Skeleton />;
    if (err) {
        return (
            <main className="detail">
                <div className="detail-header">
                    <button className="btn" onClick={() => navigate(-1)}>
                        ← Voltar
                    </button>
                </div>
                <p className="section">Erro ao carregar: {err.message}</p>
            </main>
        );
    }
    if (!book) return null;

    // const formats = sortFormats(book.formats);
    const subjects = book.subjects?.slice(0, 12) || [];
    const languages = book.languages?.join(', ') || '—';
    const authors = book.authors?.join(', ') || '—';
    const editors = book.editors?.join(', ');
    const translators = book.translators?.join(', ');
    const summaryText = (book.summaries && book.summaries[0]) || '';

    return (
        <main className="detail">
            <div className="detail-header">
                <button
                    className="btn"
                    onClick={() => navigate(-1)}
                    aria-label="Voltar"
                >
                    ← Voltar
                </button>
            </div>

            <div className="detail-body">
                <div>
                    {book.thumbnail ? (
                        <img
                            className="cover"
                            src={book.thumbnail}
                            alt={`Capa de ${book.title}`}
                        />
                    ) : (
                        <div className="cover" aria-hidden="true" />
                    )}
                </div>

                <div className="detail-info">
                    <h1 className="title">{book.title}</h1>

                    <div className="kv">
                        <p>
                            <strong>Autor(es):</strong> {authors}
                        </p>
                        {editors && (
                            <p>
                                <strong>Editores:</strong> {editors}
                            </p>
                        )}
                        {translators && (
                            <p>
                                <strong>Tradutores:</strong> {translators}
                            </p>
                        )}
                        <p>
                            <strong>Idioma(s):</strong> {languages}
                        </p>
                        <p>
                            <strong>Downloads:</strong> {book.downloadCount}
                        </p>
                    </div>

                    {subjects.length > 0 && (
                        <div className="badges" aria-label="Assuntos">
                            {subjects.map((s, i) => (
                                <span key={i} className="badge">
                                    {s}
                                </span>
                            ))}
                        </div>
                    )}

                    {summaryText && (
                        <section className="section">
                            <h2>Resumo</h2>
                            <p className="summary">{summaryText}</p>
                        </section>
                    )}

                    {/* <section className="section">
                        <h2>Formatos</h2>
                        <div className="formats">
                            {formats.slice(0, 12).map(([mime, url]) => (
                                <a
                                    key={mime}
                                    className="format-link"
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {mime
                                        .split(';')[0]
                                        .split('/')
                                        .pop()
                                        .toUpperCase()}
                                </a>
                            ))}
                        </div>
                    </section> */}

                    <section className="section">
                        <h2>Ações</h2>
                        {msg && (
                            <p
                                style={{
                                    margin: '6px 0',
                                    color: /✅|📚/.test(msg)
                                        ? 'green'
                                        : 'crimson',
                                }}
                            >
                                {msg}
                            </p>
                        )}

                        {!user && (
                            <p style={{ color: '#6b7280', marginTop: 6 }}>
                                Faça login para emprestar.
                            </p>
                        )}

                        {user && hasOtherActive && !hasLoaned && (
                            <p
                                style={{
                                    color: '#b91c1c',
                                    marginTop: 6,
                                    fontWeight: 600,
                                }}
                            >
                                Você já tem um empréstimo ativo. Devolva-o
                                para pegar outro.
                            </p>
                        )}

                        {user &&
                            takenByOther &&
                            !hasLoaned &&
                            !hasOtherActive && (
                                <p style={{ color: '#6b7280', marginTop: 6 }}>
                                    Este livro está emprestado por outro
                                    usuário no momento.
                                </p>
                            )}

                        <div
                            className="actions"
                            style={{ display: 'flex', gap: 8, marginTop: 8 }}
                        >
                            {user &&
                                !hasLoaned &&
                                !takenByOther &&
                                !hasOtherActive && (
                                    <button
                                        className="btn primary"
                                        onClick={handleBorrow}
                                    >
                                        Emprestar
                                    </button>
                                )}
                            {user && hasLoaned && (
                                <button className="btn" onClick={handleReturn}>
                                    Devolver
                                </button>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
