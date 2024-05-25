// Initialize Leaflet map
var myMap = L.map("map").setView([37.0902, -95.7129], 5); 

// Adding the base map 
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 14,
  id: "light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// Load URL for geojson and get request
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url, function(data){
  console.log(data)

  for (var i = 0; i < data.features.length; i++){
    var coords = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]]; // Extracting coordinates
    var depth = data.features[i].geometry.coordinates[2];
    var color = '';
    switch(true){
      case (depth > -10 && depth < 10):
        color = 'blue';
        break;
      case (depth >= 10 && depth < 30):
        color = 'green';
        break;
      case (depth >= 30 && depth < 50):
        color = 'lightgreen';
        break;
      case (depth >= 50 && depth < 70):
        color = 'yellow';
        break;
      case (depth >= 70 && depth < 90):
        color = 'orange';
        break;
      case (depth >= 90):
        color = 'darkred';
        break;
    }
    var mag = data.features[i].properties.mag;
    var date = new Date(data.features[i].properties.time);
    var time = date.toLocaleTimeString();
    var loc = data.features[i].properties.place;
    // Create the circles for each earthquake report and add to the baseMap layer.
    L.circle(coords, {
      opacity: .5,
      fillOpacity: 0.75,
      weight: .5,
      color: 'black',
      fillColor: color,
      radius: 15000 * mag
    }).bindPopup(`<p align = "left"> <strong>Date:</strong> ${date} <br> <strong>Time:</strong>${time} <br>
      <strong>Location:</strong> ${loc} <br> <strong>Magnitude:</strong> ${mag} </p>`).addTo(myMap);
  }
});

// Create a legend
var legend = L.control({ position: 'topright' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');
  var depths = [-10, 10, 30, 50, 70, 90];

  var legendHeader = '<h3> Earthquake <br> Depth </h3><hr>'
  div.innerHTML = legendHeader;

  for (var i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' + depths[i] + (depths[i + 1] ? ' - ' + depths[i + 1] + '<br>' : ' + ');
  };

  return div;
};

legend.addTo(myMap);

// Function to get color based on depth
function getColor(d) {
  return d >= 90 ? 'darkred':
         d >= 70 ? 'orange':
         d >= 50 ? 'yellow':
         d >= 30 ? 'green':
         d >= 10 ? 'blue':
                   'darkviolet';
}
