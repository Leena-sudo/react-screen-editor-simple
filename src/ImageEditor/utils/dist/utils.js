'use strict';
exports.__esModule = true;
exports.uuid =
  exports.getTimeStamp =
  exports.setToolsLocPosition =
  exports.rgbToHex =
  exports.drawMosaic =
  exports.drawLine =
  exports.drawText =
  exports.drawSvgOnCanvas =
  exports.drawSvg =
  exports.setDrawImage =
  exports.setDrawEffect =
  exports.useCombinedRefs =
  exports.getLocRect =
  exports.drawCutCanvas =
  exports.getLocalOffset =
  exports.setImageSize =
    void 0;
var react_1 = require('react');
/**
 * getImageSize
 * @param image
 * @param width
 * @param height
 * @returns
 */
exports.setImageSize = function (image, width, height) {
  if (width === void 0) {
    width = window.innerWidth;
  }
  if (height === void 0) {
    height = window.innerHeight;
  }
  var scale = image.width / image.height;
  var trueScale = width / height;
  if (scale !== trueScale) {
    if (image.width > image.height) {
      return {
        width: Math.floor(width),
        height: Math.floor(width / scale),
      };
    } else {
      return {
        width: Math.floor(height / scale),
        height: Math.floor(height),
      };
    }
  }
  return {
    width: Math.floor(width),
    height: Math.floor(height),
  };
};
/**
 * getLocalOffset 获取相对坐标
 * @param ele
 * @param x
 * @param y
 * @param size
 */
exports.getLocalOffset = function (ele, x, y, size) {
  if (size === void 0) {
    size = 10;
  }
  var relative = ele.getBoundingClientRect();
  var top = relative.top,
    bottom = relative.bottom,
    left = relative.left,
    right = relative.right;
  var curX;
  var curY;
  // 处理边界值
  if (x < left) {
    curX = 0;
  } else if (x > right) {
    curX = right;
  } else {
    curX = x - left;
  }
  if (y < top) {
    curY = 0;
  } else if (y > bottom) {
    curY = bottom;
  } else {
    curY = y - top;
  }
  return {
    x: curX,
    y: curY,
  };
};
/**
 * drawCutCanvas 绘制图形到canvas
 * @param param {}
 */
exports.drawCutCanvas = function (_a) {
  var image = _a.image,
    container = _a.container,
    magnifier = _a.magnifier,
    locOffset = _a.locOffset,
    _b = _a.size,
    size = _b === void 0 ? 10 : _b,
    ratioRef = _a.ratioRef,
    event = _a.event;
  var context = magnifier.getContext('2d');
  var box = container.getBoundingClientRect();
  var width = box.width,
    height = box.height;
  var x = locOffset.x,
    y = locOffset.y;
  var clientX = event.clientX,
    clientY = event.clientY;
  var ratio = ratioRef === null || ratioRef === void 0 ? void 0 : ratioRef.current;
  // const deviceRatio = Window.devicePixelRatio || 1
  var plugSize = size * 10;
  var disX;
  var disY;
  var holdNumber = 20;
  //set container style
  magnifier.width = plugSize;
  magnifier.height = plugSize;
  if (window.innerWidth - clientX - width - holdNumber < 0) {
    disX = x - width - holdNumber;
  } else {
    disX = x + holdNumber;
  }
  if (window.innerHeight - clientY - height - holdNumber < 0) {
    disY = y - height - holdNumber;
  } else {
    disY = y + holdNumber;
  }
  container.style.top = disY + 'px';
  container.style.left = disX + 'px';
  context.drawImage(
    image,
    (disX - holdNumber) * ratio,
    (disY - holdNumber) * ratio,
    size * 1.5 * ratio,
    size * 1.5 * ratio,
    0,
    0,
    plugSize,
    plugSize,
  );
};
/**
 * getLocRect
 * @param firstOffset Object {x,y}
 * @param lastOffset Object {x,y}
 * @returns [x,y,w,h]
 */
exports.getLocRect = function (firstOffset, lastOffset) {
  var curX = firstOffset.x,
    curY = firstOffset.y;
  var lastX = lastOffset.x,
    lastY = lastOffset.y;
  return [
    Math.min(lastX, curX),
    Math.min(lastY, curY),
    Math.abs(lastX - curX),
    Math.abs(lastY - curY),
  ];
};
/**
 * useCombinedRefs 更新ref
 * @param refs
 * @returns
 */
