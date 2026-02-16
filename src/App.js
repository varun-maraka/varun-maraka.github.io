import React from 'react';
import { useSelector } from 'react-redux';
import Menu from './components/Menu';
import { Home, About, NotesApp, Contact } from './components/Pages';
import './App.css';

function App() {
    const activePage = useSelector(state => state.activePage);

    const renderPage = () => {
        switch (activePage) {
            case 'home':
                return <Home />;
            case 'about':
                return <About />;
            case 'notesapp':
                return <NotesApp />;
            case 'contact':
                return <Contact />;
            default:
                return <Home />;
        }
    };

    return (
        <div className="app">
            <Menu />
            <main className="content">
                {renderPage()}
            </main>
            <footer className="footer">
                <p>&copy; 2026 React Redux App. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
