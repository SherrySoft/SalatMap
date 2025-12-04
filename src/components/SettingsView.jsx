import React, { useState, useEffect } from 'react';
import './SettingsView.css';

function SettingsView() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <div className="settings-view">
            <div className="settings-content">
                <h1 className="settings-title">⚙️ Settings</h1>

                {/* Theme Settings */}
                <div className="settings-section card">
                    <h2 className="section-title">🎨 Appearance</h2>
                    <p className="section-description">Choose your preferred theme</p>

                    <div className="theme-options">
                        <button
                            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('light')}
                        >
                            <div className="theme-preview light-preview">
                                <div className="preview-header"></div>
                                <div className="preview-content"></div>
                            </div>
                            <span className="theme-label">☀️ Light Mode</span>
                            {theme === 'light' && <span className="active-badge">✓</span>}
                        </button>

                        <button
                            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('dark')}
                        >
                            <div className="theme-preview dark-preview">
                                <div className="preview-header"></div>
                                <div className="preview-content"></div>
                            </div>
                            <span className="theme-label">🌙 Dark Mode</span>
                            {theme === 'dark' && <span className="active-badge">✓</span>}
                        </button>
                    </div>
                </div>

                {/* About Section */}
                <div className="settings-section card">
                    <h2 className="section-title">ℹ️ About</h2>
                    <div className="about-content">
                        <p><strong>SalatMap</strong></p>
                        <p className="text-secondary">Find nearby mosques and accurate prayer times</p>
                        <p className="version-text">Version 1.0.0</p>
                    </div>
                </div>

                {/* Additional Settings Placeholder */}
                <div className="settings-section card">
                    <h2 className="section-title">🔔 More Settings</h2>
                    <p className="text-secondary">Additional settings coming soon...</p>
                    <ul className="upcoming-features">
                        <li>Prayer time notifications</li>
                        <li>Calculation method selection</li>
                        <li>Language preferences</li>
                        <li>Location settings</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default SettingsView;
