import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';
import * as auth from '../service/authService';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => auth.getCurrentUser());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'auth.session.v1' || e.key === 'auth.users.v1') {
                setUser(auth.getCurrentUser());
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const doLogin = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const u = await auth.login({ email, password });
            setUser(u);
            return u;
        } catch (e) {
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const doRegister = useCallback(async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const u = await auth.register({ name, email, password });
            setUser(u);
            return u;
        } catch (e) {
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const doLogout = useCallback(() => {
        auth.logout();
        setUser(null);
    }, []);

    const value = {
        user,
        loading,
        error,
        login: doLogin,
        register: doRegister,
        logout: doLogout,
    };
    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx)
        throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
    return ctx;
}
