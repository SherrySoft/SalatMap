# Google Sheets Integration Setup

This guide will help you connect your mosque data to Google Sheets for easy editing.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "SalatMap Mosques Database"

## Step 2: Set Up the Column Structure

Your sheet should have the following columns (in this exact order):

| Column | Header | Example |
|--------|--------|---------|
| A | id | 1 |
| B | name | Jami Masjid Fatima Al-Zahra |
| C | address | Plot CC 73, Phase 1, DHA, Karachi |
| D | latitude | 24.8370363 |
| E | longitude | 67.0814479 |
| F | fajr | 06:20 |
| G | dhuhr | 01:45 |
| H | asr | 04:30 |
| I | maghrib | 06:15 |
| J | isha | 07:30 |
| K | jumuah | 01:30 |
| L | capacity | 500 |
| M | facilities | Wudu Area\|Parking\|AC |

### Notes:
- **id**: Unique number for each mosque
- **Prayer times**: Use 24-hour format (HH:MM)
- **facilities**: Separate multiple facilities with `|` (pipe symbol)
- **latitude/longitude**: Get from Google Maps (right-click > What's here?)

## Step 3: Import Existing Data

You can copy the data from `src/data/mosques.json` and convert it to this format, or I can create a CSV template for you.

## Step 4: Publish Your Sheet

1. In your Google Sheet, click **File → Share → Publish to web**
2. In the dialog:
   - Choose the sheet you want to publish
   - Select **Comma-separated values (.csv)** from the dropdown
   - Click **Publish**
3. **Copy the published URL** (it will look like: `https://docs.google.com/spreadsheets/d/e/...`)

## Step 5: Configure the App

1. Open `src/utils/googleSheets.js`
2. Find this line:
   ```javascript
   const GOOGLE_SHEETS_URL = 'YOUR_PUBLISHED_SHEET_URL_HERE';
   ```
3. Replace `'YOUR_PUBLISHED_SHEET_URL_HERE'` with your published URL:
   ```javascript
   const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS...';
   ```
4. Save the file

## Step 6: Test

1. Restart your dev server: `npm run dev`
2. Check the browser console - you should see:
   - "Fetching mosque data from Google Sheets..."
   - "Successfully loaded X mosques from Google Sheets"
3. If you see any errors, check:
   - The URL is correct
   - The sheet is published
   - The columns match the required format

## Benefits

✅ **Easy Updates**: Edit mosque data directly in Google Sheets
✅ **No Code Changes**: Updates appear immediately after refresh
✅ **Collaboration**: Share the sheet with team members
✅ **Backup**: Your data is safely stored in Google Drive
✅ **Version History**: Google Sheets tracks all changes

## Fallback

If the Google Sheets URL is not configured or fails to load, the app will automatically use the local `mosques.json` file as a fallback.

## Need Help?

If you encounter any issues, check the browser console for error messages.
