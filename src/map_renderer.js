import './css/leaflet.css!';
import './css/MarkerCluster.css!';
import './css/MarkerCluster.Default.css!';
import WorldMap from './worldmap_apica';

export default function link(scope, elem, attrs, ctrl) {
  ctrl.events.on('render', () => {
    render();
    ctrl.renderingCompleted();
  });

  function render() {
    if (!ctrl.data) return;

    const mapContainer = elem.find('.mapcontainer');

    if (mapContainer[0].id.indexOf('{{') > -1) {
      return;
    }

    setTimeout(() => {
        if (!ctrl.map) {
          ctrl.map = new WorldMap(ctrl, mapContainer[0]);
        }

        ctrl.map.resize();

        if (ctrl.mapCenterMoved) ctrl.map.panToMapCenter();

        if (!ctrl.map.legend && ctrl.panel.showLegend) ctrl.map.createLegend();

        ctrl.map.drawCircles();
    }, 100);
  }
}
