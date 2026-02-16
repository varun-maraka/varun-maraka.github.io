import React from 'react';
import './Pages.css';

const Home = () => {
    return (
        <div className="page-container">
            <h1>Welcome to Home Page</h1>
            <p>This is the home page of our React application.</p>
            <p>Click on the menu items above to navigate through different pages.</p>
            <div className="button-group">
                <button className="btn btn-primary">Primary Button</button>
                <button className="btn btn-success">Success Button</button>
                <button className="btn btn-danger">Danger Button</button>
                <button className="btn btn-warning">Warning Button</button>
            </div>
        </div>
    );
};

export default Home;
