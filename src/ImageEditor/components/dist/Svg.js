'use strict';
exports.__esModule = true;
var _icons_1 = require('@icons');
var classnames_1 = require('classnames');
var react_1 = require('react');
var Svg = function (_a) {
  var type = _a.type,
    pluginName = _a.pluginName;
  var renderIcon = {
    rect: react_1['default'].createElement(_icons_1.RectOutlined, {
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    circle: react_1['default'].createElement(_icons_1.CircleOutlined, {
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    pen: react_1['default'].createElement(_icons_1.PenOutlined, {
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    mosaic: react_1['default'].createElement(_icons_1.MosaicOutlined, {
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    text: react_1['default'].createElement(_icons_1.TextOutlined, {
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    revoke: react_1['default'].createElement(_icons_1.RevokeOutlined, { className: 'tools-icon' }),
    close: react_1['default'].createElement(_icons_1.CloseOutlined, { className: 'tools-icon' }),
    download: react_1['default'].createElement(_icons_1.DownloadOutlined, {
      className: 'tools-icon',
    }),
    right: react_1['default'].createElement(_icons_1.RightOutlined, { className: 'tools-icon' }),
  };
  // @ts-ignore
  return react_1['default'].createElement('div', null, renderIcon[pluginName]);
};
exports['default'] = Svg;
