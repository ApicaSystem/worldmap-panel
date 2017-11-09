'use strict';

System.register(['./worldmap_ctrl'], function (_export, _context) {
  "use strict";

  var WorldmapCtrlOriginal, WorldmapCtrl;

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
    }],
    execute: function () {
      WorldmapCtrl = function (_WorldmapCtrlOriginal) {
        _inherits(WorldmapCtrl, _WorldmapCtrlOriginal);

        function WorldmapCtrl($scope, $injector, contextSrv) {
          _classCallCheck(this, WorldmapCtrl);

          return _possibleConstructorReturn(this, (WorldmapCtrl.__proto__ || Object.getPrototypeOf(WorldmapCtrl)).call(this, $scope, $injector, contextSrv));
        }

        return WorldmapCtrl;
      }(WorldmapCtrlOriginal);

      _export('default', WorldmapCtrl);
    }
  };
});
//# sourceMappingURL=worldmap_ctrl_apica.js.map
