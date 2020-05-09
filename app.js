require('dotenv').config()
const loadGoogleMapsApi = require('load-google-maps-api')
let fs = require('fs')
let polygons = require('./calculatePolygons')

let cords_full = fs.readFileSync('./assets/cords_full.json', 'utf8')
let one_coordinates = fs.readFileSync('./assets/chords_one.json', 'utf8')
let cords_hours = fs.readFileSync('./assets/cords_minutes_added.json', 'utf8')

let dataset_1 = JSON.parse(cords_full)
let dataset_hours = JSON.parse(cords_hours)
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
        zoomControl: false,
        scaleControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        mapTypeId: 'satellite',
      })

      dataset_1 = calculateWeight(dataset_1)
      createPolygonLayer(dataset_hours)
      // let colorizedDataset = divideColorToCordordinates(dataset_1)
      // coordinates = covertToGoogleMapsCords(dataset_1)
      // createHeatmapLayer(coordinates)
      // createOverlayView()
      // createCircelsLayer(colorizedDataset)
      // writePositionsToJSONByClick()

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


/* 
Create Polygon with based on the given parameters. 
*/

const creatPolygon = (coordinates, sColor, sOpacity, weight, fColor, fOpacity) => {

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
  let allCords = polygons(coordinates, 6)['10:00-10:59']
  allCords.forEach(cordsArray => {
    console.log(cordsArray)
    let polygon = creatPolygon(cordsArray, 'rgba(0, 0, 255, 1)', 1.2, 2, 'rgba(255, 0, 0, 1)', .55)
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

// sex färger 
// sortera dataset på timestamp
// dela upp sorterade dataset på 6 
// assigna varje del till en färg

const divideColorToCordordinates = (coordinates) => {

  coordinates.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })

  let gradient = [
    'rgba(0, 0, 255, 0)',
    'rgba(0, 0, 255, 1)',
    'rgba(55, 0, 200, 1)',
    'rgba(125, 0, 120, 1)',
    'rgba(200, 0, 55, 1)',
    'rgba(255, 0, 0, 1)',
  ]

  let dividedArray = splitToChunks(coordinates, 6)

  dividedArray[0].forEach(element => {
    element.color = 'rgba(0, 0, 255, 0)'
  });

  dividedArray[1].forEach(element => {
    element.color = 'rgba(0, 0, 255, 1)'
  });

  dividedArray[2].forEach(element => {
    element.color = 'rgba(55, 0, 200, 1)'
  });

  dividedArray[3].forEach(element => {
    element.color = 'rgba(125, 0, 120, 1)'
  });

  dividedArray[4].forEach(element => {
    element.color = 'rgba(200, 0, 55, 1)'
  });

  dividedArray[5].forEach(element => {
    element.color = 'rgba(255, 0, 0, 1)'
  });

  return dividedArray

}



const splitToChunks = (array, parts) => {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}


const createCircelsLayer = (coordinates) => {

  coordinates.forEach(coordinates => {

    for (var coord in coordinates) {
      var cityCircle = new window.google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.2,
        strokeWeight: 2,
        fillColor: coordinates[coord].color,
        fillOpacity: 0.35,
        map: map,
        center: coordinates[coord].location,
        radius: Math.sin(coordinates[coord].timestamp) * 2 // SÖKRADIE - TODO: fixa vettigt sökradie algorithm
      });
    }
  });
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
