// Populate the start and end place dropdowns with the places from the JSON file
function populatePlaceDropdowns(places) {
    const startSelect = document.getElementById("start-place");
    const endSelect = document.getElementById("end-place");

    places.forEach(place => {
        const startOption = document.createElement("option");
        startOption.value = place.name;
        startOption.textContent = place.name;

        const endOption = document.createElement("option");
        endOption.value = place.name;
        endOption.textContent = place.name;

        startSelect.appendChild(startOption);
        endSelect.appendChild(endOption);
    });
}

// Calculate the distance between two places using the Haversine formula
function calculateDistance(place1, place2) {
    const earthRadius = 6371;

    const toRadians = degrees => degrees * Math.PI / 180;

    const lat1 = toRadians(place1.lat);
    const lat2 = toRadians(place2.lat);

    const latDifference = toRadians(place2.lat - place1.lat);
    const lngDifference = toRadians(place2.lng - place1.lng);

    const a = Math.sin(latDifference / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDifference / 2) ** 2;

    const centralAngle = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1 - a));

    return earthRadius * centralAngle;
}

// Initialize the Google Map and set up event listeners for user interactions
window.initMap = function () {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: {
            lat: 31.5204,
            lng: 74.3587
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: ["roadmap", "satellite"]
        },
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
    });

    const initialMapCenter = map.getCenter();
    const initialZoom = map.getZoom();

    let distanceLine = null;

    const placeMarkers = {};
    const placeInfoWindows = {};

    fetch("places.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load places.json");
            }
            return response.json();
        })

        .then(places => {
            populatePlaceDropdowns(places);

            const calculateButton = document.getElementById("calculate-distance");

            const swapButton = document.getElementById("swap-places");

            swapButton.addEventListener("click", () => {
                const startSelect = document.getElementById("start-place");
                const endSelect = document.getElementById("end-place");

                const currentStart = startSelect.value;

                startSelect.value = endSelect.value;
                endSelect.value = currentStart;
            });

            calculateButton.addEventListener("click", () => {
                const startName = document.getElementById("start-place").value;
                const endName = document.getElementById("end-place").value;

                const result = document.getElementById("distance-result");

                if (!startName || !endName) {
                    result.textContent = "Please select both places.";
                    return;
                }

                if (startName === endName) {
                    result.textContent = "Please select two different places.";
                    return;
                }

                const startPlace = places.find(place => place.name === startName);
                const endPlace = places.find(place => place.name === endName);

                const distance = calculateDistance(startPlace, endPlace);

                if (distanceLine) {
                    distanceLine.setMap(null);
                }

                distanceLine = new google.maps.Polyline({
                    path: [
                        { lat: startPlace.lat, lng: startPlace.lng },
                        { lat: endPlace.lat, lng: endPlace.lng }
                    ],
                    geodesic: true,
                    strokeColor: "#2563eb",
                    strokeOpacity: 0.9,
                    strokeWeight: 6,
                    map: map
                });

                result.textContent = `Distance from ${startName} to ${endName}: ${distance.toFixed(2)} km`;

                const bounds = new google.maps.LatLngBounds();

                bounds.extend({ lat: startPlace.lat, lng: startPlace.lng });
                bounds.extend({ lat: endPlace.lat, lng: endPlace.lng });

                map.fitBounds(bounds);
            });

            return places;
        })
        .then(places => {
            const visitedPlaces = new Set(
                JSON.parse(localStorage.getItem("visitedPlaces") || "[]")
            );

            function saveVisitedPlaces() {
                localStorage.setItem(
                    "visitedPlaces",
                    JSON.stringify([...visitedPlaces])
                );
            }

            function updateTravelProgress(places) {
                const totalPlaces = places.length;
                const visitedCount = places.filter(place =>
                    visitedPlaces.has(place.name)
                ).length;

                const percentage = totalPlaces === 0 ? 0 : Math.round((visitedCount / totalPlaces) * 100);

                document.getElementById("total-places").textContent = totalPlaces;
                document.getElementById("visited-places-count").textContent = visitedCount;
                document.getElementById("exploration-percentage").textContent = `${percentage}%`;

                const progressFill = document.getElementById("progress-fill");
                progressFill.style.width = `${percentage}%`;

                const progressBar = document.getElementById("travel-progress");
                progressBar.setAttribute("aria-valuenow", percentage);
            }

            updateTravelProgress(places);

            function getMarkerIcon(isVisited) {
                return {
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                    fillColor: isVisited ? "#16a34a" : "#2563eb",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 1.5,
                    scale: 1.5,
                    anchor: new google.maps.Point(12, 22)
                };
            }

            places.forEach(place => {

                const marker = new google.maps.Marker({
                    icon: getMarkerIcon(visitedPlaces.has(place.name)),
                    position: {
                        lat: place.lat,
                        lng: place.lng
                    },
                    map: map,
                    title: place.name
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `
        <div class="place-card">
            <div class="place-icon">📍</div>

            <div class="place-content">
                <h3>${place.name}</h3>
                <p>${place.description}</p>

                <button
                    type="button"
                    id="visited-toggle-button"
                    style="
                        margin-top: 10px;
                        padding: 8px 12px;
                        border: none;
                        border-radius: 6px;
                        background: #16a34a;
                        color: white;
                        cursor: pointer;
                    "
                >
                    ${visitedPlaces.has(place.name)
                            ? "Mark as not visited"
                            : "Mark as visited"}
                </button>
            </div>
        </div>
    `
                });

                const filterButtons = document.querySelectorAll(".filter-button");

                let currentPlaceFilter = "all";

                function applyPlaceFilter() {
                    Object.entries(placeMarkers).forEach(([placeName, marker]) => {
                        const isVisited = visitedPlaces.has(placeName);

                        let shouldShow = true;

                        if (currentPlaceFilter === "visited") {
                            shouldShow = isVisited;
                        } else if (currentPlaceFilter === "not-visited") {
                            shouldShow = !isVisited;
                        }

                        marker.setMap(shouldShow ? map : null);

                        if (!shouldShow) {
                            placeInfoWindows[placeName].close();
                        }
                    });

                    filterButtons.forEach(button => {
                        const isActive = button.dataset.filter === currentPlaceFilter;

                        button.classList.toggle("active", isActive);
                        button.setAttribute("aria-pressed", String(isActive));
                    });
                }

                filterButtons.forEach(button => {
                    button.addEventListener("click", () => {
                        currentPlaceFilter = button.dataset.filter;
                        applyPlaceFilter();
                    });
                });

                applyPlaceFilter();

                infoWindow.addListener("domready", () => {
                    const visitedButton = document.getElementById(
                        "visited-toggle-button"
                    );

                    if (!visitedButton) return;

                    visitedButton.textContent = visitedPlaces.has(place.name) ? "Mark as not visited" : "Mark as visited";

                    visitedButton.onclick = () => {
                        if (visitedPlaces.has(place.name)) {
                            visitedPlaces.delete(place.name);
                        } else {
                            visitedPlaces.add(place.name);
                        }

                        saveVisitedPlaces();
                        updateTravelProgress(places);

                        marker.setIcon(getMarkerIcon(visitedPlaces.has(place.name)));

                        applyPlaceFilter();

                        visitedButton.textContent = visitedPlaces.has(place.name) ? "Mark as not visited" : "Mark as visited";
                    };
                });

                infoWindow.addListener("closeclick", () => {
                    map.panTo(initialMapCenter);
                    map.setZoom(initialZoom);
                });

                placeMarkers[place.name] = marker;
                placeInfoWindows[place.name] = infoWindow;

                marker.addListener("click", () => {
                    infoWindow.open({
                        anchor: marker,
                        map: map
                    });
                });

            });

            const searchInput = document.getElementById("place-search-input");
            const clearSearchButton = document.getElementById("clear-search");
            const searchResults = document.getElementById("search-results");

            let selectedSuggestionIndex = -1;

            function highlightSuggestion(index) {
                const suggestions = searchResults.querySelectorAll(
                    ".search-result-item"
                );

                if (suggestions.length === 0) {
                    selectedSuggestionIndex = -1;
                    return;
                }

                selectedSuggestionIndex = (index + suggestions.length) % suggestions.length;

                suggestions.forEach((suggestion, i) => {
                    const isSelected = i === selectedSuggestionIndex;

                    suggestion.style.backgroundColor = isSelected ? "#eff6ff" : "";

                    suggestion.setAttribute(
                        "aria-selected",
                        String(isSelected)
                    );
                });

                suggestions[selectedSuggestionIndex].scrollIntoView({
                    block: "nearest"
                });
            }

            searchInput.addEventListener("keydown", event => {
                const suggestions = searchResults.querySelectorAll(
                    ".search-result-item"
                );

                if (event.key === "ArrowDown" && suggestions.length > 0) {
                    event.preventDefault();
                    highlightSuggestion(selectedSuggestionIndex + 1);
                }

                if (event.key === "ArrowUp" && suggestions.length > 0) {
                    event.preventDefault();
                    highlightSuggestion(selectedSuggestionIndex - 1);
                }

                if (event.key === "Enter" && selectedSuggestionIndex >= 0) {
                    event.preventDefault();
                    suggestions[selectedSuggestionIndex].click();
                }

                if (event.key === "Escape") {
                    searchResults.replaceChildren();
                    searchResults.style.display = "none";
                    selectedSuggestionIndex = -1;
                }
            });

            searchInput.addEventListener("input", () => {
                const searchText = searchInput.value.trim().toLowerCase();

                searchResults.replaceChildren();
                selectedSuggestionIndex = -1;

                if (searchText === "") {
                    searchResults.style.display = "none";
                    return;
                }

                const matchingPlaces = places.filter(place =>
                    place.name.toLowerCase().includes(searchText)
                );

                if (matchingPlaces.length === 0) {
                    const message = document.createElement("p");
                    message.className = "search-empty";
                    message.textContent = "No places found. Try another city.";

                    searchResults.appendChild(message);
                    searchResults.style.display = "block";
                    return;
                }

                matchingPlaces.forEach(place => {
                    const resultButton = document.createElement("button");

                    resultButton.type = "button";
                    resultButton.className = "search-result-item";
                    resultButton.textContent = place.name;

                    resultButton.addEventListener("click", () => {
                        map.panTo({
                            lat: place.lat,
                            lng: place.lng
                        });

                        map.setZoom(9);
                        
                        Object.values(placeInfoWindows).forEach(infoWindow => {
                            infoWindow.close();
                        });

                        placeInfoWindows[place.name].open({
                            anchor: placeMarkers[place.name],
                            map: map
                        });

                        searchInput.value = place.name;
                        searchResults.replaceChildren();
                        searchResults.style.display = "none";
                    });

                    searchResults.appendChild(resultButton);
                });

                searchResults.style.display = "block";
            });

            clearSearchButton.addEventListener("click", () => {
                searchInput.value = "";
                searchResults.replaceChildren();
                
                searchResults.style.display = "none";
                selectedSuggestionIndex = -1;

                Object.values(placeInfoWindows).forEach(infoWindow => {
                    infoWindow.close();
                });

                map.panTo(initialMapCenter);
                map.setZoom(initialZoom);

                searchInput.focus();
            });
        })
        .catch(error => {
            console.error("Error loading places:", error);
        });
}

const googleMapsScript = document.createElement("script");

googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;

googleMapsScript.async = true;
googleMapsScript.defer = true;

document.head.appendChild(googleMapsScript);