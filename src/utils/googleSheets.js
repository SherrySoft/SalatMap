/**
 * Google Sheets Integration
 * 
 * HOW TO SET UP:
 * 1. Create a Google Sheet with mosque data
 * 2. Columns should be: id, name, address, latitude, longitude, fajr, dhuhr, asr, sunset, isha, jumuah, capacity, facilities
 * 3. Go to File > Share > Publish to web
 * 4. Choose "Comma-separated values (.csv)" and publish
 * 5. Copy the published URL and paste it below
 */

// Replace this URL with your published Google Sheets CSV URL
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRn1kBQld2EbAP10UwcFHQq4Nifhq8nOeUskOBRr2yHMkvSAnUlRhwo38KMu8m3Q7gXyQTjLh_udDJm/pub?output=csv';

/**
 * Parses CSV text into mosque objects
 */
function parseCSVToMosques(csvText) {
    const lines = csvText.split('\n');
    // We expect headers but we'll rely on index-based parsing with smart detection

    const mosques = [];
    let globalSunset = '';
    let globalLastUpdated = '';

    // First pass: Try to find the global sunset time and last updated date from the first data row
    if (lines.length > 1) {
        const firstRowValues = parseCSVLine(lines[1].trim());
        // In standard layout, Sunset is at index 8, Date is at index 13
        if (firstRowValues.length >= 9) {
            globalSunset = firstRowValues[8];
        }
        if (firstRowValues.length >= 14) {
            globalLastUpdated = firstRowValues[13];
        }
    }

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = parseCSVLine(line);

        // Detect column layout based on where the Capacity (number) is
        // Standard Layout (13 cols): ... 8:Sunset, 9:Isha, 10:Jumuah, 11:Capacity, 12:Facilities
        // Shifted Layout (12 cols): ... 8:Isha, 9:Jumuah, 10:Capacity, 11:Facilities

        let isShifted = false;

        // Check index 11 (Standard Capacity slot)
        const val11 = values[11] || '';
        const val10 = values[10] || '';

        // Simple heuristic: Capacity is usually a pure number (e.g. "500"), Time has ":" (e.g. "1:30")
        const looksLikeCapacity = (val) => /^\d+$/.test(val) && parseInt(val) > 50;
        const looksLikeTime = (val) => val && val.includes(':');

        if (looksLikeCapacity(val10) && !looksLikeCapacity(val11)) {
            isShifted = true;
        }

        let jamatTimes = {};
        let capacity = 500;
        let facilities = ['Wudu Area'];
        let lastUpdated = '';

        if (isShifted) {
            // Shifted mapping (Missing Sunset column)
            jamatTimes = {
                fajr: values[5] || '',
                dhuhr: values[6] || '',
                asr: values[7] || '',
                sunset: globalSunset, // Use global sunset
                isha: values[8] || '',
                jumuah: values[9] || ''
            };
            capacity = parseInt(values[10]) || 500;
            facilities = values[11] ? values[11].split('|').map(f => f.trim()) : ['Wudu Area'];
            lastUpdated = values[12] || globalLastUpdated || '';
        } else {
            // Standard mapping
            jamatTimes = {
                fajr: values[5] || '',
                dhuhr: values[6] || '',
                asr: values[7] || '',
                sunset: globalSunset || values[8] || '', // Prefer global, fallback to row value
                isha: values[9] || '',
                jumuah: values[10] || ''
            };
            capacity = parseInt(values[11]) || 500;
            facilities = values[12] ? values[12].split('|').map(f => f.trim()) : ['Wudu Area'];
            lastUpdated = values[13] || globalLastUpdated || '';
        }

        const mosque = {
            id: parseInt(values[0]) || i,
            name: values[1] || '',
            address: values[2] || '',
            latitude: parseFloat(values[3]) || 0,
            longitude: parseFloat(values[4]) || 0,
            jamatTimes: jamatTimes,
            capacity: capacity,
            facilities: facilities,
            lastUpdated: lastUpdated
        };

        mosques.push(mosque);
    }

    return mosques;
}

/**
 * Parses a single CSV line, handling quoted values
 */
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    values.push(current.trim());
    return values;
}

/**
 * Fetches mosque data from Google Sheets
 */
export async function fetchMosquesFromSheets() {
    try {
        // Check if URL is configured
        if (GOOGLE_SHEETS_URL === 'YOUR_PUBLISHED_SHEET_URL_HERE') {
            console.warn('Google Sheets URL not configured. Using local data.');
            return null;
        }

        const response = await fetch(GOOGLE_SHEETS_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const csvText = await response.text();
        const mosques = parseCSVToMosques(csvText);

        console.log(`Successfully loaded ${mosques.length} mosques from Google Sheets`);
        return mosques;

    } catch (error) {
        console.error('Error fetching from Google Sheets:', error);
        return null;
    }
}

/**
 * Check if Google Sheets is configured
 */
export function isGoogleSheetsConfigured() {
    return GOOGLE_SHEETS_URL !== 'YOUR_PUBLISHED_SHEET_URL_HERE';
}
