import React from 'react';
import '../components/Navigation.css';

function Navigation({ currentPage, onMenuClick }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo">MyApp</h1>
        <ul className="nav-menu">
          <li className="nav-item">
            <button
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => onMenuClick('home')}
            >
              Home
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => onMenuClick('about')}
            >
              About
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentPage === 'services' ? 'active' : ''}`}
              onClick={() => onMenuClick('services')}
            >
              Services
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentPage === 'breathing-techniques' ? 'active' : ''}`}
              onClick={() => onMenuClick('breathing-techniques')}
            >
              Breathing Techniques
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => onMenuClick('contact')}
            >
              Contact
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
