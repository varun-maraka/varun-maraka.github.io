import React, { useEffect, useState } from 'react';
import Menu from './components/Menu';
import { Home, About, NotesApp, Contact } from './components/Pages';
import './App.css';

const getCurrentRoute = () => window.location.hash || '#/';

const ROUTE_COMPONENTS = {
    '#/': Home,
    '#/about': About,
    '#/notesapp': NotesApp,
    '#/contact': Contact
};

function App() {
    const [route, setRoute] = useState(getCurrentRoute());

    useEffect(() => {
        if (!window.location.hash) {
            window.location.hash = '#/';
        }

        const handleRouteChange = () => setRoute(getCurrentRoute());
        window.addEventListener('hashchange', handleRouteChange);

        return () => window.removeEventListener('hashchange', handleRouteChange);
    }, []);

    const Page = ROUTE_COMPONENTS[route] || Home;

    return (
        <div className="app">
            <Menu />
            <main className="content">
                <Page />
            </main>
            <footer className="footer">
                <p>&copy; 2026 React Redux App. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
