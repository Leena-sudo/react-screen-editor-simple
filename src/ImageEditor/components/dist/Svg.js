'use strict';
exports.__esModule = true;
// import {
//   CircleOutlined,
//   CloseOutlined,
//   DownloadOutlined,
//   MosaicOutlined,
//   PenOutlined,
//   RectOutlined,
//   RevokeOutlined,
//   RightOutlined,
//   TextOutlined,
// } from '@icons';
var circle_svg_1 = require('../assets/svg/outlined/circle.svg');
var close_svg_1 = require('../assets/svg/outlined/close.svg');
var download_svg_1 = require('../assets/svg/outlined/download.svg');
var mosaic_svg_1 = require('../assets/svg/outlined/mosaic.svg');
var pen_svg_1 = require('../assets/svg/outlined/pen.svg');
var rect_svg_1 = require('../assets/svg/outlined/rect.svg');
var revoke_svg_1 = require('../assets/svg/outlined/revoke.svg');
var right_svg_1 = require('../assets/svg/outlined/right.svg');
var text_svg_1 = require('../assets/svg/outlined/text.svg');
var classnames_1 = require('classnames');
var react_1 = require('react');
var strokeSize = 20;
var Svg = function (_a) {
  var type = _a.type,
    pluginName = _a.pluginName;
  var renderIcon = {
    rect: react_1['default'].createElement(rect_svg_1.ReactComponent, {
      height: strokeSize,
      width: strokeSize,
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    circle: react_1['default'].createElement(circle_svg_1.ReactComponent, {
      height: strokeSize,
      width: strokeSize,
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    pen: react_1['default'].createElement(pen_svg_1.ReactComponent, {
      height: strokeSize,
      width: strokeSize,
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    mosaic: react_1['default'].createElement(mosaic_svg_1.ReactComponent, {
      height: strokeSize,
      width: strokeSize,
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    text: react_1['default'].createElement(text_svg_1.ReactComponent, {
      height: strokeSize,
      width: strokeSize,
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    revoke: react_1['default'].createElement(revoke_svg_1.ReactComponent, {
      height: strokeSize,
      width: strokeSize,
      className: 'tools-icon',
    }),
    close: react_1['default'].createElement(close_svg_1.ReactComponent, {
      height: strokeSize,
      width: strokeSize,
      className: 'tools-icon',
    }),
    download: react_1['default'].createElement(download_svg_1.ReactComponent, {
      height: strokeSize,
      width: strokeSize,
      className: 'tools-icon',
    }),
    right: react_1['default'].createElement(right_svg_1.ReactComponent, {
      height: strokeSize,
      width: strokeSize,
      className: 'tools-icon',
    }),
  };
  // @ts-ignore
  return react_1['default'].createElement('div', null, renderIcon[pluginName]);
};
exports['default'] = Svg;
