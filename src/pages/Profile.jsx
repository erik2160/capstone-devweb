import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user, logout } = useAuth();
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
            <button className="btn" onClick={logout} style={{ marginTop: 12 }}>
                Sair
            </button>
        </main>
    );
}
