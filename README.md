# 📍 My Places Map

A small browser-based project for exploring favorite places on an interactive Google Map. It loads each place’s coordinates and description from `places.json`, adds a marker to the map, and shows a place card when you click that marker.

## ✨ Features

- 🗺️ Displays places using the Google Maps JavaScript API.
- 📌 Adds a map marker for every place in `places.json`.
- 💬 Shows the place name and description when a marker is selected.
- 🧭 Includes example locations in Pakistan and a few destinations abroad.

## 🚀 Get started

### 1. Set up a Google Maps API key

In Google Cloud, enable the **Maps JavaScript API** and create an API key. Restrict the key to the Maps JavaScript API and, when possible, to the websites where you will run this project.

Create a `config.js` file in the project folder and add your key:

```js
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";
```

`config.js` is excluded from Git, so your local key will not be included in commits. Keep the key restricted; a key used in a browser is visible to visitors.

### 2. Start the website

**With Live Server in VS Code:**

1. Install the **Live Server** extension by Ritwick Dey.
2. Open the project folder in VS Code.
3. Right-click `index.html` in the Explorer and choose **Open with Live Server**. You can also click **Go Live** in the status bar.

**Or with Python:**

Open a terminal in the project folder and run:

```sh
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

> 💡 Use a local web server (Live Server or Python) rather than opening `index.html` directly. The app fetches `places.json`, which browsers may block when loaded from a local file.

## 📝 Add your own places

Edit `places.json`. Each place needs a name, latitude, longitude, and description:

```json
{
  "name": "Lahore",
  "lat": 31.5204,
  "lng": 74.3587,
  "description": "My city"
}
```

Add each new place as an object in the JSON array, separating entries with commas. Use valid latitude and longitude coordinates for the locations you want to show.

## 🧰 Project files

- `index.html` — page structure and script/style links.
- `style.css` — map and place-card appearance.
- `script.js` — loads Google Maps and creates markers and info cards.
- `places.json` — place names, coordinates, and descriptions.
- `config.js` — your local Google Maps API key (not tracked by Git).
