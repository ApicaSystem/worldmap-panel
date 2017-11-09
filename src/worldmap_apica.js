import WorldMapOriginal from './worldmap';

export default class WorldMap extends WorldMapOriginal {
  // in table Location Data mode locationName is the value of the field which name is set in "Table Label Field".
  // can be set to any field from table datasource, so we just show it instead of the original that shows more than we want.
  createPopup(circle, locationName, value) {
    super.createPopup(circle, locationName, value);
    circle.unbindPopup();
    circle.bindPopup(locationName, {'offset': window.L.point(0, -2), 'className': 'worldmap-popup', 'closeButton': this.ctrl.panel.stickyLabels});
  }
}