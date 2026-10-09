# 📍 My Places Map

A lightweight browser app that renders a Google Map and plots a collection of favorite locations from a JSON file. Each marker opens a custom info window with the location name and description.

## Overview

This project demonstrates how to:

- load the Google Maps JavaScript API in the browser
- fetch place data from a local JSON file
- add markers for each location
- open an info window when a marker is clicked
- keep the API key outside of version control

## Features

- Interactive map centered on Pakistan by default
- Marker for each place defined in `places.json`
- Custom info window card with icon, title, and description
- Simple styling for a clean map and location cards
- Works through a local web server for browser-safe JSON loading

## Project structure

- `index.html` — page layout and script loading
- `style.css` — map and info card styling
- `script.js` — initializes the map, fetches `places.json`, and creates markers
- `places.json` — list of mapped locations and coordinates
- `config.js` — local Google Maps API key (ignored by Git)

## Getting started

### 1. Create a Google Maps API key

In Google Cloud Console:

1. Enable the Maps JavaScript API.
2. Create an API key.
3. Restrict the key to the Maps JavaScript API and only trusted website origins if possible.

Create a `config.js` file in the root of the project with the following content:

```js
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";
```

This file is intentionally excluded from Git via `.gitignore`, so your key stays local.

### 2. Run the app locally

Use any local static server. For example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also use VS Code's Live Server extension if preferred.

> Note: Opening the page directly from the filesystem may block `fetch("places.json")` in the browser, so a local web server is recommended.

## Adding your own places

Edit `places.json` and add objects in this format:

```json
{
  "name": "Lahore",
  "lat": 31.5204,
  "lng": 74.3587,
  "description": "My city"
}
```

Each entry requires:

- `name`: display label
- `lat`: latitude
- `lng`: longitude
- `description`: text shown in the marker info window

## How it works

`script.js` does the following:

1. Initializes a Google map with a default center and zoom.
2. Fetches `places.json` from the project root.
3. Iterates through each location.
4. Creates a Google Maps marker for each place.
5. Opens an `InfoWindow` showing the location's card when clicked.

## Notes

- Keep the API key restricted in production or shared environments.
- Use valid latitude and longitude values for all locations.
- This project is meant as a simple demonstration of a map-based personal places viewer.
