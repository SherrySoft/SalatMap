import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import MapView from './components/MapView';
import SettingsView from './components/SettingsView';
import BottomNavigation from './components/BottomNavigation';
import { getPrayerTimes, getNextPrayer } from './utils/prayerTimes';
import { getCurrentLocation, sortMosquesByDistance } from './utils/geo';
import mosquesData from './data/mosques.json';
import MosqueDetailCard from './components/MosqueDetailCard';
import SplashScreen from './components/SplashScreen';
import { fetchMosquesFromSheets, isGoogleSheetsConfigured } from './utils/googleSheets';
import './styles/index.css';
import './App.css';

function App() {
  const [location, setLocation] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [mosques, setMosques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Getting location...');
  const [activeView, setActiveView] = useState('home'); // 'home', 'map', 'settings'
  const [selectedMosque, setSelectedMosque] = useState(null);

  const handleMosqueSelect = (mosque) => {
    setSelectedMosque(mosque);
  };

  useEffect(() => {
    initializeApp();
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const initializeApp = async () => {
    try {
      // Get user's current location
      const userLocation = await getCurrentLocation();
      setLocation(userLocation);

      // Get location name using reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${userLocation.latitude}&lon=${userLocation.longitude}&format=json`
        );
        const data = await response.json();
        setLocationName(data.address.city || data.address.town || data.address.suburb || 'Your Location');
      } catch (error) {
        setLocationName('Your Location');
      }

      // Calculate prayer times
      const times = getPrayerTimes(userLocation.latitude, userLocation.longitude);
      setPrayerTimes(times);
      setNextPrayer(getNextPrayer(times));

      // Load mosque data (from Google Sheets if configured, otherwise local JSON)
      let mosquesSource = mosquesData;

      if (isGoogleSheetsConfigured()) {
        console.log('Fetching mosque data from Google Sheets...');
        const sheetData = await fetchMosquesFromSheets();
        if (sheetData && sheetData.length > 0) {
          mosquesSource = sheetData;
          console.log('Using Google Sheets data');
        } else {
          console.log('Falling back to local JSON data');
        }
      }

      // Sort mosques by distance
      const sortedMosques = sortMosquesByDistance(
        mosquesSource,
        userLocation.latitude,
        userLocation.longitude
      );
      setMosques(sortedMosques);

      setLoading(false);
    } catch (error) {
      console.error('Error initializing app:', error);

      // Show error to user
      alert('Could not get your location. Using default location (Karachi) for testing. \n\nIf on mobile, ensure you are using HTTPS or have location services enabled.');

      // Fallback: Use Karachi (DHA Phase 6) as default location to match dataset
      const defaultLat = 24.8015;
      const defaultLon = 67.0785;

      setLocation({
        latitude: defaultLat,
        longitude: defaultLon
      });

      setLocationName('Karachi (Default)');

      const times = getPrayerTimes(defaultLat, defaultLon);
      setPrayerTimes(times);

      const next = getNextPrayer(times, defaultLat, defaultLon);
      setNextPrayer(next);

      const sortedMosques = sortMosquesByDistance(
        mosquesData,
        defaultLat,
        defaultLon
      );
      setMosques(sortedMosques);

      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomePage
            prayerTimes={prayerTimes}
            nextPrayer={nextPrayer}
            mosques={mosques}
            loading={loading}
            onMosqueSelect={handleMosqueSelect}
          />
        );
      case 'map':
        return (
          <MapView
            mosques={mosques}
            location={location}
            loading={loading}
            onMosqueSelect={handleMosqueSelect}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="app">
      {activeView !== 'map' && activeView !== 'settings' && (
        <Header location={locationName} onToggleTheme={toggleTheme} />
      )}

      {renderView()}

      {selectedMosque && (
        <MosqueDetailCard
          mosque={selectedMosque}
          userLocation={location}
          onClose={() => setSelectedMosque(null)}
        />
      )}

      <BottomNavigation activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}

export default App;
