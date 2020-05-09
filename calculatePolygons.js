const convexhull = require('./convec_hull')
const concaveman = require('concaveman')

function splitByTimestamp(coordinates) {
    let coordinatesByTime = {}
    coordinates.forEach(c => {
        let time = new Date(c.timestamp)
        let h = time.getHours()
        let timeName = h.toString() + ':00-' + h.toString() + ':59'
        if (!coordinatesByTime[timeName]) {
            coordinatesByTime[timeName] = []
        }
        coordinatesByTime[timeName].push(c)
    });
    return coordinatesByTime
}

function measure(coord1, coord2) {  // generally used geo measurement function
    let lat1 = coord1.lat
    let lon1 = coord1.lng
    let lat2 = coord2.lat
    let lon2 = coord2.lng

    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000; // meters
}



function coordinateIsIn(coordinate, coordinateGroups) {
    let index = -1
    coordinateGroups.forEach((polygon, i) => {
        if (polygon.includes(coordinate)) {
            index = i
            return
        }
    });
    return index
}

function groupCoordinatesByDistance(coordinates, allowedDistance) {
    let coordinateGroups = []
    for (let i = 0; i < coordinates.length; i++) {
        let c = coordinates
        let iPolygonIndex = coordinateIsIn(c[i], coordinateGroups)
        if (iPolygonIndex < 0) {
            coordinateGroups.push([c[i]])
            iPolygonIndex = coordinateGroups.length - 1
        }
        for (let j = 0; j < coordinates.length; j++) {
            if (!(i === j)) {
                let distance = measure(c[i].location, c[j].location)
                if (distance <= allowedDistance) {
                    let jPolygonIndex = coordinateIsIn(c[j], coordinateGroups)
                    if (jPolygonIndex < 0) {
                        coordinateGroups[iPolygonIndex].push(c[j])
                    } else if (jPolygonIndex !== iPolygonIndex) {
                        let newArr = coordinateGroups[iPolygonIndex].concat(coordinateGroups[jPolygonIndex])
                        coordinateGroups.splice(iPolygonIndex, 1)
                        coordinateGroups.splice(jPolygonIndex, 1)
                        coordinateGroups.push(newArr)
                        iPolygonIndex = coordinateGroups.length - 1
                        jPolygonIndex = iPolygonIndex
                    }
                }
            }
        }
    }
    return coordinateGroups
}

function getCoordinatesInXY(coordinates) {
    let coordinatesXY = []
    coordinates.forEach(c => {
        coordinatesXY.push({
            x: c.location.lng,
            y: c.location.lat
        })
    });
    return coordinatesXY
}

function getXYCoordinatesInLatLng(coordinates) {
    let coordinatesLatLng = []
    coordinates.forEach(c => {
        coordinatesLatLng.push({
            lat: c.x,
            lng: c.y
        })
    });
    return coordinatesLatLng
}

function calculatePolygon(coordinates) {
    let coordinatesXY = getCoordinatesInXY(coordinates)
    let polygonXY = convexhull.makeHull(coordinatesXY)
    // let polygonXY = concaveman(coordinatesXY)
    let polygonLatLng = getXYCoordinatesInLatLng(polygonXY)
    return polygonLatLng
}

function calculatePolygonsFromCoordinateGroups(coordinateGroups) {
    let polygons = []
    coordinateGroups.forEach(group => {
        polygons.push(calculatePolygon(group))
    });
    return polygons
}

function getPolygon(coordinates, allowedDistance) {
    let newCoordinates = JSON.parse(JSON.stringify(coordinates))
    let groups = groupCoordinatesByDistance(newCoordinates, allowedDistance)
    let polygons = calculatePolygonsFromCoordinateGroups(groups)
    return polygons
}



function run(coordinates, allowedDistance) {
    let coordinatesByTime = splitByTimestamp(coordinates)
    let polygons = {}
    for (let key in coordinatesByTime) {
        polygons[key] = getPolygon(coordinatesByTime[key], allowedDistance)
    }
    return polygons
}

module.exports = run