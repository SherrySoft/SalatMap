import * as adhan from 'adhan';

/**
 * Get prayer times for a given location and date
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {Date} date 
 * @returns {Object} Prayer times object
 */
export function getPrayerTimes(latitude, longitude, date = new Date()) {
    const coordinates = new adhan.Coordinates(latitude, longitude);
    const params = adhan.CalculationMethod.Karachi(); // Using Karachi method for Pakistan
    const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

    return {
        fajr: prayerTimes.fajr,
        sunrise: prayerTimes.sunrise,
        dhuhr: prayerTimes.dhuhr,
        asr: prayerTimes.asr,
        sunset: prayerTimes.maghrib,
        isha: prayerTimes.isha,
        latitude, // Store coordinates for later use
        longitude,
    };
}

/**
 * Get the next prayer time and its name
 * @param {Object} prayerTimes - Prayer times object
 * @param {number} latitude - User latitude
 * @param {number} longitude - User longitude
 * @returns {Object} Next prayer info { name, time, timeRemaining }
 */
export function getNextPrayer(prayerTimes, latitude, longitude) {
    const now = new Date();
    const prayers = [
        { name: 'Fajr', time: prayerTimes.fajr },
        { name: 'Sunrise', time: prayerTimes.sunrise },
        { name: 'Dhuhr', time: prayerTimes.dhuhr },
        { name: 'Asr', time: prayerTimes.asr },
        { name: 'Sunset', time: prayerTimes.sunset },
        { name: 'Isha', time: prayerTimes.isha },
    ];

    // Find the next prayer
    for (const prayer of prayers) {
        if (prayer.time > now) {
            const timeRemaining = prayer.time - now;
            return {
                name: prayer.name,
                time: prayer.time,
                timeRemaining,
            };
        }
    }

    // If no prayer found today, return tomorrow's Fajr
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Reset to midnight

    const tomorrowPrayers = getPrayerTimes(latitude, longitude, tomorrow);

    return {
        name: 'Fajr',
        time: tomorrowPrayers.fajr,
        timeRemaining: tomorrowPrayers.fajr - now,
    };
}

/**
 * Format time remaining as string
 * @param {number} milliseconds 
 * @returns {string} Formatted time string
 */
export function formatTimeRemaining(milliseconds) {
    if (!milliseconds || isNaN(milliseconds)) {
        return '0s';
    }

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Format time as 12-hour format
 * @param {Date} date 
 * @returns {string} Formatted time string
 */
export function formatTime(date) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return '--:--';
    }

    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
