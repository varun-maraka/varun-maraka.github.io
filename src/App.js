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
    );
}

export default App;
