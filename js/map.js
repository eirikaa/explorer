var map = L.map('map').setView([59.66, 10.77], 5);
// L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var Kartverket = new L.TileLayer.Kartverket("topo2graatone");
Kartverket.addTo(map);


var myStyle = {"color": "#ff0000", "weigth": 0, "opacity": 1, "fillOpacity": 1};
var Norge = L.geoJson.ajax("data/fylker.geojson", {style:myStyle});
Norge.addTo(map);


// navigator.geolocation.getCurrengetCurrentPosition(function(position){
//   var lat = position.coords.latutude;
//   var lon = position.coords.longitude;
// });
//
// alert(lat);
// lc = L.control.locate().addTo(map);
//
// lc.start();
//
// console.log(lc);
// // alert(this._event.latlng());
// alert(pos.coords.latitude);
// leaflet mini map

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
    // console.log([lon,lat].toGeoJSON());
    var buffer = turf.buffer(point,500,'meters');
    console.log(buffer);
    console.log(Norge);
    L.geoJson(buffer).addTo(map);
    // var bufferLayer = L.GeoJSON(buffer).addTo(map);
    // buffer.setGeoJSON();
    // console.log(turf.featurecollection);
    // var result = turf.featurecollection([buffer.features, point]);

}

function onError(){
  alert('Noe gikk feil');
}
