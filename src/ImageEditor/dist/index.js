'use strict';
exports.__esModule = true;
var classnames_1 = require('classnames');
var react_1 = require('react');
var Canvas_1 = require('./components/Canvas');
var constant_1 = require('./constant');
require('./index.less');
var type_1 = require('./type');
var utils_1 = require('./utils/utils');
var image = new Image();
var ImageEditor = function (_a) {
  var src = _a.src,
    width = _a.width,
    height = _a.height,
    className = _a.className,
    toolbar = _a.toolbar,
    onClose = _a.onClose,
    onDownload = _a.onDownload,
    onConfirm = _a.onConfirm;
  // state
  var _b = react_1.useState(type_1.Status.loading),
    status = _b[0],
    setStatus = _b[1];
  var _c = react_1.useState(constant_1.imageSize),
    size = _c[0],
    setSize = _c[1];
  var _d = react_1.useState(false),
    isDrag = _d[0],
    setDrag = _d[1];
  // const [isMove, setMove] = useState(false);
  var _e = react_1.useState(false),
    isSelected = _e[0],
    setSelected = _e[1];
  var _f = react_1.useState(function () {
      return function () {
        return {};
      };
    }),
    lastDraw = _f[0],
    setLastDraw = _f[1];
  // ref
  var dragRef = react_1.useRef(null);
  var magnifierContainerRef = react_1.useRef(null);
  var magnifierRef = react_1.useRef(null);
  var canvasContainerRef = react_1.useRef(null);
  var canvasRef = react_1.useRef(null);
  var ratioRef = react_1.useRef(1);
  var locRef = react_1.useRef({ x: 0, y: 0 });
  var toolsRef = react_1.useRef(null);
  var handelDragMove = function (event) {
    if (isDrag) {
      return;
    }
    var container = magnifierContainerRef.current;
    var magnifier = magnifierRef.current;
    var dragEle = dragRef.current;
    var clientX = event.clientX,
      clientY = event.clientY;
    var curOffset = utils_1.getLocalOffset(dragEle, clientX, clientY);
    utils_1.drawCutCanvas({
      image: image,
      container: container,
      magnifier: magnifier,
      locOffset: curOffset,
      ratioRef: ratioRef,
      event: event,
    });
  };
  var handlePointDown = function (type, direction) {
    var containerEle = canvasContainerRef.current;
    var dragEle = dragRef.current;
    var canvas = canvasRef.current;
    var canvasRect = canvas.getBoundingClientRect();
    var antiPoint = {
      x: canvasRect[constant_1.point[type][0]],
      y: canvasRect[constant_1.point[type][1]],
    };
    var curOffset = utils_1.getLocalOffset(dragEle, antiPoint.x, antiPoint.y);
    locRef.current = curOffset;
    var handlePointDragMove = function (moveEvent) {
      var lastX = direction && direction === 'vertical' ? canvasRect['left'] : moveEvent.clientX;
      var lastY =
        direction && direction === 'horizontal' ? canvasRect['bottom'] : moveEvent.clientY;
      var lastOffset = utils_1.getLocalOffset(dragEle, lastX, lastY);
      var curRect = utils_1.getLocRect(curOffset, lastOffset);
      var curDraw = utils_1.setDrawEffect({
        curRect: curRect,
        containerEle: containerEle,
        canvas: canvas,
        ratioRef: ratioRef,
        image: image,
      });
      return curDraw;
    };
    dragEle.onmousemove = handlePointDragMove;
    canvas.onmousemove = handlePointDragMove;
    document.onmouseup = function (upEvent) {
      setLastDraw(function () {
        return handlePointDragMove(upEvent);
      });
      dragEle.onmousemove = null;
      canvas.onmousemove = null;
      document.onmouseup = null;
      setDrag(true);
    };
  };
  react_1.useEffect(function () {
    image.onload = function () {
      setStatus(type_1.Status.loaded);
      setSize(utils_1.setImageSize(image, width, height));
    };
    image.onerror = function () {
      setStatus(type_1.Status.failed);
    };
  }, []);
  react_1.useEffect(
    function () {
      image.crossOrigin = 'anonymous';
      image.src = src;
    },
    [src],
  );
  react_1.useEffect(
    function () {
      ratioRef.current = image.width / size.width;
    },
    [size],
  );
  react_1.useEffect(
    function () {
      if (status !== type_1.Status.loaded) return;
      var dragEle = dragRef.current;
      var containerEle = canvasContainerRef.current;
      var canvas = canvasRef.current;
      if (isSelected) {
        dragEle.style.cursor = 'unset';
        canvas.style.cursor = 'unset';
        return;
      }
      var handleMouseDragMove = function (moveEvent) {
        var lastOffset = utils_1.getLocalOffset(dragEle, moveEvent.clientX, moveEvent.clientY);
        var curRect = utils_1.getLocRect(locRef.current, lastOffset);
        var curDraw = utils_1.setDrawEffect({
          curRect: curRect,
          containerEle: containerEle,
          canvas: canvas,
          ratioRef: ratioRef,
          image: image,
        });
        return curDraw;
      };
      dragEle.onmousedown = function (event) {
        var clientX = event.clientX,
          clientY = event.clientY;
        var curOffset = utils_1.getLocalOffset(dragEle, clientX, clientY);
        locRef.current = curOffset;
        setDrag(false);
        dragEle.onmousemove = handleMouseDragMove;
        document.onmouseup = function (event) {
          setLastDraw(function () {
            return handleMouseDragMove(event);
          });
          setDrag(true);
          dragEle.onmousemove = null;
          document.onmouseup = null;
        };
      };
      return function () {
        document.onmouseup = null;
        dragEle.onmousedown = null;
      };
    },
    [isSelected, status],
  );
  react_1.useEffect(
    function () {
      if (status !== type_1.Status.loaded) return;
      var dragEle = dragRef.current;
      var canvas = canvasRef.current;
      var context = canvas.getContext('2d');
      var containerEle = canvasContainerRef.current;
      var toolsEle = toolsRef.current;
      canvas.style.cursor = 'move';
      if (isSelected) {
        dragEle.style.cursor = 'unset';
        canvas.style.cursor = 'unset';
        return;
      }
      if (isDrag) {
        var canvasmove_1 = function (event) {
          event.preventDefault();
          var canvasRect = canvas.getBoundingClientRect();
          var _a = containerEle.getBoundingClientRect(),
            boxW = _a.width,
            boxH = _a.height;
          var ratio = ratioRef.current;
          var curLoc = utils_1.getLocalOffset(dragEle, event.clientX, event.clientY);
          var _b = locRef.current,
            x = _b.x,
            y = _b.y;
          var disOffet = {
            x: curLoc.x - x + parseFloat(containerEle.style.left || 0),
            y: curLoc.y - y + parseFloat(containerEle.style.top || 0),
          };
          if (disOffet.x < 0) {
            disOffet.x = 0;
          } else if (disOffet.x >= size.width - boxW) {
            disOffet.x = size.width - boxW;
          }
          if (disOffet.y < 0) {
            disOffet.y = 0;
          } else if (disOffet.y >= size.height - boxH) {
            disOffet.y = size.height - boxH;
          }
          containerEle.style.left = disOffet.x + 'px';
          containerEle.style.top = disOffet.y + 'px';
          locRef.current = curLoc;
          var curRect = [disOffet.x, disOffet.y, canvasRect.width, canvasRect.height];
          utils_1.setToolsLocPosition(canvas, toolsEle, dragEle);
          utils_1.setDrawImage({
            image: image,
            context: context,
            curRect: curRect,
            ratio: ratio,
          });
          return utils_1.setDrawImage;
        };
        canvas.onmousedown = function (event) {
          var firstLoc = utils_1.getLocalOffset(dragEle, event.clientX, event.clientY);
          locRef.current = firstLoc;
          canvas.onmousemove = canvasmove_1;
          document.onmouseup = function (upevent) {
            setLastDraw(function () {
              return canvasmove_1(upevent);
            });
            canvas.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    },
    [isDrag, status],
  );
  var style = {
    width: size.width + 'px',
    height: size.height + 'px',
  };
  return react_1['default'].createElement(
    react_1['default'].Fragment,
    null,
    react_1['default'].createElement(
      'div',
      { className: classnames_1['default']('' + constant_1.prefixCls, className), style: style },
      react_1['default'].createElement(
        'div',
        { className: constant_1.prefixCls + '-container' },
        react_1['default'].createElement('img', {
          src: src,
          alt: '',
          width: size.width,
          height: size.height,
        }),
        react_1['default'].createElement('div', {
          className: constant_1.prefixCls + '-mask',
          ref: dragRef,
          onMouseMove: handelDragMove,
        }),
        react_1['default'].createElement(
          'div',
          { className: constant_1.prefixCls + '-canvas', ref: canvasContainerRef },
          react_1['default'].createElement(Canvas_1['default'], {
            ref: canvasRef,
            isDrag: isDrag,
            toolsRef: toolsRef,
            ratio: ratioRef.current,
            lastDraw: lastDraw,
            toolbar: toolbar,
            handlePointDown: handlePointDown,
            handleClose: onClose,
            handelSelected: setSelected,
            handleDownload: onDownload,
            handleConfirm: onConfirm,
          }),
        ),
        !isDrag &&
          react_1['default'].createElement(
            'div',
            { className: constant_1.prefixCls + '-magnifier', ref: magnifierContainerRef },
            react_1['default'].createElement('canvas', {
              ref: magnifierRef,
              width: '0',
              height: '0',
            }),
          ),
      ),
    ),
  );
};
ImageEditor.defaultProps = {
  imageType: 'png',
  toolbar: {
    items: ['rect', 'circle', 'text', 'pen', 'mosaic'],
  },
};
exports['default'] = ImageEditor;
