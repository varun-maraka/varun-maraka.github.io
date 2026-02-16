import React from 'react';
import './Pages.css';

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

export const Services = () => (
    <section className="page services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
            <div className="service-card">
                <h3>Web Development</h3>
                <p>Building responsive and scalable web applications</p>
            </div>
            <div className="service-card">
                <h3>UI/UX Design</h3>
                <p>Creating beautiful and intuitive user interfaces</p>
            </div>
            <div className="service-card">
                <h3>Consulting</h3>
                <p>Expert advice on technology and architecture</p>
            </div>
        </div>
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
