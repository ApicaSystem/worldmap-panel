'use strict';

System.register(['./worldmap'], function (_export, _context) {
  "use strict";

  var WorldMapOriginal, _createClass, _get, tileServers, WorldMap;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_worldmap) {
      WorldMapOriginal = _worldmap.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _get = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);

          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc) {
          return desc.value;
        } else {
          var getter = desc.get;

          if (getter === undefined) {
            return undefined;
          }

          return getter.call(receiver);
        }
      };

      tileServers = {
        'CartoDB Positron': { url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>', subdomains: 'abcd' },
        'CartoDB Dark': { url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>', subdomains: 'abcd' }
      };

      WorldMap = function (_WorldMapOriginal) {
        _inherits(WorldMap, _WorldMapOriginal);

        function WorldMap() {
          _classCallCheck(this, WorldMap);

          return _possibleConstructorReturn(this, (WorldMap.__proto__ || Object.getPrototypeOf(WorldMap)).apply(this, arguments));
        }

        _createClass(WorldMap, [{
          key: 'createPopup',
          value: function createPopup(circle, locationName, value) {
            _get(WorldMap.prototype.__proto__ || Object.getPrototypeOf(WorldMap.prototype), 'createPopup', this).call(this, circle, locationName, value);
            circle.unbindPopup();
            circle.bindPopup(locationName, { 'offset': window.L.point(0, -7), 'className': 'worldmap-popup', 'closeButton': this.ctrl.panel.stickyLabels });
          }
        }, {
          key: 'createMap',
          value: function createMap() {
            window.L.Icon.Default.imagePath = 'public/img';
            this.markers = [];
            this.legend = window.L.control({ position: 'bottomleft' });
            var mapCenter = window.L.latLng(parseFloat(this.ctrl.panel.mapCenterLatitude), parseFloat(this.ctrl.panel.mapCenterLongitude));
            this.map = window.L.map(this.mapContainer, { worldCopyJump: true, center: mapCenter }).fitWorld().zoomIn(parseInt(this.ctrl.panel.initialZoom, 10));
            this.map.panTo(mapCenter);
            this.map.scrollWheelZoom.disable();

            var selectedTileServer = tileServers[this.ctrl.tileServer];
            window.L.tileLayer(selectedTileServer.url, {
              maxZoom: 18,
              subdomains: selectedTileServer.subdomains,
              reuseTiles: true,
              detectRetina: true,
              attribution: selectedTileServer.attribution
            }).addTo(this.map);
          }
        }, {
          key: 'createCircles',
          value: function createCircles(data) {
            var _this2 = this;

            var self = this;

            var markers = window.L.markerClusterGroup({
              showCoverageOnHover: false,
              iconCreateFunction: function iconCreateFunction(cluster) {
                var markers = cluster.getAllChildMarkers();
                var severityClusterClass = self.getClassWithWorstSeverity(markers);

                return L.divIcon({ html: '<div><span>' + markers.length + '</span></div>', className: 'leaflet-marker-icon marker-cluster ' + severityClusterClass + ' leaflet-zoom-animated leaflet-clickable', iconSize: L.point(40, 40) });
              }
            });

            data.forEach(function (dataPoint) {
              var marker = new window.L.CircleMarker(new window.L.LatLng(dataPoint.locationLatitude, dataPoint.locationLongitude), {
                radius: _this2.calcCircleSize(dataPoint.value || 0),
                color: _this2.getColor(dataPoint.value),
                fillColor: _this2.getColor(dataPoint.value),
                fillOpacity: 0.5,
                locationName: dataPoint.locationName,
                countBySeverity: dataPoint.countBySeverity
              });

              _this2.createPopup(marker, dataPoint.summary, dataPoint.valueRounded);

              _this2.markers.push(markers.addLayer(marker));
            });

            markers.on('clustermouseover', function (e) {
              var locationPopupPartials = '';
              var total = { i: 0, w: 0, e: 0, f: 0, u: 0, total: 0 };
              var cluster = self.getClusterFromLayer(e);
              var children = e.layer.getAllChildMarkers();

              for (var i = 0; i < children.length; i++) {
                var child = children[i];

                child.options.countBySeverity.total = child.options.countBySeverity.i + child.options.countBySeverity.w + child.options.countBySeverity.e + child.options.countBySeverity.f + child.options.countBySeverity.u;

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
              label += locationPopupPartials;
              label += '</div>';

              cluster.unbindPopup();
              cluster.bindPopup(label, { 'offset': window.L.point(0, -20), 'className': 'worldmap-popup', 'closeButton': self.ctrl.panel.stickyLabels }).openPopup();
            });

            markers.on('clustermouseout', function (e) {
              if (!self.ctrl.panel.stickyLabels) {
                var cluster = self.getClusterFromLayer(e);

                cluster.closePopup();
              }
            });

            this.markerLayer = this.map.addLayer(markers);
          }
        }, {
          key: 'clearCircles',
          value: function clearCircles() {
            for (var i = 0; i < this.markers.length; i++) {
              this.markers[i].off('mouseover');
              this.markers[i].off('mouseout');
              this.map.removeLayer(this.markers[i]);
            }

            if (this.markerLayer) {
              this.map.removeLayer(this.markerLayer);
            }

            this.markers = [];
          }
        }, {
          key: 'createSummaryPopupPartial',
          value: function createSummaryPopupPartial(name, total) {
            return '<div class="summary-section">\n              <div class="summary-section__name">\n                ' + name + '\n              </div>\n              <div>\n                <span class="summary-section__description summary-section__description_total">Total</span>\n                <span class="summary-section__description summary-section__description_information">I</span>\n                <span class="summary-section__description summary-section__description_warning">W</span>\n                <span class="summary-section__description summary-section__description_error">E</span>\n                <span class="summary-section__description summary-section__description_fatal">F</span>\n                <span class="summary-section__description summary-section__description_unknow">U</span>\n              </div>\n              <div>\n                <span class="summary-section__severity summary-section__severity_total">' + total.total + '</span>\n                <span class="summary-section__severity summary-section__severity_information">' + total.i + '</span>\n                <span class="summary-section__severity summary-section__severity_warning">' + total.w + '</span>\n                <span class="summary-section__severity summary-section__severity_error">' + total.e + '</span>\n                <span class="summary-section__severity summary-section__severity_fatal">' + total.f + '</span>\n                <span class="summary-section__severity summary-section__severity_unknow">' + total.u + '</span>\n              </div>\n              <hr>\n            </div>';
          }
        }, {
          key: 'createLocationPopupPartial',
          value: function createLocationPopupPartial(name, total, needHr) {
            var hrBlock = needHr ? '<hr>' : '';

            return '<div class="location-section">\n              <div class="location-section__name">\n                ' + name + '\n              </div>\n              <div>\n                <span class="location-section__severity location-section__severity_total">' + total.total + '</span>\n                <span class="location-section__severity location-section__severity_information">' + total.i + '</span>\n                <span class="location-section__severity location-section__severity_warning">' + total.w + '</span>\n                <span class="location-section__severity location-section__severity_error">' + total.e + '</span>\n                <span class="location-section__severity location-section__severity_fatal">' + total.f + '</span>\n                <span class="location-section__severity location-section__severity_unknow">' + total.u + '</span>\n              </div>\n              ' + hrBlock + '\n            </div>';
          }
        }, {
          key: 'getClusterFromLayer',
          value: function getClusterFromLayer(e) {
            var marker = e.layer.getAllChildMarkers()[0];

            return e.target.getVisibleParent(marker);
          }
        }, {
          key: 'getClassWithWorstSeverity',
          value: function getClassWithWorstSeverity(markers) {
            var totals = { i: 0, w: 0, e: 0, f: 0, u: 0 };
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
        }]);

        return WorldMap;
      }(WorldMapOriginal);

      _export('default', WorldMap);
    }
  };
});
//# sourceMappingURL=worldmap_apica.js.map
