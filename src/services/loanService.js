// src/service/loanService.js
const LOANS_KEY = 'book.loans.v2'; // <- nova versão (v2) para suportar returnedAt

function readLoans() {
    try {
        const raw = localStorage.getItem(LOANS_KEY);
        const data = raw ? JSON.parse(raw) : [];
        // migração simples de v1 (sem returnedAt): tudo que existe e não tem returnedAt é considerado ativo
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}
function writeLoans(list) {
    localStorage.setItem(LOANS_KEY, JSON.stringify(list));
}

/** Empréstimos do usuário (ativos) */
export function getLoansByUser(userId) {
    if (!userId) return [];
    return readLoans().filter((l) => l.userId === userId && !l.returnedAt);
}

/** Histórico (ativos + devolvidos) do usuário */
export function getLoanHistoryByUser(userId) {
    if (!userId) return [];
    return readLoans().filter((l) => l.userId === userId);
}

/** Existe empréstimo ativo para este livro (de qualquer usuário)? */
export function getActiveLoanForBook(bookId) {
    return (
        readLoans().find((l) => l.bookId === bookId && !l.returnedAt) || null
    );
}

/** Usuário já pegou este livro e ainda está ativo? */
export function hasActiveLoan(userId, bookId) {
    return !!readLoans().find(
        (l) => l.userId === userId && l.bookId === bookId && !l.returnedAt
    );
}

/** Emprestar livro — bloqueia se alguém já pegou */
export function borrowBook(userId, book) {
    if (!userId) throw new Error('Usuário não logado.');
    const all = readLoans();

    const taken = all.find((l) => l.bookId === book.id && !l.returnedAt);
    if (taken && taken.userId !== userId) {
        throw new Error('Este livro já está emprestado por outro usuário.');
    }
    if (taken && taken.userId === userId) {
        throw new Error('Você já pegou este livro.');
    }

    const loan = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        userId,
        bookId: book.id,
        title: book.title,
        authors: book.authors || [],
        thumbnail: book.thumbnail || null,
        borrowedAt: new Date().toISOString(),
        returnedAt: null, // ativo enquanto for null
    };

    all.push(loan);
    writeLoans(all);
    return loan;
}

/** Devolver livro — marca returnedAt (mantém histórico) */
export function returnBook(userId, bookId) {
    if (!userId) throw new Error('Usuário não logado.');
    const all = readLoans();
    const idx = all.findIndex(
        (l) => l.userId === userId && l.bookId === bookId && !l.returnedAt
    );
    if (idx === -1) return; // nada a fazer
    all[idx] = { ...all[idx], returnedAt: new Date().toISOString() };
    writeLoans(all);
}
