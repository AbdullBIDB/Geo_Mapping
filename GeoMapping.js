//to test the app is working
console.log("The API is working");
//maplayer for the page
var mapboxlayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY //this API is comging from the config.js file.
});
console.log(mapboxlayer);
//direct the maplayer to the id element in html
//The page will center on the state of california
var maplayer = L.map("mapid", {
  center: [
    36.778259, 	-119.417931
  ],
  zoom: 4.5
});
console.log(maplayer);
//required layer
mapboxlayer.addTo(maplayer);



//API call to get the earth quick data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

 //data to plot the earthquick data plus the style
  function earthQ(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: bubblecolor(feature.properties.mag),
      color: "#000000",
      radius: earthquakeR(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  //the color of the bubbles on the map based on the magnitude of the earthquake
  function bubblecolor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }

  
  function earthquakeR(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  
  L.geoJson(data, {
  
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: earthQ,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(maplayer);

  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(maplayer);
});
