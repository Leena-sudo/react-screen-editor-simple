'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
exports.__esModule = true;
var classnames_1 = require('classnames');
var react_1 = require('react');
var react_tiny_popover_1 = require('react-tiny-popover');
var constant_1 = require('../constant');
var utils_1 = require('../utils/utils');
var Stroke_1 = require('./Stroke');
var Svg_1 = require('./Svg');
var ToolBar = react_1.forwardRef(function (_a, ref) {
  var info = _a.info,
    type = _a.type,
    setInfo = _a.setInfo,
    toolbar = _a.toolbar,
    handelChange = _a.handelChange;
  var _b = react_1.useState(''),
    selected = _b[0],
    setSelected = _b[1];
  var toolsRef = react_1['default'].useRef(null);
  var combinedRef = utils_1.useCombinedRefs(ref, toolsRef);
  var handleClick = function (e, curType) {
    handelChange(curType);
    setSelected(curType);
  };
  var renderPlugin = function (plugin) {
    return react_1['default'].createElement(
      react_tiny_popover_1.Popover,
      {
        positions: plugin.positions,
        align: 'start',
        key: plugin.name,
        isOpen: selected === plugin.name,
        content: function (_a) {
          var childRect = _a.childRect,
            popoverRect = _a.popoverRect;
          return react_1['default'].createElement(
            react_tiny_popover_1.ArrowContainer,
            {
              position: plugin.positions,
              childRect: childRect,
              popoverRect: popoverRect,
              arrowColor: plugin.arrowColor,
              arrowSize: plugin.arrowSize,
            },
            react_1['default'].createElement(Stroke_1['default'], {
              info: info,
              isStroke: plugin.isStroke,
              isColor: plugin.isColor,
              isSelect: plugin.isSelect,
              handleChange: function (options) {
                setInfo(function (opt) {
                  return __assign(__assign({}, opt), options);
                });
              },
            }),
          );
        },
      },
      react_1['default'].createElement(
        'div',
        {
          className: classnames_1['default'](plugin.classNames),
          onClick: function (e) {
            return handleClick(e, plugin.name);
          },
        },
        react_1['default'].createElement(Svg_1['default'], { type: type, pluginName: plugin.name }),
      ),
    );
  };
  return react_1['default'].createElement(
    'div',
    { className: constant_1.prefixCls + '-tools', ref: combinedRef },
    toolbar.items.map(function (item) {
      return Object.keys(constant_1.plugins).map(function (plugin) {
        if (constant_1.plugins[plugin].name === item) {
          return renderPlugin(constant_1.plugins[plugin]);
        }
      });
      return null;
    }),
    constant_1.actionBar.map(function (action) {
      if (action === 'line') {
        return react_1['default'].createElement('div', { key: action, className: 'tools-line' });
      }
      return react_1['default'].createElement(
        'div',
        {
          className: classnames_1['default']('tools-item'),
          onClick: function (e) {
            return handleClick(e, action);
          },
          key: action,
        },
        react_1['default'].createElement(Svg_1['default'], { pluginName: action }),
      );
    }),
  );
});
exports['default'] = ToolBar;
