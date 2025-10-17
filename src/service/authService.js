/* eslint-disable react/prop-types */
const USERS_KEY = 'auth.users.v1';
const SESSION_KEY = 'auth.session.v1';

function readUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
        return [];
    }
}
function writeUsers(list) {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
}
function setSession(userId) {
    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ userId, ts: Date.now() })
    );
}
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}
function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
        return null;
    }
}

async function hashPassword(password) {
    const enc = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

function sanitizeEmail(email) {
    return (email || '').trim().toLowerCase();
}

function publicUser(u) {
    const { passwordHash, ...pub } = u;
    return pub;
}

export async function register({ name, email, password }) {
    const users = readUsers();
    const e = sanitizeEmail(email);
    if (!name || !e || !password)
        throw new Error('Preencha nome, e-mail e senha.');
    if (users.some((u) => u.email === e))
        throw new Error('Já existe uma conta com este e-mail.');

    const passwordHash = await hashPassword(password);
    const user = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        name: name.trim(),
        email: e,
        passwordHash,
        createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
    setSession(user.id);
    return publicUser(user);
}

export async function login({ email, password }) {
    const users = readUsers();
    const e = sanitizeEmail(email);
    const user = users.find((u) => u.email === e);
    if (!user) throw new Error('Usuário não encontrado.');
    const passwordHash = await hashPassword(password || '');
    if (passwordHash !== user.passwordHash) throw new Error('Senha incorreta.');
    setSession(user.id);
    return publicUser(user);
}

export function logout() {
    clearSession();
}

export function getCurrentUser() {
    const sess = getSession();
    if (!sess) return null;
    const users = readUsers();
    const user = users.find((u) => u.id === sess.userId);
    return user ? publicUser(user) : null;
}
