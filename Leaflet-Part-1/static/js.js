<!DOCTYPE html>
<html>
<head>
    <title>Earthquake Visualization</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        #map { height: 600px; }
    </style>
</head>
<body>
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        var map = L.map('map').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Load the earthquake data
        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, {
                            radius: Math.sqrt(feature.properties.mag) * 3,
                            fillColor: getColor(feature.geometry.coordinates[2]),
                            color: '#000',
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        }).bindPopup(`<b>${feature.properties.place}</b><br>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km`);
                    }
                }).addTo(map);
            });

        function getColor(depth) {
            var colors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'];
            return depth > 100 ? colors[4] :
                   depth > 70  ? colors[3] :
                   depth > 50  ? colors[2] :
                   depth > 30  ? colors[1] :
                                 colors[0];
        }
    </script>
</body>
</html>