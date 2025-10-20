const LOANS_KEY = 'book.loans.v2';

function readLoans() {
    try {
        const raw = localStorage.getItem(LOANS_KEY);
        const data = raw ? JSON.parse(raw) : [];
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}
function writeLoans(list) {
    localStorage.setItem(LOANS_KEY, JSON.stringify(list));
}

export function getLoansByUser(userId) {
    if (!userId) return [];
    return readLoans().filter((l) => l.userId === userId && !l.returnedAt);
}

export function getLoanHistoryByUser(userId) {
    if (!userId) return [];
    return readLoans().filter((l) => l.userId === userId);
}

export function getActiveLoanForBook(bookId) {
    return (
        readLoans().find((l) => l.bookId === bookId && !l.returnedAt) || null
    );
}

export function hasActiveLoan(userId, bookId) {
    return !!readLoans().find(
        (l) => l.userId === userId && l.bookId === bookId && !l.returnedAt
    );
}

function addDays(iso, days) {
    const d = new Date(iso);
    d.setDate(d.getDate() + days);
    return d.toISOString();
}

export function isOverdue(loan) {
    return !loan.returnedAt && new Date() > new Date(loan.dueAt);
}

export function daysLeft(loan) {
    const ms = new Date(loan.dueAt) - new Date();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function returnBook(userId, bookId) {
    if (!userId) throw new Error('Usuário não logado.');
    const all = readLoans();
    const idx = all.findIndex(
        (l) => l.userId === userId && l.bookId === bookId && !l.returnedAt
    );
    if (idx === -1) return;
    all[idx] = { ...all[idx], returnedAt: new Date().toISOString() };
    writeLoans(all);
}

export function hasOverdueLoans(userId) {
    if (!userId) return false;
    const all = readLoans();
    return all.some(
        (l) =>
            l.userId === userId &&
            !l.returnedAt &&
            new Date() > new Date(l.dueAt)
    );
}

export function getOverdueLoans(userId) {
    if (!userId) return [];
    const all = readLoans();
    return all.filter(
        (l) =>
            l.userId === userId &&
            !l.returnedAt &&
            new Date() > new Date(l.dueAt)
    );
}

export function getActiveLoansByUser(userId) {
    if (!userId) return [];
    return readLoans().filter((l) => l.userId === userId && !l.returnedAt);
}

export function getUserActiveLoan(userId) {
    const all = getActiveLoansByUser(userId);
    return all.length ? all[0] : null;
}

export function hasAnyActiveLoan(userId) {
    return getActiveLoansByUser(userId).length > 0;
}

export function borrowBook(userId, book) {
    if (!userId) throw new Error('Usuário não logado.');

    if (hasOverdueLoans(userId)) {
        throw new Error(
            'Você tem livros atrasados. Devolva-os antes de pegar novos empréstimos.'
        );
    }

    if (hasAnyActiveLoan(userId)) {
        throw new Error(
            'Você já tem um empréstimo ativo. Devolva-o para pegar outro.'
        );
    }

    const all = readLoans();
    const taken = all.find((l) => l.bookId === book.id && !l.returnedAt);
    if (taken && taken.userId !== userId) {
        throw new Error('Este livro já está emprestado por outro usuário.');
    }
    if (taken && taken.userId === userId) {
        throw new Error('Você já pegou este livro.');
    }

    const borrowedAt = new Date().toISOString();
    const loan = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        userId,
        bookId: book.id,
        title: book.title,
        authors: book.authors || [],
        thumbnail: book.thumbnail || null,
        borrowedAt,
        dueAt: addDays(borrowedAt, 7),
        returnedAt: null,
    };

    all.push(loan);
    writeLoans(all);
    return loan;
}
