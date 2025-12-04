import React, { useState, useEffect } from 'react';
import { formatTime, formatTimeRemaining } from '../utils/prayerTimes';
import './PrayerCard.css';

function PrayerCard({ prayerTimes, nextPrayer, compact = false }) {
    const [timeRemaining, setTimeRemaining] = useState('');

    useEffect(() => {
        if (!nextPrayer) return;

        const updateCountdown = () => {
            const now = new Date();
            const remaining = nextPrayer.time - now;
            setTimeRemaining(formatTimeRemaining(remaining));
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [nextPrayer]);

    if (!prayerTimes || !nextPrayer) {
        return (
            <div className={`prayer-card card ${compact ? 'compact' : ''}`}>
                <div className="skeleton" style={{ height: compact ? '120px' : '200px' }}></div>
            </div>
        );
    }

    const prayers = [
        { name: 'Fajr', time: prayerTimes.fajr, icon: '🌅' },
        { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: '☀️' },
        { name: 'Asr', time: prayerTimes.asr, icon: '🌤️' },
        { name: 'Sunset', time: prayerTimes.sunset, icon: '🌆' },
        { name: 'Isha', time: prayerTimes.isha, icon: '🌙' },
    ];

    // Compact mode: Show only next prayer
    if (compact) {
        return (
            <div className="prayer-card card compact islamic-pattern">
                <div className="next-prayer-section compact-mode">
                    <h2 className="section-title">Next Prayer</h2>
                    <div className="next-prayer-info">
                        <div className="prayer-name-large">
                            <span className="prayer-icon-large">
                                {prayers.find(p => p.name === nextPrayer.name)?.icon || '🕌'}
                            </span>
                            <span>{nextPrayer.name}</span>
                        </div>
                        <div className="prayer-time-large">
                            {formatTime(nextPrayer.time)}
                        </div>
                        <div className="countdown pulse">
                            <span className="countdown-label">Time Remaining:</span>
                            <span className="countdown-time">{timeRemaining}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Full mode: Show all prayers
    return (
        <div className="prayer-card card islamic-pattern">
            <div className="next-prayer-section">
                <h2 className="section-title">Next Prayer</h2>
                <div className="next-prayer-info">
                    <div className="prayer-name-large">
                        <span className="prayer-icon-large">
                            {prayers.find(p => p.name === nextPrayer.name)?.icon || '🕌'}
                        </span>
                        <span>{nextPrayer.name}</span>
                    </div>
                    <div className="prayer-time-large">
                        {formatTime(nextPrayer.time)}
                    </div>
                    <div className="countdown pulse">
                        <span className="countdown-label">Time Remaining:</span>
                        <span className="countdown-time">{timeRemaining}</span>
                    </div>
                </div>
            </div>

            <div className="all-prayers-section">
                <h3 className="section-subtitle">Today's Prayer Times</h3>
                <div className="prayer-times-grid">
                    {prayers.map((prayer) => (
                        <div
                            key={prayer.name}
                            className={`prayer-time-item ${prayer.name === nextPrayer.name ? 'active' : ''
                                }`}
                        >
                            <div className="prayer-info">
                                <span className="prayer-icon">{prayer.icon}</span>
                                <span className="prayer-name">{prayer.name}</span>
                            </div>
                            <span className="prayer-time">{formatTime(prayer.time)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PrayerCard;

