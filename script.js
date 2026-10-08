function initMap() {

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: {
            lat: 31.5204,
            lng: 74.3587
        }
    });

    fetch("places.json")
        .then(response => {

            if (!response.ok) {
                throw new Error("Could not load places.json");
            }

            return response.json();
        })
        .then(places => {

            places.forEach(place => {

                const marker = new google.maps.Marker({
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
            </div>
        </div>
    `
});

                marker.addListener("click", () => {

                    infoWindow.open({
                        anchor: marker,
                        map: map
                    });

                });

            });

        })
        .catch(error => {
            console.error("Error loading places:", error);
        });
}


const googleMapsScript = document.createElement("script");

googleMapsScript.src =
    `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;

googleMapsScript.async = true;
googleMapsScript.defer = true;

document.head.appendChild(googleMapsScript);