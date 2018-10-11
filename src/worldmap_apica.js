import WorldMapOriginal from './worldmap';

const tileServers = {
  'CartoDB Positron': { url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>', subdomains: 'abcd'},
  'CartoDB Dark': {url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>', subdomains: 'abcd'}
};

export default class WorldMap extends WorldMapOriginal {
  // in table Location Data mode locationName is the value of the field which name is set in "Table Label Field".
  // can be set to any field from table datasource, so we just show it instead of the original that shows more than we want.
  createPopup(circle, locationName, value) {
    super.createPopup(circle, locationName, value);
    circle.unbindPopup();
    circle.bindPopup(locationName, {'offset': window.L.point(0, -7), 'className': 'worldmap-popup', 'closeButton': this.ctrl.panel.stickyLabels});
  }

  createMap() {
    window.L.Icon.Default.imagePath = 'public/img';
    this.markers = [];
    this.legend = window.L.control({position: 'bottomleft'});
    const mapCenter = window.L.latLng(parseFloat(this.ctrl.panel.mapCenterLatitude), parseFloat(this.ctrl.panel.mapCenterLongitude));
    this.map = window.L.map(this.mapContainer, {worldCopyJump: true, center: mapCenter})
      .fitWorld()
      .zoomIn(parseInt(this.ctrl.panel.initialZoom, 10));
    this.map.panTo(mapCenter);
    this.map.scrollWheelZoom.disable();

    const selectedTileServer = tileServers[this.ctrl.tileServer];
    window.L.tileLayer(selectedTileServer.url, {
      maxZoom: 18,
      subdomains: selectedTileServer.subdomains,
      reuseTiles: true,
      detectRetina: true,
      attribution: selectedTileServer.attribution
    }).addTo(this.map);
  }

  createCircles(data) {
    var self = this;

    var markers = window.L.markerClusterGroup({
      showCoverageOnHover: false,
      iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        var severityClusterClass = self.getClassWithWorstSeverity(markers);

        return L.divIcon({ html: `<div><span>${markers.length}</span></div>`, className: `leaflet-marker-icon marker-cluster ${severityClusterClass} leaflet-zoom-animated leaflet-clickable`, iconSize: L.point(40, 40) });
      },
    });
    
    data.forEach((dataPoint) => {
      var marker = new window.L.CircleMarker(new window.L.LatLng(dataPoint.locationLatitude, dataPoint.locationLongitude), {
        radius: this.calcCircleSize(dataPoint.value || 0),
        color: this.getColor(dataPoint.value),
        fillColor: this.getColor(dataPoint.value),
        fillOpacity: 0.5,
        locationName: dataPoint.locationName,
        countBySeverity: dataPoint.countBySeverity
      });

      this.createPopup(marker, dataPoint.summary, dataPoint.valueRounded);

      this.markers.push(markers.addLayer(marker));
    });

    


    markers.on('clustermouseover', function(e) {
      var locationPopupPartials = '';
      var total = {i: 0, w: 0, e: 0, f: 0, u: 0, total: 0};
      var cluster = self.getClusterFromLayer(e);
      var children = e.layer.getAllChildMarkers();
      
      for (var i = 0; i < children.length; i++) {
        var child = children[i];

        child.options.countBySeverity.total = 
          child.options.countBySeverity.i + 
          child.options.countBySeverity.w + 
          child.options.countBySeverity.e + 
          child.options.countBySeverity.f + 
          child.options.countBySeverity.u;

        locationPopupPartials += self.createLocationPopupPartial(child.options.locationName, child.options.countBySeverity, i < children.length - 1);

        total.i += child.options.countBySeverity.i;
        total.w += child.options.countBySeverity.w;
        total.e += child.options.countBySeverity.e;
        total.f += child.options.countBySeverity.f;
        total.u += child.options.countBySeverity.u;
        total.total += child.options.countBySeverity.total; 
      };

      var label = '<div class="popup-content">';
      label += self.createSummaryPopupPartial('Summary', total);
      label += locationPopupPartials
      label += '</div>';

      cluster.unbindPopup();
      cluster.bindPopup(label, { 'offset': window.L.point(0, -20), 'className': 'worldmap-popup', 'closeButton': self.ctrl.panel.stickyLabels}).openPopup();
    })

    markers.on('clustermouseout', function(e) {
      if (!self.ctrl.panel.stickyLabels) {
        var cluster = self.getClusterFromLayer(e);
    	
        cluster.closePopup();
      }
    })

    this.markerLayer = this.map.addLayer(markers);
  }

  clearCircles() {
    for (var i =0; i < this.markers.length; i++) {
      this.markers[i].off('mouseover');
      this.markers[i].off('mouseout');
      this.map.removeLayer(this.markers[i]);
    }

    if (this.markerLayer) {
      this.map.removeLayer(this.markerLayer);
    }

    this.markers = [];
  }

  createSummaryPopupPartial(name, total) {
    return `<div class="summary-section">
              <div class="summary-section__name">
                ${name}
              </div>
              <div>
                <span class="summary-section__description summary-section__description_total">Total</span>
                <span class="summary-section__description summary-section__description_information">I</span>
                <span class="summary-section__description summary-section__description_warning">W</span>
                <span class="summary-section__description summary-section__description_error">E</span>
                <span class="summary-section__description summary-section__description_fatal">F</span>
                <span class="summary-section__description summary-section__description_unknow">U</span>
              </div>
              <div>
                <span class="summary-section__severity summary-section__severity_total">${total.total}</span>
                <span class="summary-section__severity summary-section__severity_information">${total.i}</span>
                <span class="summary-section__severity summary-section__severity_warning">${total.w}</span>
                <span class="summary-section__severity summary-section__severity_error">${total.e}</span>
                <span class="summary-section__severity summary-section__severity_fatal">${total.f}</span>
                <span class="summary-section__severity summary-section__severity_unknow">${total.u}</span>
              </div>
              <hr>
            </div>`;
  }

  createLocationPopupPartial(name, total, needHr) {
    var hrBlock = needHr ? '<hr>' : '';

    return `<div class="location-section">
              <div class="location-section__name">
                ${name}
              </div>
              <div>
                <span class="location-section__severity location-section__severity_total">${total.total}</span>
                <span class="location-section__severity location-section__severity_information">${total.i}</span>
                <span class="location-section__severity location-section__severity_warning">${total.w}</span>
                <span class="location-section__severity location-section__severity_error">${total.e}</span>
                <span class="location-section__severity location-section__severity_fatal">${total.f}</span>
                <span class="location-section__severity location-section__severity_unknow">${total.u}</span>
              </div>
              ${hrBlock}
            </div>`;
  }

  getClusterFromLayer(e) {
    var marker = e.layer.getAllChildMarkers()[0];
    
    return e.target.getVisibleParent(marker);
  }

  getClassWithWorstSeverity(markers) {
    var totals = {i: 0, w: 0, e: 0, f: 0, u: 0};
    for (var i = 0; i < markers.length; i++) {
      var countBySeverity = markers[i].options.countBySeverity;

      totals.i += countBySeverity.i;
      totals.w += countBySeverity.w;
      totals.e += countBySeverity.e;
      totals.f += countBySeverity.f;
      totals.u += countBySeverity.u;
    }

    if (totals.f > 0) return 'marker-cluster_fatal';
    if (totals.e > 0) return 'marker-cluster_error';
    if (totals.w > 0) return 'marker-cluster_warning';
    if (totals.i > 0) return 'marker-cluster_information';
    if (totals.u > 0) return 'marker-cluster_unknown';

    return '';
  }
}