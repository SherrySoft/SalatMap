import React, { useState, useEffect } from 'react';
import './Header.css';

function Header({ location, onToggleTheme }) {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(currentTheme);

        // Listen for theme changes
        const observer = new MutationObserver(() => {
            const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(newTheme);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    return (
        <header className="header islamic-pattern">
            <div className="header-content">
                <div className="header-title">
                    <img src="/logo.png" alt="SalatMap Logo" className="app-logo" />
                    <div>
                        <h1 className="app-name">SalatMap</h1>
                        <p className="app-tagline">Find Mosques & Prayer Times</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle Theme">
                        {theme === 'dark' ? (
                            <svg className="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg className="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" />
                            </svg>
                        )}
                    </button>
                    {location && (
                        <div className="location-badge">
                            <span className="location-icon">📍</span>
                            <span className="location-text">{location}</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
