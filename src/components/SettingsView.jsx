import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, CALCULATION_METHODS, LANGUAGES, REMINDER_OPTIONS } from '../utils/settings';
import { requestNotificationPermission } from '../hooks/useMyMosque';
import './SettingsView.css';

function SettingsView() {
    const [settings, setSettings] = useState(getSettings);

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', settings.theme);
        saveSettings(settings);
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const updateNestedSetting = (parent, key, value) => {
        setSettings(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [key]: value }
        }));
    };

    const handleNotificationToggle = async () => {
        if (!settings.notifications.enabled) {
            const granted = await requestNotificationPermission();
            if (granted) {
                updateNestedSetting('notifications', 'enabled', true);
            } else {
                alert('Please enable notifications in your browser/device settings to use this feature.');
            }
        } else {
            updateNestedSetting('notifications', 'enabled', false);
        }
    };

    return (
        <div className="settings-view">
            <div className="settings-content">
                <h1 className="settings-title">⚙️ Settings</h1>

                {/* Theme Settings */}
                <div className="settings-section card">
                    <h2 className="section-title">🎨 Appearance</h2>
                    <p className="section-description">Choose your preferred theme</p>

                    <div className="theme-options">
                        <button
                            className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
                            onClick={() => updateSetting('theme', 'light')}
                        >
                            <div className="theme-preview light-preview">
                                <div className="preview-header"></div>
                                <div className="preview-content"></div>
                            </div>
                            <span className="theme-label">☀️ Light Mode</span>
                            {settings.theme === 'light' && <span className="active-badge">✓</span>}
                        </button>

                        <button
                            className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
                            onClick={() => updateSetting('theme', 'dark')}
                        >
                            <div className="theme-preview dark-preview">
                                <div className="preview-header"></div>
                                <div className="preview-content"></div>
                            </div>
                            <span className="theme-label">🌙 Dark Mode</span>
                            {settings.theme === 'dark' && <span className="active-badge">✓</span>}
                        </button>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="settings-section card">
                    <h2 className="section-title">🔔 Notifications</h2>
                    <p className="section-description">Get reminded before prayer times</p>

                    <div className="setting-row">
                        <div className="setting-info">
                            <span className="setting-label">Prayer Reminders</span>
                            <span className="setting-hint">For your saved mosque</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.notifications.enabled}
                                onChange={handleNotificationToggle}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {settings.notifications.enabled && (
                        <div className="setting-row">
                            <div className="setting-info">
                                <span className="setting-label">Reminder Time</span>
                                <span className="setting-hint">How early to notify</span>
                            </div>
                            <select
                                className="setting-select"
                                value={settings.notifications.reminderMinutes}
                                onChange={(e) => updateNestedSetting('notifications', 'reminderMinutes', parseInt(e.target.value))}
                            >
                                {REMINDER_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Calculation Method */}
                <div className="settings-section card">
                    <h2 className="section-title">🕋 Prayer Calculation</h2>
                    <p className="section-description">Method for calculating prayer times</p>

                    <div className="setting-row">
                        <div className="setting-info">
                            <span className="setting-label">Calculation Method</span>
                        </div>
                        <select
                            className="setting-select"
                            value={settings.calculationMethod}
                            onChange={(e) => updateSetting('calculationMethod', e.target.value)}
                        >
                            {CALCULATION_METHODS.map(method => (
                                <option key={method.id} value={method.id}>{method.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Language */}
                <div className="settings-section card">
                    <h2 className="section-title">🌐 Language</h2>
                    <p className="section-description">Select your preferred language</p>

                    <div className="language-options">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.id}
                                className={`language-option ${settings.language === lang.id ? 'active' : ''}`}
                                onClick={() => updateSetting('language', lang.id)}
                            >
                                {lang.name}
                                {settings.language === lang.id && <span className="active-badge">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location Settings */}
                <div className="settings-section card">
                    <h2 className="section-title">📍 Location</h2>
                    <p className="section-description">Configure location detection</p>

                    <div className="setting-row">
                        <div className="setting-info">
                            <span className="setting-label">Auto-detect Location</span>
                            <span className="setting-hint">Use GPS for prayer times</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.location.autoDetect}
                                onChange={(e) => updateNestedSetting('location', 'autoDetect', e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                {/* About Section */}
                <div className="settings-section card">
                    <h2 className="section-title">ℹ️ About</h2>
                    <div className="about-content">
                        <p><strong>SalatMap</strong></p>
                        <p className="text-secondary">Find nearby mosques and accurate prayer times</p>
                        <p className="version-text">Version 1.0.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsView;
