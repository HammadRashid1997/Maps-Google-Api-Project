# 📍 My Places Map

I built this project to create a simple personal map of the places that matter to me, whether they are favorite cities, memorable travel spots, or places I want to revisit. It is a practical way to visualize locations in a clean and interactive format while learning how to work with the Google Maps API in a real browser app.

This project uses the Google Maps JavaScript API to render an interactive map and display markers for different places stored in a local JSON file. Each marker opens a custom info window showing the place name and description.

## Overview

This project demonstrates how to:

- load the Google Maps JavaScript API in the browser
- keep the API key outside version control
- fetch location data from a local JSON file
- add markers for each location on the map
- open an info window when a marker is clicked
- render a clean map interface with custom location cards

## Features

- Interactive Google Map centered on Pakistan by default
- Marker for each place defined in `places.json`
- Custom info window card with a location icon, title, and description
- Simple styling for an easy-to-read map layout
- Works through a local web server so JSON files can be fetched safely in the browser
- Compatible with Playwright for browser-based testing and previewing

## Project structure

- `index.html` — page layout and script loading
- `style.css` — map and info card styling
- `script.js` — initializes the map, fetches `places.json`, and creates markers
- `places.json` — list of mapped locations and coordinates
- `config.js` — local Google Maps API key (ignored by Git)
- `.gitignore` — excludes `config.js` from version control

## Getting started

### 1. Create a Google Maps API key

In the Google Cloud Console:

1. Enable the Maps JavaScript API.
2. Create an API key.
3. Restrict the key to the Maps JavaScript API if possible.

Create a `config.js` file in the project root with the following content:

```js
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";
```

This file is intentionally excluded from Git via `.gitignore`, so your key stays local and private.

### 2. Run the app locally

Start a local web server:

```bash
python3 -m http.server 8000
```

Then open the app in your browser:

```text
http://localhost:8000
```

If you want to preview or test it with Playwright, use:

```bash
npx playwright install --with-deps chromium
npx playwright open http://localhost:8000
```

This is especially useful for checking the page visually or automating browser interactions.

> Note: Opening the page directly from the filesystem can block `fetch("places.json")` in the browser, so a local web server is recommended.

## Adding your own places

Edit `places.json` and add entries in this format:

```json
{
  "name": "Lahore",
  "lat": 31.5204,
  "lng": 74.3587,
  "description": "My city"
}
```

Each item requires:

- `name`: label shown on the map
- `lat`: latitude value
- `lng`: longitude value
- `description`: text displayed in the marker info window

## How it works

The app follows this flow in `script.js`:

1. Creates a Google Map with a starting center and zoom level.
2. Loads the Google Maps API script with the key from `config.js`.
3. Fetches `places.json` from the project root.
4. Loops through each place and creates a Google Maps marker.
5. Adds a click listener to open a custom `InfoWindow` for the selected location.

## Notes

- Keep the API key restricted in production or shared environments.
- Use valid latitude and longitude values for every location.
- This project is a simple map-based personal places viewer built around the Google Maps API.
