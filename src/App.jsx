import React from "react";
import Header from "./components/Header/Header";
import BooksList from "./components/BooksList";
import "./index.css";

export default function App() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h1>Explorar livros (Gutendex)</h1>
        <BooksList />
      </main>
    </>
  );
}
