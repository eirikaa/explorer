var map = L.map('map').setView([59.66, 10.77], 5);
// L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var Kartverket = new L.TileLayer.Kartverket("topo2graatone");
Kartverket.addTo(map);


var myStyle = {"color": "#000000", "weigth": 0, "opacity": 1, "fillOpacity": 1};
var Norge = L.geoJson.ajax("data/fylker.geojson", {style:myStyle});

// Norge.addTo(map);




navigator.geolocation.getCurrentPosition(onSuccess,
                                         onError,
                                         {maximumAge: 10000, timeout: 5000, enableHighAccuracy: true,
                                         interval: 6000})

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
    var buffer = turf.buffer(point,5000,'meters');
    console.log(buffer);
    console.log(Norge);
    var geojsonbuffer= L.geoJson(buffer, {style:bufferStyle});
    geojsonbuffer.addTo(map);
    console.log(geojsonbuffer);
    JSON.stringify(Norge);
    console.log(Norge);
    var layers = L.layerGroup([Kartverket, Norge, geojsonbuffer]);
    // layers.addTo(map);
    // geojsonbuffer.addTo(map);
    // var bufferLayer = L.GeoJSON(buffer).addTo(map);
    // buffer.setGeoJSON();
    // console.log(turf.featurecollection);
    // var result = turf.featurecollection([buffer.features, point]);

    // var differenced = turf.difference(geojsonbuffer, Norge)
    // differenced.addTo(map);

}
function onError(){
  alert('Noe gikk feil');
}

// TODO: Add leaflet mini map
