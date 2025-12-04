import React from 'react';
import './BottomNavigation.css';

function BottomNavigation({ activeView, onViewChange }) {
    const navItems = [
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'map', icon: '🗺️', label: 'Map' },
        { id: 'settings', icon: '⚙️', label: 'Settings' }
    ];

    return (
        <nav className="bottom-navigation">
            <div className="nav-container">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => onViewChange(item.id)}
                        aria-label={item.label}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}

export default BottomNavigation;
