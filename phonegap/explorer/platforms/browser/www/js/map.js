var map = L.map('map').setView([60.1704, 10.2485], 12);

// Norgeskart
var Kartverket = L.tileLayer.wms('http://openwms.statkart.no/skwms1/wms.topo2.graatone?', {
    layers: 'topo2_graatone_WMS'
    });

// Mapbox pirate map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZWlyaWthYSIsImEiOiJkUkRLZFNvIn0.Jp-rRnXtj7LMYtiMauL0lA', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'eirikaa.1ppjk3k8',
    accessToken: 'pk.eyJ1IjoiZWlyaWthYSIsImEiOiJjaXV3eTVxMTgwMDE5MzN0OXJpcXdkdW0wIn0.4bKwcNP6q5WOV62P7ldSfw'
}).addTo(map);

// TODO: cluster point datasets, leaflet marker cluster

// Esri plugin for accessing ArcGIS REAT API
// Kultrurminner
var kulturminner = L.esri.featureLayer({
  url: "http://husmann.ra.no/arcgis/rest/services/Kulturminnesok/Kulturminner/MapServer/1",
  style: function () {
    return { color: "#EC1111", weight: 2 };
  }
}).addTo(map);

var popupTemplate = "<h3>{Navn}";

kulturminner.bindPopup(function(e) {
  return L.Util.template(popupTemplate, e.feature.properties)
});


var myStyle = {"color": "#000000", "weigth": 0, "opacity": 1, "fillOpacity": 1};
var overlay = L.featureGroup().addTo(map);

var startPolygon = {

  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-2.021484375, 57.61010702068388],
      [-2.021484375, 72.18180355624855],
      [33.83789062499999, 72.18180355624855],
      [33.83789062499999, 57.61010702068388],
      [-2.021484375, 57.61010702068388]
    ]]
  }
};

const boxArea = turf.area(startPolygon);
const norwayArea = 325928052000;

var mask = L.geoJSON(startPolygon, {style: myStyle}).getLayers()[0];
overlay.addLayer(mask);


function differenciate(buffer, difflayer) {
  return turf.difference(difflayer, buffer);
}

/*map.on("mousemove", function(mouseEvent){
  onSuccess2(mouseEvent.latlng);
  console.log(mouseEvent.latlng)
});*/

var onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');

          map.setView([position.coords.latitude, position.coords.longitude], 14)

          var point = reproject(
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "Point",
                  "coordinates": [position.coords.longitude, position.coords.latitude]
                }
              },
              "WGS84", "EPSG:3857");


          var buffer = turf.buffer(point, 100000);
          // FIXME: Somethin is weird with this distance
          // buff =  reproject(buffer, "WGS84", "EPSG:3857");

          var projmask = reproject(
              mask.toGeoJSON(),
              "WGS84", "EPSG:3857");

          var temp_difflayer = reproject(differenciate(buffer, projmask), "EPSG:3857", "WGS84");
          overlay.removeLayer(mask);

          mask = L.geoJSON(temp_difflayer, {style: myStyle}).getLayers()[0];
          overlay.addLayer(mask);

          var exploredArea = (boxArea - turf.area(temp_difflayer));
          console.log((exploredArea/norwayArea)*100);
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

navigator.geolocation.getCurrentPosition(onSuccess, onError);


// TODO: Add leaflet mini map
// TODO: The effeciency is bad when the geometry gets complicated
