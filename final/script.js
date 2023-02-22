// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1IjoibWVpcWl6IiwiYSI6ImNsY3FhZGEzOTAxb2kzcG5wNHozOTNlbHIifQ.2mz-q5XyUlMQIPwC68brjA";

// Define a map object by initialising a Map from Mapbox
const map = new mapboxgl.Map({
  container: "map",
  // Replace YOUR_STYLE_URL with your style URL.
  style: "mapbox://styles/meiqiz/clefodlcp001501msjqlqazlj",
  center: [-6.24193, 53.352000],
 zoom: 13
});


//search bar
const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for places in Dublin 1", // Placeholder text for the search bar
  proximity: {
    longitude: 	-6.266155,
    latitude: 53.350140
  } // Coordinates of Dublin 1
});
map.addControl(geocoder, "top-left");

// navigation control
map.addControl(new mapboxgl.NavigationControl(),"top-left");
// location control
map.addControl( new mapboxgl.GeolocateControl({
positionOptions: {
enableHighAccuracy: true }, trackUserLocation: true, showUserHeading: true }), "top-left"
);

//a scale
const scale = new mapboxgl.ScaleControl({
  maxWidth: 80, //size of the scale bar
  unit: "metric"
});
map.addControl(scale);


/*
Add an event listener that runs
 when a user clicks on the map element.
*/
map.on('click', (event) => {
const features = map.queryRenderedFeatures(event.point, {
 layers: ['niah-ireland'] // replace with your layer name
});
if (!features.length) {
 return;
}
const feature = features[0];
 //Fly to the point when click.
  map.flyTo({
    center: feature.geometry.coordinates, //keep this
    zoom: 17 //change fly to zoom level
  });
  
//popup windown
const popup = new mapboxgl.Popup({ offset: [0, -15] , className:"my-popup"})
.setLngLat(feature.geometry.coordinates)
.setHTML(
`<h3>${feature.properties.NAME}</h3><p>Date: ${feature.properties.DATEFROM} - ${feature.properties.DATETO}</p>
<p><a href=${feature.properties.WEBSITE_LINK}>Click for more information</a></p>`
)
.addTo(map);
});

// highlight the symbol
map.on("load", () => {
  //Define an empty fake layer for the symbol being hovered
  map.addSource("current", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  // How the symbol is highlighted
  map.addLayer({
    id: "marker-hover",
    type: "circle",
    source: "current",
    layout: {},
    paint: {
      "circle-color": "black",
      "circle-radius": 5
    }
  });
});

/* 
Add an event listener that runs to wait
  when the mouse enters a feature 
*/
map.on("mouseover", "niah-ireland", (event) => {
  map.getCanvas().style.cursor = "default";
  const features = map.queryRenderedFeatures(event.point, {
    layers: ["niah-ireland"] 
  });

  if (!features.length) {
    return;
  }

  //When the mourse is on the current feature, add the feature to the fake dataset and it will be rendered.
  map.getSource("current").setData({
    type: "FeatureCollection",
    features: features.map(function (f) {
      return { type: "Feature", geometry: f.geometry };
    })
  });
  const feature = features[0];
  
  // add picture
popup = new mapboxgl.Popup({ offset: [0, -15] , className:"my-popup2"})
.setLngLat(feature.geometry.coordinates)
.setHTML(
`<img src=${feature.properties.IMAGE_LINK} width ="200" height="250">`
)
.addTo(map);
  
})

/* 
Add an event listener that runs to wait
when the mouse leaves a feature
*/
map.on("mouseleave", "niah-ireland", (event) => {
  popup.remove();

  //Clear the fake data layer for the hightlighted symbol
  map.getSource("current").setData({
    type: "FeatureCollection",
    features: [] // <--- no features
  });
});