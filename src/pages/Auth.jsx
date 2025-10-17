import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
    const { user, loading, login, register } = useAuth();
    const [tab, setTab] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [msg, setMsg] = useState('');
    const nav = useNavigate();

    if (user) return <Navigate to="/profile" replace />;

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg('');
        try {
            await login(form.email, form.password);
            nav('/profile');
        } catch (err) {
            setMsg(err.message || 'Falha ao entrar.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMsg('');
        try {
            await register(form.name, form.email, form.password);
            nav('/profile');
        } catch (err) {
            setMsg(err.message || 'Falha ao criar conta.');
        }
    };

    return (
        <main style={{ padding: 20, maxWidth: 520, margin: '0 auto' }}>
            <h1>Conta</h1>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                    onClick={() => setTab('login')}
                    className={tab === 'login' ? 'btn primary' : 'btn'}
                >
                    Entrar
                </button>
                <button
                    onClick={() => setTab('register')}
                    className={tab === 'register' ? 'btn primary' : 'btn'}
                >
                    Criar conta
                </button>
            </div>

            {msg && <p style={{ color: 'crimson' }}>{msg}</p>}

            {tab === 'login' ? (
                <form onSubmit={handleLogin} className="form">
                    <label>
                        E-mail
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={onChange}
                        />
                    </label>
                    <label>
                        Senha
                        <input
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={onChange}
                        />
                    </label>
                    <button className="btn primary" disabled={loading}>
                        {loading ? 'Entrando…' : 'Entrar'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegister} className="form">
                    <label>
                        Nome
                        <input
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={onChange}
                        />
                    </label>
                    <label>
                        E-mail
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={onChange}
                        />
                    </label>
                    <label>
                        Senha
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            value={form.password}
                            onChange={onChange}
                        />
                    </label>
                    <button className="btn primary" disabled={loading}>
                        {loading ? 'Criando…' : 'Criar conta'}
                    </button>
                </form>
            )}
        </main>
    );
}
