import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    getLoanHistoryByUser,
    returnBook,
    isOverdue,
    daysLeft,
} from '../../services/loanService';

export default function Profile() {
    const { user, logout } = useAuth();
    const [loans, setLoans] = React.useState([]);

    React.useEffect(() => {
        if (user) setLoans(getLoanHistoryByUser(user.id));
    }, [user]);

    const handleReturn = (bookId) => {
        returnBook(user.id, bookId);
        setLoans(getLoanHistoryByUser(user.id));
    };

    if (!user) return <Navigate to="/auth" replace />;

    return (
        <main style={{ padding: 20, maxWidth: 720, margin: '0 auto' }}>
            <h1>Perfil</h1>
            <div className="card">
                <p>
                    <strong>Nome:</strong> {user.name}
                </p>
                <p>
                    <strong>E-mail:</strong> {user.email}
                </p>
                <p>
                    <strong>Desde:</strong>{' '}
                    {new Date(user.createdAt).toLocaleString()}
                </p>
            </div>

            <h2 style={{ marginTop: 20 }}>📚 Meus empréstimos</h2>
            {loans.length === 0 ? (
                <p style={{ color: '#6b7280' }}>
                    Você ainda não tem livros emprestados.
                </p>
            ) : (
                <div className="loans">
                    {loans.map((l) => {
                        const overdue = isOverdue(l);
                        const left = daysLeft(l);
                        return (
                            <div key={l.id} className="loan-item">
                                {l.thumbnail && (
                                    <img src={l.thumbnail} alt="" />
                                )}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0 }}>{l.title}</h3>
                                    <p
                                        style={{
                                            margin: '2px 0 6px',
                                            color: '#64748b',
                                        }}
                                    >
                                        {(l.authors || []).join(', ')}
                                    </p>

                                    <p style={{ fontSize: 12, margin: 0 }}>
                                        <strong>Emprestado em:</strong>{' '}
                                        {new Date(
                                            l.borrowedAt
                                        ).toLocaleDateString()}{' '}
                                        • <strong>Devolve até:</strong>{' '}
                                        {new Date(l.dueAt).toLocaleDateString()}{' '}
                                        {l.returnedAt ? (
                                            <>
                                                •{' '}
                                                <span
                                                    style={{ color: '#64748b' }}
                                                >
                                                    Devolvido em{' '}
                                                    {new Date(
                                                        l.returnedAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </>
                                        ) : overdue ? (
                                            <>
                                                •{' '}
                                                <span
                                                    style={{
                                                        color: '#b91c1c',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    ATRASADO ({Math.abs(left)}{' '}
                                                    dia(s))
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                •{' '}
                                                <span
                                                    style={{ color: '#166534' }}
                                                >
                                                    {left} dia(s) restantes
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>

                                {!l.returnedAt && (
                                    <button
                                        className="btn"
                                        onClick={() => handleReturn(l.bookId)}
                                    >
                                        Devolver
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <button className="btn" onClick={logout} style={{ marginTop: 20 }}>
                Sair
            </button>
        </main>
    );
}
