import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, LANGUAGES, REMINDER_OPTIONS } from '../utils/settings';
import { requestNotificationPermission } from '../hooks/useMyMosque';
import { useLanguage } from '../context/LanguageContext';
import './SettingsView.css';

function SettingsView() {
    const { language, setLanguage, t } = useLanguage();
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

    const handleLanguageChange = (langId) => {
        setLanguage(langId);
        updateSetting('language', langId);
    };

    return (
        <div className="settings-view">
            <div className="settings-content">
                <h1 className="settings-title">⚙️ {t('settings')}</h1>

                {/* Theme Settings */}
                <div className="settings-section card">
                    <h2 className="section-title">🎨 {t('appearance')}</h2>
                    <p className="section-description">{t('chooseTheme')}</p>

                    <div className="theme-options">
                        <button
                            className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
                            onClick={() => updateSetting('theme', 'light')}
                        >
                            <div className="theme-preview light-preview">
                                <div className="preview-header"></div>
                                <div className="preview-content"></div>
                            </div>
                            <span className="theme-label">☀️ {t('lightMode')}</span>
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
                            <span className="theme-label">🌙 {t('darkMode')}</span>
                            {settings.theme === 'dark' && <span className="active-badge">✓</span>}
                        </button>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="settings-section card">
                    <h2 className="section-title">🔔 {t('notifications')}</h2>
                    <p className="section-description">{t('forYourMosque')}</p>

                    <div className="setting-row">
                        <div className="setting-info">
                            <span className="setting-label">{t('prayerReminders')}</span>
                            <span className="setting-hint">{t('forYourMosque')}</span>
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
                                <span className="setting-label">{t('reminderTime')}</span>
                                <span className="setting-hint">{t('howEarly')}</span>
                            </div>
                            <select
                                className="setting-select"
                                value={settings.notifications.reminderMinutes}
                                onChange={(e) => updateNestedSetting('notifications', 'reminderMinutes', parseInt(e.target.value))}
                            >
                                {REMINDER_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.value} {t('minBefore')}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Language */}
                <div className="settings-section card">
                    <h2 className="section-title">🌐 {t('language')}</h2>
                    <p className="section-description">{t('selectLanguage')}</p>

                    <div className="language-options">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.id}
                                className={`language-option ${language === lang.id ? 'active' : ''}`}
                                onClick={() => handleLanguageChange(lang.id)}
                            >
                                {lang.name}
                                {language === lang.id && <span className="active-badge">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location Settings */}
                <div className="settings-section card">
                    <h2 className="section-title">📍 {t('location')}</h2>
                    <p className="section-description">{t('configureLocation')}</p>

                    <div className="setting-row">
                        <div className="setting-info">
                            <span className="setting-label">{t('autoDetect')}</span>
                            <span className="setting-hint">{t('useGps')}</span>
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
                    <h2 className="section-title">ℹ️ {t('about')}</h2>
                    <div className="about-content">
                        <p><strong>SalatMap</strong></p>
                        <p className="text-secondary">{t('findMosques')}</p>
                        <p className="version-text">{t('version')} 1.0.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsView;
