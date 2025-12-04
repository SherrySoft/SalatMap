import React from 'react';
import FindMosquesButton from './FindMosquesButton';
import './HomePage.css';

function HomePage({ prayerTimes, nextPrayer, mosques, loading, onMosqueSelect }) {

    const handleFindMosque = () => {
        if (mosques && mosques.length > 0) {
            // Mosques are already sorted by distance in App.jsx
            onMosqueSelect(mosques[0]);
        } else {
            alert('No mosques found nearby. Please ensure location services are enabled.');
        }
    };

    return (
        <div className="home-page">
            <div className="home-content">
                {/* Circular Find Button - Main Focus */}
                <div className="find-mosques-section content-visible">
                    <FindMosquesButton onClick={handleFindMosque} />
                </div>
            </div>
        </div>
    );
}

export default HomePage;
