# Capstone de Desenvolvimento Web - Erik Fernandes

# Descrição
Este projeto é uma aplicação web de biblioteca digital desenvolvida em React.js, que consome a API pública Gutendex. O sistema permite pesquisar, filtrar e visualizar livros, além de simular um sistema de empréstimos e devoluções com autenticação local.
Todas as funcionalidades foram implementadas com hooks personalizados, componentização modular e persistência via localStorage.

# Projeto em produção
https://

# Principais funcionalidades
- Busca e paginação de livros pela API Gutendex
- Filtros dinâmicos por idioma e categoria
- Exibição de detalhes completos de cada livro
- Skeleton Loading durante carregamentos e paginações
- Sistema de autenticação local (registro, login e persistência com localStorage)
- Empréstimo e devolução de livros, com:
    - Bloqueio de novos empréstimos se houver atraso
    - Limite de 1 livro ativo por usuário
    - Data de devolução automática (7 dias)
    - Histórico completo de empréstimos

# Estrutura de pastas
```src/
 ├── components/
 │   ├── BookCard/
 │   ├── BooksList/
 │   ├── Pagination/
 │   ├── SkeletonCard/
 │   └── Header/
 │
 ├── context/
 │   ├── AuthContext.jsx
 │   └── SearchContext.jsx
 │
 ├── hooks/
 │   └── useBook.js
 │
 ├── pages/
 │   ├── Home/
 │   ├── BookDetails/
 │   ├── Auth/
 │   └── Profile/
 │
 ├── services/
 │   ├── bookService.js
 │   ├── loanService.js
 │   └── userService.js
 │
 │
 ├── App.jsx
 ├── main.jsx
 └── index.css
```

# Tecnologias Utilizadas
- React.js (Vite)
- React Router DOM
- JavaScript (ES6+)
- CSS Modules / Flexbox / Grid
- LocalStorage para persistência de dados
- Gutendex API (https://gutendex.com)

# Rodando o projeto
**1. Clone o repositorio**
```git bash
git clone git@github.com:erik2160/capstone-devweb.git
cd webdev-capstone
```

**2. Instale as dependências**
```bash
npm install
```

**3. Execute o projeto**
```bash
npm run dev
```

**4. Accesse no seu navegador**
```bash
http://localhost:5173
```

# Instructions
1. Na página inicial, pesquise um livro pelo título, autor ou palavra-chave.
2. Utilize os filtros de idioma e categoria para refinar a busca.
3. Clique em um livro para abrir a página de detalhes.
4. Crie uma conta ou faça login para acessar a área do usuário.
5. Após logado:
    - Empreste um livro (máximo de 1 ativo).
    - Consulte sua data de devolução (7 dias).
    - Devolva o livro para liberar novos empréstimos.
    - No Perfil, veja o histórico completo de empréstimos e atrasos.

- - -
Feito por Erik Fernandes - Jala University® 2025