exports.useCombinedRefs = function () {
  var refs = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    refs[_i] = arguments[_i];
  }
  var targetRef = react_1['default'].useRef();
  react_1['default'].useEffect(
    function () {
      refs.forEach(function (ref) {
        if (!ref) return;
        if (typeof ref === 'function') {
          ref(targetRef.current);
        } else {
          ref.current = targetRef.current;
        }
      });
    },
    [refs],
  );
  return targetRef;
};
/**
 * setDrawEffect 实时绘制 canvas
 * @param param {}
 */
exports.setDrawEffect = function (_a) {
  var curRect = _a.curRect,
    containerEle = _a.containerEle,
    canvas = _a.canvas,
    ratioRef = _a.ratioRef,
    image = _a.image;
  var context = canvas.getContext('2d');
  var x = curRect[0],
    y = curRect[1],
    w = curRect[2],
    h = curRect[3];
  var ratio = ratioRef === null || ratioRef === void 0 ? void 0 : ratioRef.current;
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  Object.assign(canvas.style, {
    width: w + 'px',
    height: h + 'px',
  });
  Object.assign(containerEle.style, {
    top: y + 'px',
    left: x + 'px',
  });
  var draw = function () {
    context.drawImage(
      image,
      x * ratio,
      y * ratio,
      w * ratio,
      h * ratio,
      0,
      0,
      w * ratio,
      h * ratio,
    );
  };
  draw();
  return draw;
};
/**
 * setDrawImage
 * @param param0
 * @returns
 */
exports.setDrawImage = function (_a) {
  var image = _a.image,
    context = _a.context,
    curRect = _a.curRect,
    ratio = _a.ratio;
  var x = curRect[0],
    y = curRect[1],
    w = curRect[2],
    h = curRect[3];
  return context.drawImage(
    image,
    x * ratio,
    y * ratio,
    w * ratio,
    h * ratio,
    0,
    0,
    w * ratio,
    h * ratio,
  );
};
/**
 * drawSvg
 * @returns []
 */
exports.drawSvg = function (firstLoc, lastLoc, svgEle) {
  var _a = exports.getLocRect(firstLoc, lastLoc),
    x = _a[0],
    y = _a[1],
    w = _a[2],
    h = _a[3];
  svgEle.style.left = x + 'px';
  svgEle.style.top = y + 'px';
  return [w, h];
};
/**
 * drawSvgOnCanvas 绘制矩形或圆形
 * @param type 类型
 * @param firstLoc 位置
 * @param lastLoc 当前位置
 * @param context canvas容器
 * @param ratio 收缩比率
 * @param info
 * @returns
 */
exports.drawSvgOnCanvas = function (type, firstLoc, lastLoc, context, ratio, info) {
  var _a = exports.getLocRect(firstLoc, lastLoc),
    x = _a[0],
    y = _a[1],
    w = _a[2],
    h = _a[3];
  var size = info.size,
    color = info.color;
  var draw = function () {
    context.beginPath();
    var linW = size / 2;
    if (type === 'rect') {
      context.lineJoin = 'round';
      context.rect(x * ratio + linW, y * ratio, w * ratio, h * ratio);
    } else {
      context.ellipse(
        x * ratio + (w / 2) * ratio,
        y * ratio + (h / 2) * ratio,
        (w / 2) * ratio,
        (h / 2) * ratio,
        0,
        0,
        2 * Math.PI,
      );
    }
    context.strokeStyle = color;
    context.lineWidth = size * ratio;
    context.stroke();
    context.closePath();
  };
  draw();
  return draw;
};
/**
 * drawText 绘制文字
 * @param ele
 * @param curLoc
 * @param txt
 * @param info
 */
exports.drawText = function (ele, curLoc, txt, ratio, info) {
  var context = ele.getContext('2d');
  var x = curLoc.x,
    y = curLoc.y;
  var size = info.size,
    color = info.color;
  context.textBaseline = 'top';
  context.textAlign = 'left';
  context.font = Number((size + 10) * ratio) + 'px sans-serif';
  context.fillStyle = color;
  context.fillText(txt, x - 4, y - 4);
};
/**
 * drawLine 绘图
 * @param lastLoc
 * @param curLoc
 * @param ele
 * @param ratio
 * @param info
 */
