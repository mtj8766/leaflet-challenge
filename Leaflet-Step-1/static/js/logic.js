// Set up API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var myMap = L.map("map", {
  center: [38.7258, -90.4522],
  zoom: 5
}); 

// Create map layer
 L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "streets-v9",
    accessToken: API_KEY
  }).addTo(myMap);

 // Create marker size
 function markerSize(mag){
  return mag * 20000
 }

  function markerColor(mag){
   return mag > 5 ? "#913d00":
       mag > 4.5 ? "#a54500":
       mag > 4 ? "#b94d00":
       mag > 3.5 ? "#cc5500":
       mag > 3 ? "#e05e00":
                   "#f36600";
}

// Send request and make createFeatures function
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) { 
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>" + feature.properties.mag + "</p>"
      );
  }
  function pointToLayer(feature, latlng) {
    return L.circle(latlng, {
        fillOpacity: 0.75,
        color: "#000",
        weight: 0.8,
        fillColor:markerColor(feature.properties.mag),
        radius: markerSize(feature.properties.mag)
})}


  // Create GeoJSON layer
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });

  earthquakes.addTo(myMap);
}