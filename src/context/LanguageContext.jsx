import React, { createContext, useContext, useState, useEffect } from 'react';

// Translations
const translations = {
    en: {
        // Settings
        settings: 'Settings',
        appearance: 'Appearance',
        chooseTheme: 'Choose your preferred theme',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        notifications: 'Notifications',
        prayerReminders: 'Prayer Reminders',
        forYourMosque: 'For your saved mosque',
        reminderTime: 'Reminder Time',
        howEarly: 'How early to notify',
        language: 'Language',
        selectLanguage: 'Select your preferred language',
        location: 'Location',
        configureLocation: 'Configure location detection',
        autoDetect: 'Auto-detect Location',
        useGps: 'Use GPS for prayer times',
        about: 'About',
        version: 'Version',
        findMosques: 'Find nearby mosques and accurate prayer times',

        // Map
        searchMosques: 'Search mosques...',
        noMosquesFound: 'No mosques found',
        yourLocation: 'Your Location',
        youAreHere: 'You are here',
        viewPrayerTimes: 'View Prayer Times',
        zoomTip: 'Pinch or use +/- to zoom',

        // Mosque Detail
        nextJamat: 'Next Jamat',
        jamatTimes: 'Jamat Times',
        facilities: 'Facilities',
        lastUpdated: 'Last Updated',
        setAsMyMosque: 'Set as My Mosque',
        myMosque: 'My Mosque',
        getDirections: 'Get Directions',
        reportTiming: 'Report Incorrect Timing',
        startsIn: 'Starts in',
        away: 'away',

        // Home
        findNearbyMosques: 'Find Nearby Mosques',

        // Reminder options
        minBefore: 'minutes before'
    },
    ur: {
        // Settings
        settings: 'ترتیبات',
        appearance: 'ظاہری شکل',
        chooseTheme: 'اپنی پسندیدہ تھیم منتخب کریں',
        lightMode: 'لائٹ موڈ',
        darkMode: 'ڈارک موڈ',
        notifications: 'اطلاعات',
        prayerReminders: 'نماز کی یاد دہانی',
        forYourMosque: 'آپ کی محفوظ مسجد کے لیے',
        reminderTime: 'یاد دہانی کا وقت',
        howEarly: 'کتنی جلدی مطلع کریں',
        language: 'زبان',
        selectLanguage: 'اپنی پسندیدہ زبان منتخب کریں',
        location: 'مقام',
        configureLocation: 'مقام کی ترتیب',
        autoDetect: 'خودکار مقام',
        useGps: 'نماز کے اوقات کے لیے GPS استعمال کریں',
        about: 'معلومات',
        version: 'ورژن',
        findMosques: 'قریبی مساجد اور درست نماز کے اوقات تلاش کریں',

        // Map
        searchMosques: 'مسجد تلاش کریں...',
        noMosquesFound: 'کوئی مسجد نہیں ملی',
        yourLocation: 'آپ کا مقام',
        youAreHere: 'آپ یہاں ہیں',
        viewPrayerTimes: 'نماز کے اوقات دیکھیں',
        zoomTip: 'زوم کے لیے +/- استعمال کریں',

        // Mosque Detail
        nextJamat: 'اگلی جماعت',
        jamatTimes: 'جماعت کے اوقات',
        facilities: 'سہولیات',
        lastUpdated: 'آخری تازہ کاری',
        setAsMyMosque: 'میری مسجد مقرر کریں',
        myMosque: 'میری مسجد',
        getDirections: 'راستہ حاصل کریں',
        reportTiming: 'غلط وقت کی اطلاع دیں',
        startsIn: 'شروع ہونے میں',
        away: 'دور',

        // Home
        findNearbyMosques: 'قریبی مساجد تلاش کریں',

        // Reminder options
        minBefore: 'منٹ پہلے'
    }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        const settings = localStorage.getItem('appSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            return parsed.language || 'en';
        }
        return 'en';
    });

    useEffect(() => {
        // Update direction for RTL languages
        document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const t = (key) => {
        return translations[language][key] || translations.en[key] || key;
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
        // Also update in settings
        const settings = localStorage.getItem('appSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            parsed.language = lang;
            localStorage.setItem('appSettings', JSON.stringify(parsed));
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export default LanguageContext;
