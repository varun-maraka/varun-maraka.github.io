import React from 'react';

const Menu = ({ activeApp, onMenuClick }) => (
    <nav className="menu-nav">
        <ul className="menu-list">
            <li className={`menu-item ${activeApp === 'notes' ? 'active' : ''}`}>
                <a onClick={() => onMenuClick('notes')} className="menu-link">
                    Notes App
                </a>
            </li>
        </ul>
    </nav>
);

export default Menu;
