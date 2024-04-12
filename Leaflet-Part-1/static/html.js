<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Earthquake Data</title>
</head>
<body>
    <h1>Earthquake Data</h1>
    <div id="earthquake-list"></div>

    <script>
        // Fetch earthquake data from the URL
        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson')
            .then(response => response.json())
            .then(data => {
                // Get the list of earthquakes
                const earthquakes = data.features;

                // Get the div where we will display the earthquake information
                const earthquakeList = document.getElementById('earthquake-list');

                // Iterate over each earthquake and create a list item to display the information
                earthquakes.forEach(earthquake => {
                    const { mag, place, time } = earthquake.properties;
                    const listItem = document.createElement('div');
                    listItem.innerHTML = `<strong>Magnitude:</strong> ${mag}<br><strong>Location:</strong> ${place}<br><strong>Time:</strong> ${new Date(time).toLocaleString()}<br><br>`;
                    earthquakeList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error fetching earthquake data:', error);
            });
    </script>
</body>
</html>