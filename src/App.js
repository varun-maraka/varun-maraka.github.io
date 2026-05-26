import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import BreathingTechniques from './pages/BreathingTechniques';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'home';
    setCurrentPage(hash);
  }, []);

  const handleMenuClick = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'services':
        return <Services />;
      case 'contact':
        return <Contact />;
      case 'breathing-techniques':
        return <BreathingTechniques />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <Navigation currentPage={currentPage} onMenuClick={handleMenuClick} />
      <main className="main-content">
        {renderPage()}
      </main>
      <footer className="footer">
        <p>&copy; 2026 React Menu App. All rights reserved.</p>
        <p className="footer-credit">Developed by Varun Maraka, under the guidance of Anokha V, MS in Psychology</p>
      </footer>
    </div>
  );
}
export default App;
