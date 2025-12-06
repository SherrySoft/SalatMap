import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { formatDistance } from '../utils/geo';
import './MapView.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom mosque icon
const mosqueIcon = new L.divIcon({
    className: 'custom-mosque-marker',
    html: '<div class="mosque-marker-icon">🕌</div>',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// User location icon
const userIcon = new L.divIcon({
    className: 'custom-user-marker',
    html: '<div class="user-marker-icon">📍</div>',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Icons
const LayersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
);

const LocationIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="22" y1="12" x2="18" y2="12"></line>
        <line x1="6" y1="12" x2="2" y2="12"></line>
        <line x1="12" y1="6" x2="12" y2="2"></line>
        <line x1="12" y1="22" x2="12" y2="18"></line>
    </svg>
);

// Component to handle map flying
function MapFlyTo({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15, { duration: 0.5 });
        }
    }, [center, map]);
    return null;
}

// Custom Map Controls Component
function MapControls({ onLocationClick, onLayerToggle }) {
    const map = useMap();

    return (
        <div className="map-controls-container">
            <div className="zoom-control-group">
                <button className="zoom-btn zoom-in" onClick={() => map.zoomIn()} aria-label="Zoom In">
                    <span className="zoom-icon">+</span>
                </button>
                <div className="zoom-divider"></div>
                <button className="zoom-btn zoom-out" onClick={() => map.zoomOut()} aria-label="Zoom Out">
                    <span className="zoom-icon">−</span>
                </button>
            </div>

            <button className="map-control-btn layers-btn" onClick={onLayerToggle} aria-label="Toggle Layers">
                <LayersIcon />
            </button>

            <button className="map-control-btn location-btn" onClick={onLocationClick} aria-label="My Location">
                <LocationIcon />
            </button>
        </div>
    );
}

function MapView({ mosques, location, loading, onMosqueSelect }) {
    const mapRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMosques, setFilteredMosques] = useState(mosques);
    const [flyToCenter, setFlyToCenter] = useState(null);
    const [mapLayer, setMapLayer] = useState('street');
    const [showZoomTip, setShowZoomTip] = useState(() => {
        return !localStorage.getItem('zoomTipDismissed');
    });

    // Auto-dismiss zoom tip after 3 seconds
    useEffect(() => {
        if (showZoomTip) {
            const timer = setTimeout(() => {
                setShowZoomTip(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showZoomTip]);

    // Default center (Karachi DHA) if no location
    const defaultCenter = [24.8015, 67.0785];
    const center = location ? [location.latitude, location.longitude] : defaultCenter;

    useEffect(() => {
        setMapReady(true);
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredMosques(mosques);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = mosques.filter(mosque =>
                mosque.name.toLowerCase().includes(lowerQuery) ||
                mosque.address.toLowerCase().includes(lowerQuery)
            );
            setFilteredMosques(filtered);
        }
    }, [searchQuery, mosques]);

    const handleLocationClick = () => {
        if (location) {
            setFlyToCenter([location.latitude, location.longitude]);
        } else {
            alert("Location not available");
        }
    };

    const handleLayerToggle = () => {
        setMapLayer(prev => prev === 'street' ? 'satellite' : 'street');
    };

    const handleSearchSelect = (mosque) => {
        setFlyToCenter([mosque.latitude, mosque.longitude]);
        setSearchQuery('');
    };

    const dismissZoomTip = () => {
        setShowZoomTip(false);
        localStorage.setItem('zoomTipDismissed', 'true');
    };

    if (loading || !mapReady) {
        return (
            <div className="map-view">
                <div className="map-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="map-view">
            {/* Search Bar Overlay */}
            <div className="map-search-container">
                <input
                    type="text"
                    placeholder="Search mosques..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="map-search-input"
                />
                {searchQuery && (
                    <div className="search-results">
                        {filteredMosques.slice(0, 5).map(mosque => (
                            <div
                                key={mosque.id}
                                className="search-result-item"
                                onClick={() => handleSearchSelect(mosque)}
                            >
                                <span className="result-icon">🕌</span>
                                <div className="result-info">
                                    <div className="result-name">{mosque.name}</div>
                                    <div className="result-address">{mosque.address}</div>
                                </div>
                            </div>
                        ))}
                        {filteredMosques.length === 0 && (
                            <div className="search-no-results">No mosques found</div>
                        )}
                    </div>
                )}
            </div>

            {/* Zoom Tip */}
            {showZoomTip && (
                <div className="map-zoom-tip">
                    <span>Pinch or use +/- to zoom</span>
                </div>
            )}

            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                zoomControl={false}
                preferCanvas={true}
                updateWhenIdle={true}
                updateWhenZooming={false}
                className="leaflet-map"
                ref={mapRef}
            >
                <MapFlyTo center={flyToCenter} />
                <MapControls onLocationClick={handleLocationClick} onLayerToggle={handleLayerToggle} />

                {mapLayer === 'street' ? (
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                ) : (
                    <TileLayer
                        attribution='Tiles &copy; Esri'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                )}

                {/* User location marker */}
                {location && (
                    <Marker position={[location.latitude, location.longitude]} icon={userIcon}>
                        <Popup>
                            <div className="map-popup">
                                <h3>Your Location</h3>
                                <p>📍 You are here</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Mosque markers with popup */}
                {filteredMosques && filteredMosques.map((mosque) =>
                    mosque.latitude && mosque.longitude && (
                        <Marker
                            key={mosque.id}
                            position={[mosque.latitude, mosque.longitude]}
                            icon={mosqueIcon}
                        >
                            <Popup className="mosque-popup">
                                <div className="mosque-popup-content">
                                    <h4 className="popup-mosque-name">{mosque.name}</h4>
                                    <p className="popup-mosque-address">{mosque.address}</p>
                                    {mosque.distance !== undefined && (
                                        <p className="popup-mosque-distance">📍 {formatDistance(mosque.distance)}</p>
                                    )}
                                    <button
                                        className="popup-view-times-btn"
                                        onClick={() => onMosqueSelect(mosque)}
                                    >
                                        View Prayer Times
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                )}
            </MapContainer>
        </div>
    );
}

export default MapView;
