import React, { useEffect, useState } from 'react';
import ReportModal from './ReportModal';
import { formatDistance } from '../utils/geo';
import { formatTime, formatTimeRemaining, getNextPrayer } from '../utils/prayerTimes';
import './MosqueDetailCard.css';

function MosqueDetailCard({ mosque, userLocation, onClose }) {
    const [timeRemaining, setTimeRemaining] = useState('');
    const [nextPrayer, setNextPrayer] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isMyMosque, setIsMyMosque] = useState(false);

    // Check if this mosque is the user's saved mosque
    useEffect(() => {
        const savedMosqueId = localStorage.getItem('myMosqueId');
        setIsMyMosque(savedMosqueId === String(mosque?.id));
    }, [mosque]);

    useEffect(() => {
        if (!mosque || !mosque.jamatTimes) return;

        // Calculate next prayer based on mosque's specific jamat times
        // We need to adapt the getNextPrayer utility to work with the mosque's specific times
        // or recalculate it here. For simplicity, we'll reuse the utility if possible, 
        // but since getNextPrayer expects a standard prayer times object, we might need to map it.

        // Let's create a local next prayer calculation for the mosque's jamat times
        const calculateMosqueNextPrayer = () => {
            const now = new Date();
            const times = mosque.jamatTimes;
            const prayers = [
                { name: 'Fajr', time: times.fajr },
                { name: 'Dhuhr', time: times.dhuhr },
                { name: 'Asr', time: times.asr },
                { name: 'Sunset', time: times.sunset }, // Sunset time entered from M1 row
                { name: 'Isha', time: times.isha },
                { name: 'Jumuah', time: times.jumuah }
            ];

            // Helper to parse "HH:mm" or "HH:mm AM/PM" to Date object for today
            const parseTime = (timeStr) => {
                if (!timeStr) return null;

                let hours, minutes;
                const now = new Date();

                // Handle AM/PM format
                const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                if (match) {
                    hours = parseInt(match[1]);
                    minutes = parseInt(match[2]);
                    const period = match[3] ? match[3].toUpperCase() : null;

                    if (period === 'PM' && hours < 12) hours += 12;
                    if (period === 'AM' && hours === 12) hours = 0;
                } else {
                    // Fallback for simple HH:mm
                    const [h, m] = timeStr.split(':').map(Number);
                    hours = h;
                    minutes = m;
                }

                if (isNaN(hours) || isNaN(minutes)) return null;

                const date = new Date(now);
                date.setHours(hours, minutes, 0, 0);
                return date;
            };

            let next = null;
            let minDiff = Infinity;

            for (const prayer of prayers) {
                const prayerTime = parseTime(prayer.time);
                if (!prayerTime) continue;

                let diff = prayerTime - now;

                // If time has passed for today, it might be tomorrow (handled simply here by ignoring negative for now, 
                // or we could add 24h. For a simple "next" in list, we usually look forward).
                // Actually, if it's negative, it means the prayer has passed. 
                // We want the smallest POSITIVE difference.

                if (diff < 0) {
                    // If it's Isha and it's passed, next is Fajr tomorrow.
                    // But for simple "next today", we skip. 
                    // To handle "tomorrow", we'd need more complex logic. 
                    // Let's assume circular for Fajr if all passed.
                    continue;
                }

                if (diff < minDiff) {
                    minDiff = diff;
                    next = { ...prayer, date: prayerTime };
                }
            }

            // If no prayer found today (e.g. after Isha), next is Fajr tomorrow
            if (!next && times.fajr) {
                const fajrTime = parseTime(times.fajr);
                fajrTime.setDate(fajrTime.getDate() + 1);
                next = { name: 'Fajr', time: times.fajr, date: fajrTime };
            }

            setNextPrayer(next);
        };

        calculateMosqueNextPrayer();
        const timer = setInterval(calculateMosqueNextPrayer, 60000); // Update every minute is enough for "next prayer" change
        return () => clearInterval(timer);
    }, [mosque]);

    // Separate effect for countdown seconds
    useEffect(() => {
        if (!nextPrayer || !nextPrayer.date) return;

        const updateCountdown = () => {
            const now = new Date();
            const diff = nextPrayer.date - now;
            setTimeRemaining(formatTimeRemaining(diff));
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [nextPrayer]);

    if (!mosque) return null;

    return (
        <>
            <div className="mosque-detail-overlay">
                <div className="mosque-detail-backdrop" onClick={onClose}></div>
                <div className="mosque-detail-card card">
                    <button className="close-button" onClick={onClose}>&times;</button>

                    <div className="mosque-detail-header">
                        <div className="mosque-icon-large">🕌</div>
                        <div className="mosque-title-section">
                            <h2>{mosque.name}</h2>
                            <p className="mosque-address">{mosque.address}</p>
                            {mosque.distance !== undefined && (
                                <div className="distance-badge">
                                    <span>📍 {formatDistance(mosque.distance)} away</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {nextPrayer && (
                        <div className="next-jamat-section">
                            <div className="next-jamat-label">Next Jamat: {nextPrayer.name}</div>
                            <div className="next-jamat-time">{nextPrayer.time}</div>
                            <div className="jamat-countdown">
                                <span>Starts in </span>
                                <span className="countdown-mono">{timeRemaining}</span>
                            </div>
                        </div>
                    )}

                    <div className="jamat-times-list">
                        <h3>Jamat Times</h3>
                        <div className="times-grid">
                            {Object.entries(mosque.jamatTimes).map(([name, time]) => (
                                time && (
                                    <div key={name} className={`time-row ${nextPrayer && nextPrayer.name.toLowerCase() === name.toLowerCase() ? 'active' : ''}`}>
                                        <span className="prayer-name">{name}</span>
                                        <span className="prayer-time">{time}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {mosque.facilities && mosque.facilities.length > 0 && (
                        <div className="facilities-section">
                            <h3>Facilities</h3>
                            <div className="facilities-list">
                                {mosque.facilities.map(facility => (
                                    <span key={facility} className="facility-badge">{facility}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="action-buttons">
                        {mosque.lastUpdated && (
                            <div className="last-updated-section">
                                <span className="last-updated-label">Last Updated: </span>
                                <span className="last-updated-date">{mosque.lastUpdated}</span>
                            </div>
                        )}

                        <button
                            className={`my-mosque-button ${isMyMosque ? 'active' : ''}`}
                            onClick={() => {
                                if (isMyMosque) {
                                    localStorage.removeItem('myMosqueId');
                                    setIsMyMosque(false);
                                } else {
                                    localStorage.setItem('myMosqueId', String(mosque.id));
                                    setIsMyMosque(true);
                                }
                            }}
                        >
                            {isMyMosque ? '⭐ My Mosque' : '☆ Set as My Mosque'}
                        </button>

                        <button className="direction-button" onClick={() => {
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${mosque.latitude},${mosque.longitude}`, '_blank');
                        }}>
                            Get Directions 🗺️
                        </button>

                        <button className="report-button" onClick={() => setShowReportModal(true)} style={{
                            marginTop: '12px',
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: '1px solid var(--color-border)',
                            borderRadius: '16px',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}>
                            Report Incorrect Timing ⚠️
                        </button>
                    </div>
                </div>
            </div>
            {showReportModal && (
                <ReportModal
                    mosque={mosque}
                    onClose={() => setShowReportModal(false)}
                />
            )}
        </>
    );
}

export default MosqueDetailCard;
