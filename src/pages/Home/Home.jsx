import React from 'react';
import BooksList from '../../components/BooksList/BooksList';
import './Home.css';

export default function Home() {
    return (
        <main style={{ padding: 20 }}>
            <h1 className='searchTitle'>Explorar livros</h1>
            <BooksList />
        </main>
    );
}