exports.drawLine = function (lastLoc, curLoc, ele, ratio, info) {
  var context = ele.getContext('2d');
  context.beginPath();
  context.moveTo(lastLoc.x * ratio, lastLoc.y * ratio);
  context.lineTo(curLoc.x * ratio, curLoc.y * ratio);
  context.lineWidth = info.size * ratio;
  context.strokeStyle = info.color;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.stroke();
};
/**
 * drawMosaic 绘制马赛克
 * @param ele
 * @param curLoc
 * @param size
 */
exports.drawMosaic = function (ele, curLoc, size, ratio) {
  var context = ele.getContext('2d');
  var _a = context.canvas,
    cw = _a.width,
    ch = _a.height;
  // 获取图像信息 得出一个Uint8ClampedArray的数组 arrayLength = w * h * 4
  var imgData = context.getImageData(0, 0, cw, ch).data;
  var w = Math.ceil(cw / size);
  var h = Math.ceil(ch / size);
  var x = curLoc.x * ratio;
  var y = curLoc.y * ratio;
  var pointList = [];
  //处理边界值
  var startRow = Math.max(0, Math.floor(x / size));
  var startCol = Math.max(0, Math.floor(y / size));
  var endRow = Math.min(w, Math.ceil(x / size));
  var endCol = Math.min(h, Math.ceil(y / size));
  while (startCol < endCol) {
    var row = startRow;
    var sum = { r: 0, g: 0, b: 0 };
    while (row < endRow) {
      row += 1;
      var index = startCol * w + row;
      var locX = (index % w) - 1;
      var locY = Math.floor(index / w);
      var dataIndex = Math.floor(locY * size) * cw + Math.floor(locX * size);
      //每4个是一个像素点的rgba值
      sum.r += imgData[dataIndex * 4];
      sum.g += imgData[dataIndex * 4 + 1];
      sum.b += imgData[dataIndex * 4 + 2];
      var color = exports.rgbToHex(sum.r, sum.g, sum.b);
      if (
        !pointList.find(function (point) {
          return point.x === x && point.y === y;
        })
      ) {
        pointList.push({ x: locX, y: locY, color: color });
      }
    }
    startCol += 1;
  }
  pointList.forEach(function (point) {
    context.fillStyle = point.color;
    context.fillRect(point.x * size, point.y * size, size, size);
  });
};
exports.rgbToHex = function (r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
var componentToHex = function (c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};
/**
 *setToolsLocPosition 设置工具栏位置
 * @param canvasEle
 * @param toolsEle
 * @param toolsLoc
 * @param parentH
 */
exports.setToolsLocPosition = function (canvasEle, toolsEle, dragEle) {
  var canvasRect = canvasEle.getBoundingClientRect();
  var toolsRect = toolsEle.getBoundingClientRect();
  var dragRect = dragEle.getBoundingClientRect();
  var gapSpace = 16;
  var disTop = canvasRect.top - dragRect.top;
  var disLeft = canvasRect.left - dragRect.left;
  var toolsHeight = gapSpace + toolsRect.height;
  if (dragRect.height - disTop - canvasRect.height < toolsHeight && disTop > toolsHeight) {
    //底部高度不够顶部高度够
    Object.assign(toolsEle.style, {
      top: -gapSpace - toolsRect.height + 'px',
      bottom: 'unset',
    });
  } else if (dragRect.height - disTop - canvasRect.height < toolsHeight && disTop < toolsHeight) {
    //底部和顶部高度都不够
    Object.assign(toolsEle.style, {
      top: 'unset',
      bottom: gapSpace + 'px',
    });
  } else if (dragRect.height - disTop - canvasRect.height > toolsHeight) {
    Object.assign(toolsEle.style, {
      top: 'unset',
      bottom: -gapSpace - toolsRect.height + 'px',
    });
  }
  if (disLeft <= toolsRect.width - canvasRect.width) {
    Object.assign(toolsEle.style, { left: '0px', right: 'unset' });
  } else {
    Object.assign(toolsEle.style, { right: '0px', left: 'unset' });
  }
};
/**
 * getTimeStamp
 * @returns ''
 */
exports.getTimeStamp = function () {
  return new Date().getTime();
};
/**
 * uuid
 * @returns uuid
 */
exports.uuid = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};
