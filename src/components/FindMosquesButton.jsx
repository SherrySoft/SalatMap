import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './FindMosquesButton.css';

function FindMosquesButton({ onClick }) {
    const { t } = useLanguage();

    return (
        <button className="find-mosques-button" onClick={onClick} aria-label="Find nearby mosques">
            <div className="button-content">
                <span className="mosque-icon-large">🕌</span>
                <span className="button-text">{t('findNearbyMosques')}</span>
            </div>
            <div className="pulse-ring"></div>
        </button>
    );
}

export default FindMosquesButton;
