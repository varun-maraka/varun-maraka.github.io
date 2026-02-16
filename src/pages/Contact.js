import React, { useState } from 'react';
import './Pages.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you ${formData.name}! Your message has been received.`);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="page-container">
            <h1>Contact Us</h1>
            <p>Have a question? We'd love to hear from you!</p>
            
            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        rows="5"
                        required
                    ></textarea>
                </div>

                <button className="btn btn-primary" type="submit">Send Message</button>
            </form>
        </div>
    );
};

export default Contact;
