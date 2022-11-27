'use strict';
// import {
//   CircleAssets,
//   CloseAssets,
//   DownloadAssets,
//   MosaicAssets,
//   PenAssets,
//   RectAssets,
//   RevokeAssets,
//   RightAssets,
//   TextAssets,
// } from '@icons';
exports.__esModule = true;
var classnames_1 = require('classnames');
var react_1 = require('react');
var Svg = function (_a) {
  var type = _a.type,
    pluginName = _a.pluginName;
  var renderIcon = {
    rect: react_1['default'].createElement(RectAssets, {
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    circle: react_1['default'].createElement(CircleAssets, {
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    pen: react_1['default'].createElement(PenAssets, {
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    mosaic: react_1['default'].createElement(MosaicAssets, {
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    text: react_1['default'].createElement(TextAssets, {
      className: classnames_1['default']('tools-icon', {
        'tool-selected': type === pluginName,
      }),
    }),
    revoke: react_1['default'].createElement(RevokeAssets, { className: 'tools-icon' }),
    close: react_1['default'].createElement(CloseAssets, { className: 'tools-icon' }),
    download: react_1['default'].createElement(DownloadAssets, { className: 'tools-icon' }),
    right: react_1['default'].createElement(RightAssets, { className: 'tools-icon' }),
  };
  // @ts-ignore
  // return <div>{renderIcon[pluginName]}</div>;
  return react_1['default'].createElement(react_1['default'].Fragment, null);
};
exports['default'] = Svg;
