# Import Mosque Data to Google Sheets

## Quick Start (3 Steps)

### Step 1: Open the CSV File
The file `mosques_data.csv` has been created in your project folder with all 42 mosques.

### Step 2: Create & Import to Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **Blank** to create a new spreadsheet
3. Name it: **"SalatMap Mosques Database"**
4. Go to **File → Import**
5. Click **Upload** tab
6. Select the `mosques_data.csv` file from your computer
7. Choose these settings:
   - Import location: **Replace spreadsheet**
   - Separator type: **Comma**
   - Convert text to numbers, dates: **Yes**
8. Click **Import data**

### Step 3: Publish & Connect

1. In Google Sheets, go to **File → Share → Publish to web**
2. Choose:
   - **Entire document** (or select the specific sheet)
   - Format: **Comma-separated values (.csv)**
3. Click **Publish**
4. **Copy the URL** (it looks like: `https://docs.google.com/spreadsheets/d/e/2PACX-1vS...`)
5. Open `src/utils/googleSheets.js` in your code
6. Replace this line:
   ```javascript
   const GOOGLE_SHEETS_URL = 'YOUR_PUBLISHED_SHEET_URL_HERE';
   ```
   With:
   ```javascript
   const GOOGLE_SHEETS_URL = 'your-copied-url-here';
   ```
7. Save the file and refresh your app!

## ✨ You're Done!

Now you can:
- ✅ Edit mosque data directly in Google Sheets
- ✅ Add new mosques easily
- ✅ Update prayer times anytime
- ✅ Share editing access with team members

The app will fetch fresh data from your Google Sheet every time it loads!

## Quick Reference: Column Structure

| Column | Description | Example |
|--------|-------------|---------|
| id | Unique number | 1 |
| name | Mosque name | Jami Masjid Fatima Al-Zahra |
| address | Full address | Plot CC 73, Phase 1, DHA |
| latitude | GPS coordinate | 24.8370363 |
| longitude | GPS coordinate | 67.0814479 |
| fajr | Prayer time (HH:MM) | 06:20 |
| dhuhr | Prayer time (HH:MM) | 01:45 |
| asr | Prayer time (HH:MM) | 04:30 |
| maghrib | Prayer time (HH:MM) | 06:15 |
| isha | Prayer time (HH:MM) | 07:30 |
| jumuah | Friday prayer time | 01:30 |
| capacity | Number of people | 500 |
| facilities | Separated by \| | Wudu Area\|Parking\|AC |
