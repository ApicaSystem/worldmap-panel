'use strict';

System.register(['app/plugins/sdk', './worldmap_ctrl_apica'], function (_export, _context) {
  "use strict";

  var loadPluginCss, WorldmapCtrl;
  return {
    setters: [function (_appPluginsSdk) {
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }, function (_worldmap_ctrl_apica) {
      WorldmapCtrl = _worldmap_ctrl_apica.default;
    }],
    execute: function () {
      /* eslint import/no-extraneous-dependencies: 0 */
      loadPluginCss({
        dark: 'plugins/apica-worldmap-panel-poc/css/worldmap.dark.css',
        light: 'plugins/apica-worldmap-panel-poc/css/worldmap.light.css'
      });

      /* eslint import/prefer-default-export: 0 */

      _export('PanelCtrl', WorldmapCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
