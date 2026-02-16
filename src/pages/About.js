import React from 'react';
import './Pages.css';

function About() {
  return (
    <div className="page about-page">
      <h2>About Us</h2>
      <p>Welcome to the About page!</p>
      <p>
        This is a React application built with React Router DOM for seamless navigation between different pages.
        Each menu item loads its own dedicated content without refreshing the entire page.
      </p>
      <h2>Why Choose Us?</h2>
      <ul className="features-list">
        <li>Fast and responsive design</li>
        <li>Easy navigation with React Router</li>
        <li>Compatible with GitHub Pages</li>
        <li>Modern React 18 technology</li>
      </ul>
    </div>
  );
}

export default About;
