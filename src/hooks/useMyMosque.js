import { useState, useEffect } from 'react';

/**
 * Custom hook for managing "My Mosque" feature
 * Stores the selected mosque ID in localStorage and provides methods to manage it
 */
export function useMyMosque() {
    const [myMosqueId, setMyMosqueId] = useState(() => {
        return localStorage.getItem('myMosqueId') || null;
    });

    useEffect(() => {
        if (myMosqueId) {
            localStorage.setItem('myMosqueId', myMosqueId);
        } else {
            localStorage.removeItem('myMosqueId');
        }
    }, [myMosqueId]);

    const setMyMosque = (mosqueId) => {
        setMyMosqueId(mosqueId);
    };

    const clearMyMosque = () => {
        setMyMosqueId(null);
    };

    const isMyMosque = (mosqueId) => {
        return myMosqueId === mosqueId;
    };

    return {
        myMosqueId,
        setMyMosque,
        clearMyMosque,
        isMyMosque
    };
}

/**
 * Get notification settings from localStorage
 */
export function getNotificationSettings() {
    const settings = localStorage.getItem('notificationSettings');
    if (settings) {
        return JSON.parse(settings);
    }
    return {
        enabled: false,
        reminderMinutes: 5
    };
}

/**
 * Save notification settings to localStorage
 */
export function saveNotificationSettings(settings) {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

/**
 * Show a notification
 */
export function showNotification(title, body, icon = '/logo.png') {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon,
            badge: icon,
            vibrate: [200, 100, 200]
        });
    }
}

export default useMyMosque;
