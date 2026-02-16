import React from 'react';
import './Pages.css';

const Services = () => {
    const services = [
        { id: 1, name: 'Web Development', description: 'Building modern and responsive web applications' },
        { id: 2, name: 'UI/UX Design', description: 'Creating beautiful and intuitive user interfaces' },
        { id: 3, name: 'Consulting', description: 'Expert advice on technology and best practices' },
        { id: 4, name: 'Support & Maintenance', description: '24/7 support and regular maintenance services' }
    ];

    return (
        <div className="page-container">
            <h1>Our Services</h1>
            <p>We provide a wide range of professional services to meet your needs.</p>
            
            <div className="services-grid">
                {services.map(service => (
                    <div key={service.id} className="service-card">
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
