var map = L.map('map').setView([59.66, 10.77], 5);
// L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var Kartverket = L.tileLayer.wms('http://openwms.statkart.no/skwms1/wms.topo2.graatone?', {
    layers: 'topo2_graatone_WMS'
    }).addTo(map);


var myStyle = {"color": "#000000", "weigth": 0, "opacity": 1, "fillOpacity": 0.7};
// var Norge = L.geoJson.ajax("data/norge2.geojson", {style:myStyle});
// Norge.toGeoJSON();
// Norge.addTo(map);


navigator.geolocation.getCurrentPosition(onSuccess,
                                         onError,
                                         {maximumAge: 10000, timeout: 5000, enableHighAccuracy: true,
                                         interval: 6000});

  function onSuccess(pos){
  var lat = pos.coords.latitude;
  var lon = pos.coords.longitude;
  console.log(lat, lon);

  var point = {
    "type": "Feature",
    "properties": {},
    "geometry": {
        "type": "Point",
        "coordinates": [lon, lat]
    }
};
    var bufferStyle = {"color": "#ff0000"};
    var buffer = turf.buffer(point,50000,'meters');
    var geojsonbuffer= L.geoJson(buffer, {style:bufferStyle});
    // var layers = L.layerGroup([Kartverket, Norge, geojsonbuffer]);
    // layers.addTo(map)
    // var differenced = turf.difference(polygon2, buffer);
    // L.geoJSON(differenced, {style:myStyle}).addTo(map);
    polygon2 = differenciate(buffer, polygon2);

}
function onError(){
  alert('Noe gikk feil');
}

var polygon2 = {
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
// L.geoJSON(polygon2).addTo(map);
function differenciate(buffer, difflayer){
  var differenced = turf.difference(difflayer, buffer);
  L.geoJSON(differenced, {style:myStyle}).addTo(map);
  return differenced;
}

var pos = L.control.coordinates({
  position:"bottomleft",
  decimals:4,
  decimalSeperator:",",
  labelTemplateLat:"Latitude: {y}",
  labelTemplateLng:"Longitude {x}",
  useLatLngOrder: true,
}).addTo(map);



map.on("mousemove", function(mouseEvent){
  onSuccess2(mouseEvent.latlng);
});

function onSuccess2(latlng){
  var point = {
    "type": "Feature",
    "properties": {},
    "geometry": {
        "type": "Point",
        "coordinates": [latlng.lng, latlng.lat]
    }
  }
    var bufferStyle = {"color": "#ff0000"};
    var buffer = turf.buffer(point,50000,'meters');
    L.geoJSON(buffer, {style:bufferStyle}).addTo(map);
    // polygon2 = differenciate(buffer, polygon2);
}

// var pos2= pos.toGeoJSON();
// L.extend(json.properties, point.properties);

// TODO: Add leaflet mini map
