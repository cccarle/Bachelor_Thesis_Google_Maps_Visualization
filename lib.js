

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