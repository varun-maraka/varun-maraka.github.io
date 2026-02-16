import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu, closeMenu } from '../redux/actions';
import './Menu.css';

const navLinks = [
    { label: 'Home', route: '#/' },
    { label: 'About', route: '#/about' },
    { label: 'Notes App', route: '#/notesapp' },
    { label: 'Contact', route: '#/contact' }
];

const getCurrentRoute = () => window.location.hash || '#/';

const Menu = () => {
    const dispatch = useDispatch();
    const isMenuOpen = useSelector((state) => state.isMenuOpen);
    const [currentRoute, setCurrentRoute] = useState(getCurrentRoute());

    useEffect(() => {
        const handleRouteChange = () => {
            setCurrentRoute(getCurrentRoute());
            dispatch(closeMenu());
        };

        window.addEventListener('hashchange', handleRouteChange);
        return () => window.removeEventListener('hashchange', handleRouteChange);
    }, [dispatch]);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">My App</div>
                <button
                    className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => dispatch(toggleMenu())}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul className={`menu-list ${isMenuOpen ? 'active' : ''}`}>
                    {navLinks.map(({ label, route }) => (
                        <li className="menu-item" key={route}>
                            <a
                                href={route}
                                onClick={() => dispatch(closeMenu())}
                                className={`menu-link ${currentRoute === route ? 'active' : ''}`}
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Menu;
