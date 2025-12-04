import React from 'react';
import { formatDistance } from '../utils/geo';
import './MosqueList.css';

function MosqueList({ mosques, loading, limit, showViewAll = false }) {
    if (loading) {
        return (
            <div className="mosque-list">
                <h2 className="section-title">Nearby Mosques</h2>
                {[...Array(limit || 3)].map((_, i) => (
                    <div key={i} className="card">
                        <div className="skeleton" style={{ height: '120px' }}></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!mosques || mosques.length === 0) {
        return (
            <div className="mosque-list">
                <h2 className="section-title">Nearby Mosques</h2>
                <div className="empty-state card">
                    <div className="empty-icon">🕌</div>
                    <p className="empty-text">No mosques found nearby</p>
                    <p className="empty-subtext">Try allowing location access</p>
                </div>
            </div>
        );
    }

    // Limit mosques if limit prop is provided
    const displayedMosques = limit ? mosques.slice(0, limit) : mosques;
    const hasMore = limit && mosques.length > limit;

    return (
        <div className="mosque-list">
            <h2 className="section-title">
                Nearby Mosques <span className="mosque-count">({mosques.length})</span>
            </h2>
            <div className="mosques-grid">
                {displayedMosques.map((mosque, index) => (
                    <div key={mosque.id} className="mosque-card card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="mosque-header">
                            <div className="mosque-icon">🕌</div>
                            <div className="mosque-main-info">
                                <h3 className="mosque-name">{mosque.name}</h3>
                                {mosque.distance !== undefined && (
                                    <div className="distance-badge">
                                        <span className="distance-icon">📍</span>
                                        <span className="distance-text">{formatDistance(mosque.distance)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="mosque-address">{mosque.address}</p>

                        {mosque.capacity && (
                            <div className="mosque-capacity">
                                <span className="capacity-icon">👥</span>
                                <span className="capacity-text">Capacity: {mosque.capacity.toLocaleString()}</span>
                            </div>
                        )}

                        {mosque.jamatTimes && (
                            <div className="jamat-times-grid">
                                {Object.entries(mosque.jamatTimes).map(([prayer, time]) => (
                                    time && (
                                        <div key={prayer} className="jamat-time-item">
                                            <span className="jamat-label">{prayer}</span>
                                            <span className="jamat-time">{time}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        {mosque.facilities && mosque.facilities.length > 0 && (
                            <div className="facilities">
                                {mosque.facilities.map((facility) => (
                                    <span key={facility} className="facility-tag">
                                        {facility}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showViewAll && hasMore && (
                <div className="view-all-section">
                    <p className="view-all-text">
                        {mosques.length - limit} more mosques nearby
                    </p>
                    <p className="view-all-hint">Open map view to see all mosques</p>
                </div>
            )}
        </div>
    );
}

export default MosqueList;

