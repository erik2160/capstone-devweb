const LOANS_KEY = 'book.loans.v1';

function readLoans() {
    try {
        return JSON.parse(localStorage.getItem(LOANS_KEY)) || [];
    } catch {
        return [];
    }
}

function writeLoans(list) {
    localStorage.setItem(LOANS_KEY, JSON.stringify(list));
}

/**
 * Retorna todos os empréstimos do usuário
 */
export function getLoansByUser(userId) {
    if (!userId) return [];
    return readLoans().filter((l) => l.userId === userId);
}

/**
 * Verifica se o usuário já pegou este livro
 */
export function hasLoan(userId, bookId) {
    return !!readLoans().find(
        (l) => l.userId === userId && l.bookId === bookId
    );
}

/**
 * Empresta livro
 */
export function borrowBook(userId, book) {
    if (!userId) throw new Error('Usuário não logado');
    const all = readLoans();
    if (all.some((l) => l.userId === userId && l.bookId === book.id)) {
        throw new Error('Você já pegou este livro emprestado.');
    }

    const loan = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        userId,
        bookId: book.id,
        title: book.title,
        authors: book.authors || [],
        thumbnail: book.thumbnail || null,
        borrowedAt: new Date().toISOString(),
    };

    all.push(loan);
    writeLoans(all);
    return loan;
}

/**
 * Devolve livro
 */
export function returnBook(userId, bookId) {
    if (!userId) throw new Error('Usuário não logado');
    const updated = readLoans().filter(
        (l) => !(l.userId === userId && l.bookId === bookId)
    );
    writeLoans(updated);
}
