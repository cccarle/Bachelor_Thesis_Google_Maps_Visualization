require('dotenv').config()
const loadGoogleMapsApi = require('load-google-maps-api')
let fs = require('fs')
let polygons = require('./calculatePolygons')

let cords_full = fs.readFileSync('./assets/cords_full.json', 'utf8')
let one_coordinates = fs.readFileSync('./assets/chords_one.json', 'utf8')

let dataset_1 = JSON.parse(cords_full)
let searchRadiusButton = document.getElementById('searchRadius')
let arr = []
let map, googleMaps, heatmap, coordinates
let radius = 50



// const page = await import('./calculatePolygons')


const covertToGoogleMapsCords = (data) => {
  return data.map((cord) => {
    return {
      location: new window.google.maps.LatLng({
        lat: cord.location.lat,
        lng: cord.location.lng,
      }),
      weight: cord.weight,
    }
  })
}

/* 
Create map when DOM is loaded.
Set up listener for adding new posotions to heatmap layer.
*/

const initMap = function _initMap() {
  document.addEventListener('DOMContentLoaded', () => {
    let mapElement = document.getElementById('map')

    loadGoogleMapsApi({
      key: process.env.GOOGLE_MAPS_API_KEY,
      libraries: ['visualization'],
    }).then((google) => {
      googleMaps = google

      map = new googleMaps.Map(mapElement, {
        center: {
          lat: 56.657081713112085,
          lng: 16.321899075213206,
        },
        zoom: 19,
        mapTypeId: 'satellite',
      })

      dataset_1 = calculateWeight(dataset_1)
      createPolygonLayer(dataset_1)
      coordinates = covertToGoogleMapsCords(dataset_1)
      //createHeatmapLayer(coordinates)
     // createOverlayView()
      writePositionsToJSONByClick()

    })

  })

}


const calculateWeight = (stdCoordinates) => {
  let crds = JSON.parse(JSON.stringify(stdCoordinates))

  crds.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })

  if (crds.length > 1) {
    let diff = crds[crds.length - 1].timestamp - crds[0].timestamp
    let i = 1
    crds.forEach((element) => {
      let percent = ((element.timestamp - crds[0].timestamp) / diff) * 100
      element.weight = parseFloat(percent.toFixed(1)) + 1
    })
  }

  return crds
}


// const createOverlayView = () => {
//   var overlay;
//   USGSOverlay.prototype = new window.google.maps.OverlayView();



//   var bounds = new window.google.maps.LatLngBounds(
//     new window.google.maps.LatLng(56.65762137557452, 16.32347848127566),
//     new window.google.maps.LatLng(56.65768329409489, 16.323813757402522));

//   var srcImage = 'https://developers.google.com/maps/documentation/' +
//     'javascript/examples/full/images/talkeetna.png';


//   overlay = new USGSOverlay(bounds, srcImage, map);


//   /* 
//   Create Overlay-layer 
//   TODO: add canvas to the overlay. 
//   */

//   function USGSOverlay(bounds, image, map) {

//     this.bounds_ = bounds;
//     this.image_ = image;
//     this.map_ = map;

//     this.div_ = null;
//     this.setMap(map);
//   }

//   /**
//    * onAdd is called when the map's panes are ready and the overlay has been
//    * added to the map.
//    */
//   USGSOverlay.prototype.onAdd = function () {

//     var div = document.createElement('div');
//     div.style.borderStyle = 'none';
//     div.style.borderWidth = '0px';
//     div.style.position = 'absolute';

//     // Create the img element and attach it to the div.
//     var img = document.createElement('img');
//     img.src = this.image_;
//     img.style.width = '100%';
//     img.style.height = '100%';
//     img.style.position = 'absolute';

//     div.appendChild(img);

//     this.div_ = div;

//     // Add the element to the "overlayLayer" pane.
//     var panes = this.getPanes();
//     panes.overlayLayer.appendChild(div);
//   };

//   USGSOverlay.prototype.draw = function () {

//     // We use the south-west and north-east
//     // coordinates of the overlay to peg it to the correct position and size.
//     // To do this, we need to retrieve the projection from the overlay.
//     var overlayProjection = this.getProjection();

//     // Retrieve the south-west and north-east coordinates of this overlay
//     // in LatLngs and convert them to pixel coordinates.
//     // We'll use these coordinates to resize the div.
//     var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
//     var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

//     // Resize the image's div to fit the indicated dimensions.
//     var div = this.div_;
//     div.style.left = sw.x + 'px';
//     div.style.top = ne.y + 'px';
//     div.style.width = (ne.x - sw.x) + 'px';
//     div.style.height = (sw.y - ne.y) + 'px';
//   };

//   // The onRemove() method will be called automatically from the API if
//   // we ever set the overlay's map property to 'null'.
//   USGSOverlay.prototype.onRemove = function () {
//     this.div_.parentNode.removeChild(this.div_);
//     this.div_ = null;
//   };
// }

/* 
Create Polygon with based on the given parameters. 
*/

const creatPolygon = (coordinates,sColor,sOpacity,weight,fColor,fOpacity) => {

  var polygonLayer = new google.maps.Polygon({
    paths: coordinates,
    strokeColor: sColor,
    strokeOpacity: sOpacity,
    strokeWeight: weight,
    fillColor: fColor,
    fillOpacity: fOpacity,
    draggable: false,
  });

  return polygonLayer
}

/* 
Uses creatPolygon() to creates a new separate polygon for every array returned by polygons() method. 
*/

const createPolygonLayer = (coordinates) => {
 let allCords = polygons(coordinates, 4)['10:00-10:59']
 allCords.forEach(cordsArray => {
   console.log(cordsArray)
    let polygon = creatPolygon(cordsArray,'rgba(0, 0, 255, 1)',1.2,2,'rgba(255, 0, 0, 1)',.55)
    polygon.setMap(map);
  });
}


/* 
Create Heatmap-layer with coordinates array. 
*/

const createHeatmapLayer = (coordinates) => {
  heatmap = new googleMaps.visualization.HeatmapLayer({
    data: coordinates,
  })

  heatmap.setMap(map)

  heatmap.set('radius', heatmap.get('radius') ? radius : radius)

  let gradient = [
    'rgba(0, 0, 255, 0)',
    'rgba(0, 0, 255, 1)',
    'rgba(55, 0, 200, 1)',
    'rgba(125, 0, 120, 1)',
    'rgba(200, 0, 55, 1)',
    'rgba(255, 0, 0, 1)',
  ]

  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient)

}

const changeRadius = () => {
  searchRadiusButton.addEventListener('click', () => {
    let inputValue = document.querySelector('.input').value
    if (inputValue <= 100 && inputValue > 0) {
      radius = inputValue
      heatmap.set('radius', heatmap.get('radius') ? radius : radius)
    }
  })
}

/* 
Appends the "click-positions" longiture & latitude to the coordinates array.
*/

const writePositionsToJSONByClick = () => {
  googleMaps.event.addListener(map, 'click', (event) => {
    arr.push({
      location: new window.google.maps.LatLng({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }),
      weight: 1,
      timestamp: Date.now(),
    })
    heatmap.setMap(null)
    let data = calculateWeight(arr)
    let coordinates = covertToGoogleMapsCords(data)
    createHeatmapLayer(coordinates)
  })
}



initMap()
changeRadius()
