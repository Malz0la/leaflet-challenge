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
        var map = L.map('map', {
            center: [0, 0],
            zoom: 2,
            layers: [
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                })
            ]
        });

        var tectonicPlatesLayer = L.geoJSON();
        var earthquakesLayer = L.geoJSON();

        var baseMaps = {
            "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }),
            "Satellite Map": L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            })
        };

        var overlays = {
            "Tectonic Plates": tectonicPlatesLayer,
            "Earthquakes": earthquakesLayer
        };

        L.control.layers(baseMaps, overlays).addTo(map);

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
                }).addTo(earthquakesLayer);
            });

        fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: function (feature) {
                        return {
                            color: 'orange',
                            weight: 2
                        };
                    }
                }).addTo(tectonicPlatesLayer);
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