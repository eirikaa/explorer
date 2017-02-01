var map = L.map('map').setView([60.1704, 10.2485], 12);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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

var zoomToCoords = function(position) {
  map.panTo([position.coords.latitude, position.coords.longitude], {animate: true, duration: 4.0});
  map.setView([position.coords.latitude, position.coords.longitude], 14);
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

navigator.geolocation.getCurrentPosition(zoomToCoords, onError);

var onSuccess = function(position) {

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


          var buffer = turf.buffer(point, 10000);
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

//navigator.geolocation.getCurrentPosition(onSuccess, onError);

    // Options: throw an error if no update is received every 30 seconds.
    //
var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true })

//navigator.geolocation.clearWatch(watchID);

// TODO: Add leaflet mini map
// TODO: The effeciency is bad when the geometry gets complicated
