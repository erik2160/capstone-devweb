import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getLoansByUser, returnBook } from '../../services/loanService';

export default function Profile() {
    const { user, logout } = useAuth();
    const [loans, setLoans] = React.useState([]);

    React.useEffect(() => {
        if (user) setLoans(getLoansByUser(user.id));
    }, [user]);

    const handleReturn = (bookId) => {
        returnBook(user.id, bookId);
        setLoans(getLoansByUser(user.id));
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

            <h2 style={{ marginTop: 20 }}>Meus empréstimos</h2>
            {loans.length === 0 ? (
                <p style={{ color: '#6b7280' }}>
                    Você ainda não tem livros emprestados.
                </p>
            ) : (
                <div className="loans">
                    {loans.map((l) => (
                        <div key={l.id} className="loan-item">
                            {l.thumbnail && <img src={l.thumbnail} alt="" />}
                            <div>
                                <h3>{l.title}</h3>
                                <p>{l.authors.join(', ')}</p>
                                <p style={{ fontSize: 12, color: '#64748b' }}>
                                    Emprestado em{' '}
                                    {new Date(
                                        l.borrowedAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                className="btn"
                                onClick={() => handleReturn(l.bookId)}
                            >
                                Devolver
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button className="btn" onClick={logout} style={{ marginTop: 20 }}>
                Sair
            </button>
        </main>
    );
}
