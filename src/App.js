<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Navigation />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </main>
                <footer className="footer">
                    <p>&copy; 2026 React Menu App. All rights reserved.</p>
                </footer>
            </div>
        </Router>
=======
import React, { useEffect, useMemo, useState } from 'react';
import Menu from './components/Menu';
import { Home, About, NotesApp, Contact } from './components/Pages';
import './App.css';

const getCurrentPath = () => {
    const hash = window.location.hash || '#/';
    const normalizedHash = hash.startsWith('#') ? hash.slice(1) : hash;

    if (normalizedHash === '' || normalizedHash === '/') {
        return '/';
    }

    return normalizedHash;
};

function App() {
    const [currentPath, setCurrentPath] = useState(getCurrentPath());

    useEffect(() => {
        if (!window.location.hash) {
            window.location.hash = '#/';
        }

        const handleHashChange = () => {
            setCurrentPath(getCurrentPath());
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const page = useMemo(() => {
        switch (currentPath) {
            case '/':
                return <Home />;
            case '/about':
                return <About />;
            case '/notes-app':
                return <NotesApp />;
            case '/contact':
                return <Contact />;
            default:
                return <Home />;
        }
    }, [currentPath]);

    return (
        <div className="app">
            <Menu currentPath={currentPath} />
            <main className="content">
                {page}
            </main>
            <footer className="footer">
                <p>&copy; 2026 React Redux App. All rights reserved.</p>
            </footer>
        </div>
>>>>>>> 445a5d0b5de4e2d1404fc25193e57a0c757cbf89
    );
}

export default App;
