import WorldmapCtrlOriginal from './worldmap_ctrl';

import $ from 'jquery';

const panelDefaultsApica = {
  locationData: 'table',
  tableLabel: 'summaryHtml',
  circleMinSize: 5,
  circleMaxSize: 5,
  showLegend: false,

  thresholds: '1,2,3,4',
  colors: [
    'rgba(90, 98, 90, 0.9)',
    'rgba(50, 172, 45, 0.97)',
    'rgba(224, 210, 0, 0.97)',
    'rgba(237, 129, 40, 0.89)',
    'rgba(245, 54, 54, 0.9)'
  ]
};

const editTabIndex = 2;

export default class WorldmapCtrl extends WorldmapCtrlOriginal {

  constructor($scope, $injector, contextSrv) {
    super($scope, $injector, contextSrv);

    // tableLabel is not initiated in parent by default, so this is the mark that here we should init Apica checks summary by location format. 
    if (!this.panel.tableLabel) {
      _.assign(this.panel, _.cloneDeep(panelDefaultsApica));
    }

    this.events.on('render', this.tweakOriginalEditor.bind(this));
    this.events.on('refresh', this.tweakOriginalEditor.bind(this));
  }

  onInitEditMode() {
    // tab will be added as a tag with name 'panel-editor-tab-{pluginId}{editTabIndex}', for example: <panel-editor-tab-apica-worldmap-panel-poc2> 
    this.addEditorTab('Worldmap', `public/plugins/${this.pluginId}/partials/editor.html`, editTabIndex);
  }

  changeTab(newIndex) {
    super.changeTab(newIndex);
    this.tweakOriginalEditor();
  }

  tweakOriginalEditor() {
    let editTabElementName = `panel-editor-tab-${this.pluginId}${editTabIndex}`;
    setTimeout(() => {
      // hide not useless Map Visual Options:
      // - Max Circle Size - circle sizes should be the same for now
      // - Decimals - metric is used for the color, so decimals settings is useless
      // - Unit - same as Decimals
      // - Show Legend - legend shows metric values, but they as color codes are useless
      // - Location Data - should always be 'table' (ASM Datasource provides data in table format)
      // - Aggregation - not used, 'metric' property from data source is always used
      $(`.tabbed-view-body ${editTabElementName}`)
        .find(`
          input[ng-model="ctrl.panel.circleMaxSize"],
          input[ng-model="ctrl.panel.decimals"],
          input[ng-model="ctrl.panel.unitSingular"],
          gf-form-switch[checked="ctrl.panel.showLegend"],
          select[ng-model="ctrl.panel.locationData"],
          select[ng-model="ctrl.panel.valueName"]
        `).closest('.gf-form').hide();

      // hide not useless Map Visual Options:
      // - Threshold Options (Thresholds, Colors) - thresholds are used for circles coloring that 
      // - Hide series (With only nulls, With only zeros)
      $(`.tabbed-view-body ${editTabElementName}`)
        .find(`
          input[ng-model="ctrl.panel.thresholds"],
          gf-form-switch[checked="ctrl.panel.hideEmpty"]
        `).closest('.gf-form-group').hide();
    }, 100);
  }
  
  render() {
    // different circle sizes in current implementation has no sence, so we adjust them to be equal.
    this.panel.circleMaxSize = this.panel.circleMinSize;
    super.render();
  }
}