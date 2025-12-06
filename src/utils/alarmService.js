import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

/**
 * Prayer Alarm Service
 * Handles scheduling and managing prayer time alarms with Adhan sound
 */

// Prayer IDs for notifications (must be unique integers)
const PRAYER_IDS = {
    fajr: 1,
    dhuhr: 2,
    asr: 3,
    maghrib: 4,
    isha: 5
};

/**
 * Request notification permissions
 */
export async function requestAlarmPermission() {
    if (!Capacitor.isNativePlatform()) {
        // For web, use browser notifications
        if ('Notification' in window) {
            const result = await Notification.requestPermission();
            return result === 'granted';
        }
        return false;
    }

    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
}

/**
 * Check if we have notification permissions
 */
export async function checkAlarmPermission() {
    if (!Capacitor.isNativePlatform()) {
        return Notification.permission === 'granted';
    }

    const result = await LocalNotifications.checkPermissions();
    return result.display === 'granted';
}

/**
 * Schedule an alarm for a specific prayer
 * @param {string} prayer - Prayer name (fajr, dhuhr, asr, maghrib, isha)
 * @param {Date} time - The time to schedule the alarm
 * @param {string} mosqueName - Name of the mosque for notification text
 */
export async function scheduleAlarm(prayer, time, mosqueName = 'your mosque') {
    const prayerId = PRAYER_IDS[prayer.toLowerCase()];
    if (!prayerId) {
        console.error('Invalid prayer name:', prayer);
        return false;
    }

    // Don't schedule if time is in the past
    if (time < new Date()) {
        // Schedule for tomorrow
        time.setDate(time.getDate() + 1);
    }

    const prayerCapitalized = prayer.charAt(0).toUpperCase() + prayer.slice(1);

    try {
        if (!Capacitor.isNativePlatform()) {
            // For web, we can only show immediate notifications or use service workers
            console.log(`Web: Would schedule ${prayer} alarm for ${time}`);
            return true;
        }

        await LocalNotifications.schedule({
            notifications: [
                {
                    id: prayerId,
                    title: `${prayerCapitalized} Prayer Time`,
                    body: `It's time for ${prayerCapitalized} prayer at ${mosqueName}`,
                    schedule: { at: time },
                    sound: 'adhan.wav',
                    smallIcon: 'ic_stat_mosque',
                    largeIcon: 'ic_launcher',
                    channelId: 'prayer-alarms',
                    ongoing: false,
                    autoCancel: true
                }
            ]
        });

        console.log(`Scheduled ${prayer} alarm for ${time}`);
        return true;
    } catch (error) {
        console.error(`Failed to schedule ${prayer} alarm:`, error);
        return false;
    }
}

/**
 * Cancel alarm for a specific prayer
 */
export async function cancelAlarm(prayer) {
    const prayerId = PRAYER_IDS[prayer.toLowerCase()];
    if (!prayerId) return;

    try {
        if (Capacitor.isNativePlatform()) {
            await LocalNotifications.cancel({ notifications: [{ id: prayerId }] });
        }
        console.log(`Cancelled ${prayer} alarm`);
    } catch (error) {
        console.error(`Failed to cancel ${prayer} alarm:`, error);
    }
}

/**
 * Cancel all prayer alarms
 */
export async function cancelAllAlarms() {
    try {
        if (Capacitor.isNativePlatform()) {
            const pending = await LocalNotifications.getPending();
            if (pending.notifications.length > 0) {
                await LocalNotifications.cancel({ notifications: pending.notifications });
            }
        }
        console.log('Cancelled all alarms');
    } catch (error) {
        console.error('Failed to cancel alarms:', error);
    }
}

/**
 * Schedule all enabled alarms based on mosque jamat times
 * @param {object} mosque - Mosque object with jamatTimes
 * @param {object} enabledAlarms - Object with prayer names as keys and boolean enabled state
 */
export async function scheduleAllAlarms(mosque, enabledAlarms) {
    if (!mosque || !mosque.jamatTimes) {
        console.log('No mosque data for scheduling alarms');
        return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Parse time string to Date object
    const parseTime = (timeStr) => {
        if (!timeStr) return null;

        let hours, minutes;
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (match) {
            hours = parseInt(match[1]);
            minutes = parseInt(match[2]);
            const period = match[3] ? match[3].toUpperCase() : null;

            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
        } else {
            return null;
        }

        const date = new Date(today);
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    for (const prayer of prayers) {
        if (enabledAlarms[prayer]) {
            // For maghrib, we use sunset time
            const timeStr = prayer === 'maghrib'
                ? mosque.jamatTimes.sunset
                : mosque.jamatTimes[prayer];

            const alarmTime = parseTime(timeStr);
            if (alarmTime) {
                await scheduleAlarm(prayer, alarmTime, mosque.name);
            }
        } else {
            await cancelAlarm(prayer);
        }
    }
}

/**
 * Create notification channel for Android (required for Android 8+)
 */
export async function createNotificationChannel() {
    if (!Capacitor.isNativePlatform()) return;

    try {
        await LocalNotifications.createChannel({
            id: 'prayer-alarms',
            name: 'Prayer Alarms',
            description: 'Notifications for prayer times with Adhan',
            importance: 5, // Max importance
            visibility: 1, // Public
            sound: 'adhan.wav',
            vibration: true,
            lights: true
        });
        console.log('Created prayer-alarms notification channel');
    } catch (error) {
        console.error('Failed to create notification channel:', error);
    }
}

export default {
    requestAlarmPermission,
    checkAlarmPermission,
    scheduleAlarm,
    cancelAlarm,
    cancelAllAlarms,
    scheduleAllAlarms,
    createNotificationChannel
};
