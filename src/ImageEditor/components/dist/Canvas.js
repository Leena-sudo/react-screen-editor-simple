'use strict';
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
  };
exports.__esModule = true;
var react_1 = require('react');
var constant_1 = require('../constant');
var SvgDraw_1 = require('./SvgDraw');
var Toolbar_1 = require('./Toolbar');
var utils_1 = require('../utils/utils');
var Canvas = react_1.forwardRef(function (_a, ref) {
  var isDrag = _a.isDrag,
    toolbar = _a.toolbar,
    toolsRef = _a.toolsRef,
    imageType = _a.imageType,
    ratio = _a.ratio,
    lastDraw = _a.lastDraw,
    handelSelected = _a.handelSelected,
    handlePointDown = _a.handlePointDown,
    handleClose = _a.handleClose,
    handleDownload = _a.handleDownload,
    handleConfirm = _a.handleConfirm;
  var canvasRef = react_1.useRef();
  var combinedRef = utils_1.useCombinedRefs(ref, canvasRef);
  var svgRef = react_1.useRef(null);
  var actionsRef = react_1.useRef([]);
  var downLoc = react_1.useRef({ x: 0, y: 0 });
  var preLoc = react_1.useRef({ x: 0, y: 0 });
  var wordRef = react_1.useRef('');
  var curInfo = react_1.useRef(constant_1.initInfo);
  var iptRef = react_1.useRef(null);
  var pointListRef = react_1.useRef([]);
  var infoRef = react_1.useRef(constant_1.initInfo);
  var _b = react_1.useState(constant_1.initInfo),
    info = _b[0],
    setInfo = _b[1];
  var _c = react_1.useState(''),
    type = _c[0],
    setType = _c[1];
  var _d = react_1.useState([0, 0]),
    size = _d[0],
    setSize = _d[1];
  var _e = react_1.useState(false),
    isEdit = _e[0],
    setEdit = _e[1];
  var _f = react_1.useState(false),
    isSelect = _f[0],
    setSelect = _f[1];
  var _g = react_1.useState(''),
    word = _g[0],
    setWord = _g[1];
  var setInputPosition = function () {
    var iptEle = iptRef.current;
    var canvasEle = combinedRef.current;
    var context = canvasEle.getContext('2d');
    var _a = downLoc.current,
      x = _a.x,
      y = _a.y;
    var size = curInfo.current.size;
    var disX = x,
      disY = y;
    iptEle.style.height = Number(+size + 12) + 'px';
    if (+x < 0) {
      disX = 0;
    } else if (Number(x + iptEle.offsetWidth) > context.canvas.width) {
      disX = Number(context.canvas.width - iptEle.offsetWidth);
    }
    if (+y < 0) {
      disY = 0;
    } else if (y + iptEle.offsetHeight > context.canvas.height) {
      disY = context.canvas.height - iptEle.offsetHeight;
    }
    iptEle.focus();
    iptEle.style.position = 'absolute';
    iptEle.style.top = disY + 'px';
    iptEle.style.left = Number(disX + 4) + 'px';
  };
  var handleMove = function (moveEvent) {
    var svgEle = svgRef.current;
    var canvasEle = combinedRef.current;
    var curLoc = utils_1.getLocalOffset(canvasEle, moveEvent.clientX, moveEvent.clientY);
    if (!svgEle) return;
    var _a = utils_1.drawSvg(downLoc.current, curLoc, svgEle),
      w = _a[0],
      h = _a[1];
    setSize([w, h]);
  };
  var handleInputChange = function (e) {
    e.stopPropagation();
    e.preventDefault();
    var target = e.target;
    preLoc.current = downLoc.current;
    setWord(target.value);
  };
  var handleRemove = function (upEvent, curType) {
    var canvasEle = combinedRef.current;
    var curLoc = utils_1.getLocalOffset(canvasEle, upEvent.clientX, upEvent.clientY);
    var context = canvasEle.getContext('2d');
    actionsRef.current = __spreadArrays(actionsRef.current, [
      utils_1.drawSvgOnCanvas(curType, downLoc.current, curLoc, context, ratio, infoRef.current),
    ]);
    canvasEle.onmousemove = null;
    document.onmouseup = null;
  };
  var handleDrawRect = function (curType) {
    var canvasEle = combinedRef.current;
    var svgEle = svgRef.current;
    canvasEle.onmousedown = function (event) {
      var clientX = event.clientX,
        clientY = event.clientY;
      setEdit(true);
      downLoc.current = utils_1.getLocalOffset(canvasEle, clientX, clientY);
      canvasEle.onmousemove = handleMove;
      document.onmouseup = function (upEvent) {
        setEdit(false);
        setSize([0, 0]);
        handleRemove(upEvent, curType);
        if (svgEle) svgEle.onmousemove = null;
      };
    };
  };
  var handleDrawPen = function () {
    var canvasEle = combinedRef.current;
    var lastLoc;
    canvasEle.onmousedown = function (event) {
      setEdit(true);
      lastLoc = utils_1.getLocalOffset(canvasEle, event.clientX, event.clientY);
      var firstLoc = lastLoc;
      canvasEle.onmousemove = function (moveEvent) {
        var curLoc = utils_1.getLocalOffset(canvasEle, moveEvent.clientX, moveEvent.clientY);
        pointListRef.current = pointListRef.current.concat(curLoc);
        utils_1.drawLine(lastLoc, curLoc, canvasEle, ratio, curInfo.current);
        lastLoc = curLoc;
      };
      document.onmouseup = function () {
        setEdit(false);
        canvasEle.onmousemove = null;
        document.onmouseup = null;
        // draw history
        var drawAction = (function (points) {
          var _info = curInfo.current;
          return function () {
            points.reduce(function (acc, cur) {
              utils_1.drawLine(acc, cur, canvasEle, ratio, _info);
              return cur;
            }, firstLoc);
          };
        })(pointListRef.current);
        actionsRef.current = __spreadArrays(actionsRef.current, [drawAction]);
        pointListRef.current = [];
      };
    };
  };
  var handleDrawText = function () {
    var _info = curInfo.current;
    var canvasEle = combinedRef.current;
    canvasEle.onmousedown = function (event) {
      setEdit(true);
      downLoc.current = utils_1.getLocalOffset(canvasEle, event.clientX, event.clientY);
      var iptEle = iptRef.current;
      if (iptEle) {
        setInputPosition();
      }
      document.onmouseup = function () {
        if (wordRef.current.length > 0) {
          utils_1.drawText(canvasEle, preLoc.current, wordRef.current, ratio, _info);
          setEdit(false);
          wordRef.current = '';
        }
        actionsRef.current = __spreadArrays(actionsRef.current, [
          utils_1.drawText(canvasEle, preLoc.current, wordRef.current, ratio, _info),
        ]);
        document.onmouseup = null;
      };
    };
  };
  var handleDrawMosaic = function () {
    var canvasEle = combinedRef.current;
    canvasEle.onmousedown = function () {
      setEdit(true);
      canvasEle.onmousemove = function (moveEvent) {
        var curLoc = utils_1.getLocalOffset(canvasEle, moveEvent.clientX, moveEvent.clientY);
        utils_1.drawMosaic(canvasEle, curLoc, infoRef.current.size * ratio, ratio);
      };
      document.onmouseup = function () {
        setEdit(false);
        canvasEle.onmousemove = null;
        document.onmouseup = null;
      };
    };
  };
  var handleRevoke = function () {
    var curActions = actionsRef.current.slice(0, -1);
    if (!curActions.length) return;
    curActions.forEach(function (action) {
      return action && action();
    });
    actionsRef.current = curActions;
  };
  var handleDownloadImg = function () {
    var canvas = combinedRef.current;
    var dataURL = canvas.toDataURL('image/' + imageType);
    var aEle = document.createElement('a');
    aEle.href = dataURL;
    aEle.download = '' + utils_1.getTimeStamp();
    document.body.appendChild(aEle);
    aEle.click();
    aEle.remove();
    if (typeof handleDownload === 'function') {
      handleDownload(handleToolsClose);
    }
  };
  var handleToolsClose = function () {
    var canvasEle = combinedRef.current;
    // const curActions = (actionsRef.current = []);
    canvasEle.onmousemove = null;
    document.onmouseup = null;
    // curActions.forEach((action) => action && action());
    // actionsRef.current = curActions;
    setEdit(false);
    setSelect(false);
    setSize([0, 0]);
  };
  var handleCloseEditor = function () {
    handleToolsClose();
    if (typeof handleClose === 'function') {
      handleClose();
    }
  };
  var handleCopy = function () {
    var canvasEle = combinedRef.current;
    var urlData = canvasEle.toDataURL('image/' + imageType);
    if (typeof handleConfirm === 'function') {
      handleConfirm(urlData, handleToolsClose);
      return;
    }
    handleToolsClose();
  };
  var handleToolChange = function (curType) {
    handelSelected(true);
    setSelect(true);
    setType(curType);
    var canvasEle = combinedRef.current;
    switch (curType) {
      case 'rect':
      case 'circle':
        handleDrawRect(curType);
        break;
      case 'pen':
        handleDrawPen(curType);
        break;
      case 'text':
        handleDrawText(curType);
        break;
      case 'mosaic':
        handleDrawMosaic(curType);
        break;
      case 'revoke':
        handleRevoke();
        break;
      case 'download':
        handleDownloadImg();
        break;
      case 'close':
        handleCloseEditor();
        break;
      case 'right':
        handleCopy();
        break;
      default:
        document.onmouseup = function () {
          setEdit(false);
          canvasEle.onmousemove = null;
          document.onmouseup = null;
        };
    }
  };
  react_1.useEffect(
    function () {
      if ((type === 'rect' || type === 'circle') && isEdit) {
        var svgEle_1 = svgRef.current;
        svgEle_1.onmousemove = handleMove;
        return function () {
          svgEle_1.onmousemove = null;
        };
      }
      if (type === 'text' && isEdit && iptRef) {
        var canvasEle = combinedRef.current;
        curInfo.current = info;
        setInputPosition();
      }
    },
    [type, isEdit, handleMove, iptRef, info],
  );
  react_1.useEffect(
    function () {
      actionsRef.current = [lastDraw];
    },
    [lastDraw],
  );
  react_1.useEffect(
    function () {
      infoRef.current = info;
      curInfo.current = info;
    },
    [info, type],
  );
  react_1.useEffect(
    function () {
      wordRef.current = word;
    },
    [word],
  );
  return react_1['default'].createElement(
    'div',
    { className: constant_1.prefixCls + '-canvas-inner' },
    react_1['default'].createElement('canvas', {
      className: 'canvas',
      ref: combinedRef,
      width: '0',
      height: '0',
    }),
    (type === 'rect' || type === 'circle') &&
      isEdit &&
      react_1['default'].createElement(SvgDraw_1['default'], {
        ref: svgRef,
        type: type,
        width: size[0],
        height: size[1],
        stroke: info.color,
        strokeWidth: info.size,
      }),
    isDrag &&
      !isSelect &&
      react_1['default'].createElement(
        'div',
        { className: constant_1.prefixCls + '-drag' },
        react_1['default'].createElement('div', {
          className: 'point left-top',
          onMouseDown: function () {
            return handlePointDown(0);
          },
        }),
        react_1['default'].createElement('div', {
          className: 'point right-top',
          onMouseDown: function () {
            return handlePointDown(1);
          },
        }),
        react_1['default'].createElement('div', {
          className: 'point left-bottom',
          onMouseDown: function () {
            return handlePointDown(2);
          },
        }),
        react_1['default'].createElement('div', {
          className: 'point right-bottom',
          onMouseDown: function () {
            return handlePointDown(3);
          },
        }),
        react_1['default'].createElement('div', {
          className: 'point right-center',
          onMouseDown: function () {
            return handlePointDown(3, 'horizontal');
          },
        }),
        react_1['default'].createElement('div', {
          className: 'point left-center',
          onMouseDown: function () {
            return handlePointDown(2, 'horizontal');
          },
        }),
        react_1['default'].createElement('div', {
          className: 'point top-center',
          onMouseDown: function () {
            return handlePointDown(0, 'vertical');
          },
        }),
        react_1['default'].createElement('div', {
          className: 'point bottom-center',
          onMouseDown: function () {
            return handlePointDown(2, 'vertical');
          },
        }),
      ),
    type === 'text' &&
      isEdit &&
      react_1['default'].createElement('input', {
        ref: iptRef,
        type: 'text',
        onChange: handleInputChange,
      }),
    isDrag &&
      react_1['default'].createElement(Toolbar_1['default'], {
        info: info,
        type: type,
        ref: toolsRef,
        setInfo: setInfo,
        toolbar: toolbar,
        handelChange: handleToolChange,
      }),
  );
});
exports['default'] = Canvas;
