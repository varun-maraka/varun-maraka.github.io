import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu, closeMenu } from '../redux/actions';
import './Menu.css';

const MenuItem = ({ to, label, isActive, onNavigate }) => (
    <li className="menu-item">
        <a href={`#${to}`} onClick={onNavigate} className={`menu-link ${isActive ? 'active' : ''}`}>
            {label}
        </a>
    </li>
);

const Menu = ({ currentPath }) => {
    const dispatch = useDispatch();
    const isMenuOpen = useSelector(state => state.isMenuOpen);

    const handleHamburgerClick = () => {
        dispatch(toggleMenu());
    };

    const handleMenuItemClick = () => {
        dispatch(closeMenu());
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">My App</div>
                <button
                    className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
                    onClick={handleHamburgerClick}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul className={`menu-list ${isMenuOpen ? 'active' : ''}`}>
                    <MenuItem to="/" label="Home" isActive={currentPath === '/'} onNavigate={handleMenuItemClick} />
                    <MenuItem to="/about" label="About" isActive={currentPath === '/about'} onNavigate={handleMenuItemClick} />
                    <MenuItem to="/notes-app" label="Notes App" isActive={currentPath === '/notes-app'} onNavigate={handleMenuItemClick} />
                    <MenuItem to="/contact" label="Contact" isActive={currentPath === '/contact'} onNavigate={handleMenuItemClick} />
                </ul>
            </div>
        </nav>
    );
};

export default Menu;
