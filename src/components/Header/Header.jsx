import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import './Header.css';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">BookShelfs</Link>
            </div>

            <nav className="nav">
                {user ? (
                    <Link to="/profile" className="btn-primary">
                        Perfil
                    </Link>
                ) : (
                    <Link to="/auth" className="btn-primary">
                        Login
                    </Link>
                )}
            </nav>

            {}
            <div className="mobile-profile">
                <Link to={user ? "/profile" : "/auth"}>
                    <User size={26} />
                </Link>
            </div>
        </header>
    );
}
