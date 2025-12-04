import React from 'react';
import './SplashScreen.css';

function SplashScreen() {
    return (
        <div className="splash-screen">
            <div className="splash-content">
                <img src="/logo.png" alt="SalatMap Logo" className="splash-logo" />
                <h1 className="splash-title">SalatMap</h1>
                <p className="splash-subtitle">Find Peace, Anywhere.</p>

                <div className="loading-indicator">
                    <div className="spinner"></div>
                    <p className="loading-text">Getting your location...</p>
                </div>
            </div>
        </div>
    );
}

export default SplashScreen;
