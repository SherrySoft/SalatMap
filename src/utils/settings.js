/**
 * Get app settings from localStorage
 */
export function getSettings() {
    const settings = localStorage.getItem('appSettings');
    if (settings) {
        return JSON.parse(settings);
    }
    return {
        theme: 'light',
        language: 'en',
        calculationMethod: 'MWL',
        notifications: {
            enabled: false,
            reminderMinutes: 5
        },
        alarms: {
            enabled: false,
            fajr: true,
            dhuhr: true,
            asr: true,
            maghrib: true,
            isha: true
        },
        location: {
            autoDetect: true,
            manualLat: null,
            manualLon: null
        }
    };
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings) {
    localStorage.setItem('appSettings', JSON.stringify(settings));
}

/**
 * Calculation method options for prayer times
 */
export const CALCULATION_METHODS = [
    { id: 'MWL', name: 'Muslim World League' },
    { id: 'ISNA', name: 'Islamic Society of North America' },
    { id: 'Egypt', name: 'Egyptian General Authority' },
    { id: 'Makkah', name: 'Umm Al-Qura, Makkah' },
    { id: 'Karachi', name: 'University of Islamic Sciences, Karachi' },
    { id: 'Tehran', name: 'Institute of Geophysics, Tehran' }
];

/**
 * Language options
 */
export const LANGUAGES = [
    { id: 'en', name: 'English' },
    { id: 'ur', name: 'اردو (Urdu)' }
];

/**
 * Reminder timing options in minutes
 */
export const REMINDER_OPTIONS = [
    { value: 2, label: '2 minutes before' },
    { value: 5, label: '5 minutes before' },
    { value: 10, label: '10 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' }
];
