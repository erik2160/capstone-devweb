/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as loan from '../../services/loanService';
import './BookCard.css';

const CATEGORY_RULES = [
    { key: 'fiction', label: 'Ficção', re: /(fiction|novel|romance)/i },
    { key: 'children', label: 'Infantil', re: /(children|juvenile|young)/i },
    { key: 'history', label: 'História', re: /(history|historical)/i },
    {
        key: 'science',
        label: 'Ciência',
        re: /(science|scientific|astronomy|physics|chemistry|biology)/i,
    },
    { key: 'poetry', label: 'Poesia', re: /(poetry|poems)/i },
    {
        key: 'drama',
        label: 'Drama/Teatro',
        re: /(drama|plays|theatre|theater)/i,
    },
    { key: 'fantasy', label: 'Fantasia', re: /(fantasy|fairy)/i },
    { key: 'philosophy', label: 'Filosofia', re: /(philosophy|ethics|logic)/i },
    {
        key: 'religion',
        label: 'Religião',
        re: /(religion|theology|christian|bible)/i,
    },
    { key: 'travel', label: 'Viagem', re: /(travel|voyage|journey)/i },
    { key: 'biography', label: 'Biografia', re: /(biography|memoir)/i },
    { key: 'art', label: 'Arte', re: /(art|painting|music)/i },
    {
        key: 'mystery',
        label: 'Mistério/Crime',
        re: /(mystery|detective|crime)/i,
    },
];

function extractCategories(book) {
    const blob = [...(book.subjects || []), ...(book.bookshelves || [])].join(
        ' | '
    );
    const out = [];
    for (const r of CATEGORY_RULES) {
        if (r.re.test(blob)) out.push(r.label);
        if (out.length >= 4) break;
    }
    return out.length ? out : ['Geral'];
}

function truncateWords(str, maxWords = 12) {
    const parts = String(str || '').split(/\s+/);
    return parts.length <= maxWords
        ? str
        : parts.slice(0, maxWords).join(' ') + '…';
}

export default function BookCard({ book }) {
    const [taken, setTaken] = useState(false);
    const categories = useMemo(() => extractCategories(book), [book]);

    const navigate = useNavigate();
    const goToDetails = () => navigate(`/book/${book.id}`);

    useEffect(() => {
        const update = () =>
            setTaken(Boolean(loan.getActiveLoanForBook(book.id)));
        update();
        const onStorage = (e) => {
            if (e.key === 'book.loans.v2') update();
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [book.id]);

    const titleShort = truncateWords(book.title, 12);

    return (
        <article
            className="book-card card-with-footer is-clickable"
            role="link"
            tabIndex={0}
            onClick={goToDetails}
            aria-label={`Abrir detalhes de ${book.title}`}
        >
            {}
            <div className="top">
                <Link
                    to={`/book/${book.id}`}
                    className="thumb"
                    aria-label={`Abrir detalhes de ${book.title}`}
                >
                    {book.thumbnail ? (
                        <img
                            src={book.thumbnail}
                            alt={`Capa de ${book.title}`}
                        />
                    ) : (
                        <div className="thumb-placeholder" />
                    )}
                </Link>

                <div className="info">
                    <h3 className="title" title={book.title}>
                        <Link to={`/book/${book.id}`}>{titleShort}</Link>
                    </h3>
                    <p className="authors">{book.authors?.join(', ') || '—'}</p>
                    <p className="small">
                        Idiomas: {book.languages?.join(', ') || '—'} •
                        Downloads: {book.downloadCount}
                    </p>
                </div>
            </div>

            {}
            <div className="cats">
                {categories.map((c, i) => (
                    <span className="cat" key={`${c}-${i}`}>
                        {c}
                    </span>
                ))}
            </div>

            {}
            <div className={`avail ${taken ? 'unavailable' : 'available'}`}>
                {taken ? 'Indisponível' : 'Disponível'}
            </div>
        </article>
    );
}
