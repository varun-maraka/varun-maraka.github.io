import React, { useState } from 'react';

const Menu = ({ activeApp, onMenuClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleMenuClick = (appName) => {
        onMenuClick(appName);
        setIsOpen(false);
    };

    return (
        <nav className="menu-nav">
            <div className="menu-header">
                <button 
                    className="hamburger-menu"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <span className="menu-title">My App</span>
            </div>
            <ul className={`menu-list ${isOpen ? 'open' : ''}`}>
                <li className={`menu-item ${activeApp === 'notes' ? 'active' : ''}`}>
                    <a onClick={() => handleMenuClick('notes')} className="menu-link">
                        Notes App
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;
