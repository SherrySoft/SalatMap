# How to Get Exact Mosque Coordinates (FREE!)

This guide uses **OpenStreetMap Nominatim** - completely FREE, no API key, no payment required!

## ✅ No Setup Needed!

Unlike Google Maps, OpenStreetMap requires:
- ❌ NO API key
- ❌ NO billing account
- ❌ NO payment method
- ✅ Just run the script!

## Step 1: Run the Script

Open your terminal and run:

```bash
node update-coordinates.js
```

**What it does:**
- Searches OpenStreetMap for each of your 42 mosques
- Fetches exact GPS coordinates
- Updates `mosques.json` automatically
- Waits 1.2 seconds between requests (OpenStreetMap requirement)

**Expected output:**
```
🗺️  Using OpenStreetMap Nominatim (Free & No API Key Required)

🕌 Found 42 mosques to update

⏱️  This will take about 1 minutes (1 sec delay per mosque)

[1/42] Processing: Jamia Masjid Fatima-tuz-Zahra
Searching: Jamia Masjid Fatima-tuz-Zahra...
✅ Found: 24.8389123, 67.0612456
   Display: Jamia Masjid Fatima-tuz-Zahra, DHA Phase 1, Karachi, Sindh, Pakistan
⏳ Waiting 1.2 seconds...

[2/42] Processing: Masjid Mustafa
...

✅ COMPLETE!
📊 Updated: 42 mosques
⚠️ Skipped: 0 mosques
💾 Saved to: mosques.json

🎉 Your mosques now have exact coordinates!
```

## Step 2: Verify

After running the script:
1. Refresh your app in the browser (http://localhost:5173)
2. Distances should now be accurate!
3. Mosques sorted by actual distance from your location

## Important Notes

- ✅ **Completely FREE**: No costs, no limits for reasonable use
- ✅ **No API key needed**: Just run the script
- ⏱️ **Takes ~1 minute**: 1.2 second delay between requests (required by OpenStreetMap)
- 🔄 **Run once**: After getting coordinates, you don't need to run again
- 📍 **Accuracy**: Very good, sometimes even better than Google for local areas

## Troubleshooting

**"Not found on OpenStreetMap"**
- Some mosques might not be in OpenStreetMap database
- Script will keep existing coordinates for those
- You can manually add them later

**Rate limit errors**
- The script already has proper delay (1.2 seconds)
- If you still get errors, increase delay in the script

**Network errors**
- Check your internet connection
- Try running the script again

## If Some Mosques Are Not Found

If OpenStreetMap doesn't have data for some mosques, you can:

### Option 1: Search Google Maps Manually
1. Open Google Maps
2. Search for the mosque
3. Right-click on the location
4. Copy the coordinates (format: `24.8389, 67.0612`)
5. Manually update in `mosques.json`

### Option 2: Try Different Search Terms
You can modify the script to try different variations:
- Just the mosque name
- Mosque name + "DHA Karachi"
- Mosque name + phase number

---

## After Getting Exact Coordinates

Once you have exact coordinates:
- ✅ Delete this script (one-time use)
- ✅ Your app works perfectly with exact coordinates
- ✅ No ongoing API calls or costs
- ✅ Distance calculations remain FREE using Haversine formula

## Why OpenStreetMap Instead of Google?

| Feature | OpenStreetMap | Google Maps |
|---------|---------------|-------------|
| Cost | FREE | Requires billing |
| API Key | Not needed | Required |
| Payment | None | Credit card needed |
| Accuracy | Very good | Excellent |
| Local data | Often better | Global coverage |

**For your use case (42 mosques in DHA Karachi), OpenStreetMap is perfect!** 🎯
