'use strict';

System.register(['./worldmap_ctrl', 'jquery'], function (_export, _context) {
  "use strict";

  var WorldmapCtrlOriginal, $, _createClass, _get, panelDefaultsApica, editTabIndex, WorldmapCtrl;

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
    setters: [function (_worldmap_ctrl) {
      WorldmapCtrlOriginal = _worldmap_ctrl.default;
    }, function (_jquery) {
      $ = _jquery.default;
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

      panelDefaultsApica = {
        locationData: 'table',
        tableLabel: 'summaryHtml',
        circleMinSize: 5,
        circleMaxSize: 5,
        showLegend: false,
        stickyLabels: true,
        thresholds: '1,2,3,4',
        colors: ['rgba(90, 98, 90, 0.9)', 'rgba(50, 172, 45, 0.97)', 'rgba(224, 210, 0, 0.97)', 'rgba(237, 129, 40, 0.89)', 'rgba(245, 54, 54, 0.9)']
      };
      editTabIndex = 2;

      WorldmapCtrl = function (_WorldmapCtrlOriginal) {
        _inherits(WorldmapCtrl, _WorldmapCtrlOriginal);

        function WorldmapCtrl($scope, $injector, contextSrv) {
          _classCallCheck(this, WorldmapCtrl);

          var _this = _possibleConstructorReturn(this, (WorldmapCtrl.__proto__ || Object.getPrototypeOf(WorldmapCtrl)).call(this, $scope, $injector, contextSrv));

          // tableLabel is not initiated in parent by default, so this is the mark that here we should init Apica checks summary by location format. 
          if (!_this.panel.tableLabel) {
            _.assign(_this.panel, _.cloneDeep(panelDefaultsApica));
          }
          return _this;
        }

        _createClass(WorldmapCtrl, [{
          key: 'onDataSnapshotLoad',
          value: function onDataSnapshotLoad(snapshotData) {
            var _this2 = this;

            _get(WorldmapCtrl.prototype.__proto__ || Object.getPrototypeOf(WorldmapCtrl.prototype), 'onDataSnapshotLoad', this).call(this, snapshotData);
            // a hack to make sure that map is initialized (it doesn't happen in time when work in snapshot mode) 
            if (!this.map) {
              setTimeout(function () {
                _this2.render();
              }, 100);
            }
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            // tab will be added as a tag with name 'panel-editor-tab-{pluginId}{editTabIndex}', for example: <panel-editor-tab-apica-worldmap-panel2> 
            this.addEditorTab('Worldmap', 'public/plugins/' + this.pluginId + '/partials/editor.html', editTabIndex);
          }
        }, {
          key: 'initCtrl',
          value: function initCtrl() {
            var editTabElementName = 'panel-editor-tab-' + this.pluginId + editTabIndex;
            // hide not useless Map Visual Options:
            // - Max Circle Size - circle sizes should be the same for now
            // - Decimals - metric is used for the color, so decimals settings is useless
            // - Unit - same as Decimals
            // - Show Legend - legend shows metric values, but they as color codes are useless
            // - Location Data - should always be 'table' (ASM Datasource provides data in table format)
            // - Aggregation - not used, 'metric' property from data source is always used
            $('.tabbed-view-body ' + editTabElementName).find('\n        input[ng-model="ctrl.panel.circleMaxSize"],\n        input[ng-model="ctrl.panel.decimals"],\n        input[ng-model="ctrl.panel.unitSingular"],\n        gf-form-switch[checked="ctrl.panel.showLegend"],\n        select[ng-model="ctrl.panel.locationData"],\n        select[ng-model="ctrl.panel.valueName"]\n      ').closest('.gf-form').hide();

            // hide not useless Map Visual Options:
            // - Threshold Options (Thresholds, Colors) - thresholds are used for circles coloring that 
            // - Hide series (With only nulls, With only zeros)
            $('.tabbed-view-body ' + editTabElementName).find('\n        input[ng-model="ctrl.panel.thresholds"],\n        gf-form-switch[checked="ctrl.panel.hideEmpty"]\n      ').closest('.gf-form-group').hide();

            $('.tabbed-view-body ' + editTabElementName + ' input[ng-model="ctrl.panel.circleMinSize"]').siblings('.gf-form-label').text('Circle Size');

            // Editor is hidden by default. Make it visible.
            $('.tabbed-view-body ' + editTabElementName + ' .editor-row').show();
          }
        }, {
          key: 'render',
          value: function render() {
            // different circle sizes in current implementation has no sence, so we adjust them to be equal.
            this.panel.circleMaxSize = this.panel.circleMinSize;
            _get(WorldmapCtrl.prototype.__proto__ || Object.getPrototypeOf(WorldmapCtrl.prototype), 'render', this).call(this);
          }
        }]);

        return WorldmapCtrl;
      }(WorldmapCtrlOriginal);

      _export('default', WorldmapCtrl);

      // note that plugin id (apica-worldmap-panel) is hardcoded here as templateUrl is static
      // it isn't clear how to avoid hardcode (like it was done in the constructor using $scope.ctrl.pluginId)
      // from grafana hosting all plugins will be available from linear structure, no matter how they actually added into physical plugins folder.
      // this way ('../../plugins/pluginid/resource) we make sure plugin will work even if it's included in an app plugin sub-folder.  
      WorldmapCtrl.templateUrl = '../../plugins/apica-worldmap-panel/module.html';
    }
  };
});
//# sourceMappingURL=worldmap_ctrl_apica.js.map
