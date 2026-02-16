import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    My App
                </Link>
                <button 
                    className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul className={`menu-list ${isMenuOpen ? 'active' : ''}`}>
                    <li className="menu-item">
                        <Link 
                            to="/" 
                            className="menu-link"
                            onClick={handleMenuItemClick}
                        >
                            Home
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link 
                            to="/about" 
                            className="menu-link"
                            onClick={handleMenuItemClick}
                        >
                            About
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link 
                            to="/services" 
                            className="menu-link"
                            onClick={handleMenuItemClick}
                        >
                            Services
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link 
                            to="/contact" 
                            className="menu-link"
                            onClick={handleMenuItemClick}
                        >
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;
