import React from 'react';
import './Pages.css';
import Board from '../containers/Board';
import AllowDuplicates from '../containers/checkbox';

export const Home = () => (
    <section className="page home-section">
        <h1>Welcome to React Redux App</h1>
        <p>This is a modern web application built with React and Redux.</p>
        <div className="button-group">
            <button className="btn btn-primary">Primary Action</button>
            <button className="btn btn-success">Success Action</button>
            <button className="btn btn-danger">Danger Action</button>
            <button className="btn btn-warning">Warning Action</button>
        </div>
    </section>
);

export const About = () => (
    <section className="page about-section">
        <h2>About Us</h2>
        <p>We are a team of developers passionate about building amazing web applications.</p>
        <p>Our mission is to create user-friendly, performance-optimized applications.</p>
    </section>
);

export const NotesApp = () => (
    <section className="page notesapp-section">
        <h2>Our Notes App</h2>
        <AllowDuplicates/>
        <Board/>
    </section>
);

export const Contact = () => (
    <section className="page contact-section">
        <h2>Contact Us</h2>
        <p>Have a question? We'd love to hear from you!</p>
        <form className="contact-form">
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Your Message" rows="5"></textarea>
            <button className="btn btn-primary">Send Message</button>
        </form>
    </section>
);
