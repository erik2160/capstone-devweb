import React, { useState } from 'react';
import './Header.css';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="logo">MeuSistema</div>

            <nav className={`nav ${menuOpen ? 'active' : ''}`}>
                <a href="#inicio">Início</a>
                <a href="#sobre">Sobre</a>
                <a href="#contato">Contato</a>
                <a href="#ajuda">Ajuda</a>
                <button className="login-btn">Login</button>
            </nav>

            <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>
        </header>
    );
}
