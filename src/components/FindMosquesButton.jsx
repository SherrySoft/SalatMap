import React from 'react';
import './FindMosquesButton.css';

function FindMosquesButton({ onClick }) {
    return (
        <button className="find-mosques-button" onClick={onClick} aria-label="Find nearby mosques">
            <div className="button-content">
                <span className="mosque-icon-large">🕌</span>
                <span className="button-text">Find Nearby Mosques</span>
            </div>
            <div className="pulse-ring"></div>
        </button>
    );
}

export default FindMosquesButton;
