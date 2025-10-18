import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Home from './pages/Home/Home.jsx';
import BookDetails from './pages/BookDetails/BookDetails.jsx';
import AuthPage from './pages/Auth/Auth.jsx';
import Profile from './pages/Profile/Profile.jsx';
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'book/:id', element: <BookDetails /> },
            { path: 'auth', element: <AuthPage /> },
            { path: 'profile', element: <Profile /> },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
