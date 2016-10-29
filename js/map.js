var map = L.map('map').setView([60.1704, 10.2485], 12);
// L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var Kartverket = L.tileLayer.wms('http://openwms.statkart.no/skwms1/wms.topo2.graatone?', {
    layers: 'topo2_graatone_WMS'
    }).addTo(map);

var remaIcon = L.icon({
  iconUrl: 'icon/rema1000.png',
  iconSize:     [20, 20]
});

var rema = L.geoJson.ajax("data/rema 1000.geojson",
    {middleware:function(data) {
      return L.geoJson(data, {
        onEachFeature: function (feature, layer) {
          layer.setIcon(remaIcon);
        }
      }).addTo(map);
    }});

var parks = L.esri.featureLayer({
  url: "http://husmann.ra.no/arcgis/rest/services/Kulturminnesok/Kulturminner/MapServer/1",
  style: function () {
    return { color: "#EC1111", weight: 2 };
  }
}).addTo(map);

var popupTemplate = "<h3>{Navn}";

parks.bindPopup(function(e) {
  return L.Util.template(popupTemplate, e.feature.properties)
});

var overlay = L.featureGroup().addTo(map);
/*
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
    var buffer = turf.buffer(point,50000,'meters');
    var geojsonbuffer= L.geoJson(buffer, {style:bufferStyle});
    // var layers = L.layerGroup([Kartverket, Norge, geojsonbuffer]);
    // layers.addTo(map)
    var differenced = turf.difference(polygon2, buffer);
    L.geoJSON(differenced, {style:myStyle}).addTo(map);
    // polygon2 = differenciate(buffer, polygon2);

}
function onError(){
  alert('Noe gikk feil');
}
*/
var myStyle = {"color": "#000000", "weigth": 0, "opacity": 1, "fillOpacity": 1};

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

const boxArea = turf.area(polygon2);
const norwayArea = 325928052000;

var mask = L.geoJSON(polygon2, {style: myStyle}).getLayers()[0];


overlay.addLayer(mask);


function differenciate(buffer, difflayer){
  return turf.difference(difflayer, buffer);
}



var test = $.getJSON("data/norge_rundt_geopos.json", function(result){
    $.each(result, function(i, field){
      console.log(field);
    });
});


// var jqxhr = $.getJSON( "data/norge_rundt_geopos.json", function() {
//   console.log( "success" );
// })
//   .done(function() {
//     console.log( "second success" );
//   })
//   .fail(function() {
//     console.log( "error" );
//   })
//   .always(function() {
//     console.log( "complete" );
//   });

// Perform other work here ...

// Set another completion function for the request above
// jqxhr.complete(function() {
//   console.log( "second complete" );
// });


map.on("mousemove", function(mouseEvent){
  onSuccess2(mouseEvent.latlng);
});

function onSuccess2(latlng){
  var point = reproject(
  {
    "type": "Feature",
    "properties": {},
    "geometry": {
        "type": "Point",
        "coordinates": [latlng.lng, latlng.lat]
    }
  },
    "WGS84", "EPSG:3857");


    var bufferStyle = {"color": "#ff0000"};
    var buffer = turf.buffer(point,100000);
    // L.geoJSON(buffer, {style:bufferStyle}).addTo(map);
    var projmask = reproject(
        mask.toGeoJSON(),
        "WGS84", "EPSG:3857");
    var temp_difflayer = reproject(differenciate(buffer, projmask), "EPSG:3857", "WGS84");
    console.log(temp_difflayer);
    overlay.removeLayer(mask);

    mask = L.geoJSON(temp_difflayer, {style: myStyle}).getLayers()[0];
    overlay.addLayer(mask);
    console.log(turf.area(temp_difflayer));
    console.log(boxArea);
    var exploredArea = (boxArea - turf.area(temp_difflayer));
    console.log(exploredArea);
    console.log((exploredArea/norwayArea)*100);
    // console.log(area);
}



var pos = L.control.coordinates({
  position:"bottomleft",
  decimals:4,
  decimalSeperator:",",
  labelTemplateLat:"Latitude: {y}",
  labelTemplateLng:"Longitude {x}",
  useLatLngOrder: true
}).addTo(map);




// $.ajax({
//     type : 'GET',
//     dataType : 'json',
//     url: "data/norge_rundt_geopos.json",
//     error: function(data){console.log('error');},
//     sucess: function(data){console.log('jippii');},
//     async: false,
//   });
//
//  function success(){
//    alert('success');
//  }
//  function error(){
//    alert('error');
//  }



//"data/rema 1000.geojson"
// $.ajax({
//   url: 'mydata.json',
//   type: 'get',
//   dataType: 'json',
//   error: function(data){
//   },
//   success: function(data){
//     //do something with data
//       }
//   });

// var pos2= pos.toGeoJSON();
// L.extend(json.properties, point.properties);

// TODO: Add leaflet mini map
