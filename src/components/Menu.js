import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu, setActivePage } from '../redux/actions';
import './Menu.css';

const Menu = () => {
    const dispatch = useDispatch();
    const isMenuOpen = useSelector(state => state.isMenuOpen);
    const activePage = useSelector(state => state.activePage);

    const handleMenuItemClick = (page) => {
        dispatch(setActivePage(page));
    };

    const handleHamburgerClick = () => {
        dispatch(toggleMenu());
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
                    <li className="menu-item">
                        <a 
                            onClick={() => handleMenuItemClick('home')}
                            className={`menu-link ${activePage === 'home' ? 'active' : ''}`}
                        >
                            Home
                        </a>
                    </li>
                    <li className="menu-item">
                        <a 
                            onClick={() => handleMenuItemClick('about')}
                            className={`menu-link ${activePage === 'about' ? 'active' : ''}`}
                        >
                            About
                        </a>
                    </li>
                    <li className="menu-item">
                        <a 
                            onClick={() => handleMenuItemClick('services')}
                            className={`menu-link ${activePage === 'services' ? 'active' : ''}`}
                        >
                            Services
                        </a>
                    </li>
                    <li className="menu-item">
                        <a 
                            onClick={() => handleMenuItemClick('contact')}
                            className={`menu-link ${activePage === 'contact' ? 'active' : ''}`}
                        >
                            Contact
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Menu;
