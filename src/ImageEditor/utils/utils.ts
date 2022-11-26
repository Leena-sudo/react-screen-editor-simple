import React from 'react';
import type { ILoc } from '../type';
/**
 * getImageSize
 * @param image
 * @param width
 * @param height
 * @returns
 */
export const setImageSize = (
  image: HTMLImageElement,
  width = window.innerWidth,
  height = window.innerHeight,
) => {
  const scale = image.width / image.height;
  const trueScale = width / height;
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
export const getLocalOffset = (ele: HTMLElement, x: number, y: number, size = 10) => {
  const relative = ele.getBoundingClientRect();
  const { top, bottom, left, right, height, width } = relative;

  let curX: number;
  let curY: number;
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
export const drawCutCanvas = ({
  image,
  container,
  magnifier,
  locOffset,
  size = 10,
  ratioRef,
  event,
}: {
  image: HTMLImageElement;
  container: HTMLDivElement;
  magnifier: HTMLCanvasElement;
  locOffset: ILoc;
  size?: number;
  ratioRef?: React.RefObject<any>;
  event: React.MouseEvent | MouseEvent;
}) => {
  const context = magnifier.getContext('2d') as CanvasRenderingContext2D;
  const box = container.getBoundingClientRect();
  const { width, height } = box;
  const { x, y } = locOffset;
  const { clientX, clientY } = event;
  const ratio = ratioRef?.current;
  // const deviceRatio = Window.devicePixelRatio || 1
  const plugSize = size * 10;
  let disX: number;
  let disY: number;
  const holdNumber = 20;

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

  container.style.top = `${disY}px`;
  container.style.left = `${disX}px`;

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
export const getLocRect = (
  firstOffset: ILoc,
  lastOffset: ILoc,
): [number, number, number, number] => {
  const { x: curX, y: curY } = firstOffset;
  const { x: lastX, y: lastY } = lastOffset;
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
export const useCombinedRefs = (...refs: any) => {
  const targetRef = React.useRef();

  React.useEffect(() => {
    refs.forEach((ref: any) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};
/**
 * setDrawEffect 实时绘制 canvas
 * @param param {}
 */
export const setDrawEffect = ({
  curRect,
  lastOffset,
  containerEle,
  canvas,
  ratioRef,
  image,
}: {
  curRect: any;
  lastOffset?: ILoc;
  containerEle: HTMLDivElement;
  canvas: HTMLCanvasElement;
  ratioRef?: React.RefObject<any>;
  image: HTMLImageElement;
}) => {
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const [x, y, w, h] = curRect;
  const ratio = ratioRef?.current;
  canvas.width = w * ratio;
  canvas.height = h * ratio;

  Object.assign(canvas.style, {
    width: `${w}px`,
    height: `${h}px`,
  });
  Object.assign(containerEle.style, {
    top: `${y}px`,
    left: `${x}px`,
  });

  const draw = () => {
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
export const setDrawImage = ({
  image,
  context,
  curRect,
  ratio,
}: {
  image: HTMLImageElement;
  context: CanvasRenderingContext2D;
  curRect: any;
  ratio: number;
}) => {
  const [x, y, w, h] = curRect;
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
export const drawSvg = (firstLoc: ILoc, lastLoc: ILoc, svgEle: SVGElement) => {
  const [x, y, w, h] = getLocRect(firstLoc, lastLoc);
  svgEle.style.left = `${x}px`;
  svgEle.style.top = `${y}px`;

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
export const drawSvgOnCanvas = (
  type: string,
  firstLoc: ILoc,
  lastLoc: ILoc,
  context: CanvasRenderingContext2D,
  ratio: number,
  info: { size: number; color: string },
) => {
  const [x, y, w, h] = getLocRect(firstLoc, lastLoc);
  const { size, color } = info;
  const draw = () => {
    context.beginPath();
    const linW = size / 2;
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
export const drawText = (
  ele: HTMLCanvasElement,
  curLoc: ILoc,
  txt: any,
  ratio: number,
  info: { size: number; color: string },
) => {
  const context = ele.getContext('2d') as CanvasRenderingContext2D;
  const { x, y } = curLoc;
  const { size, color } = info;

  context.textBaseline = 'top';
  context.textAlign = 'left';
  context.font = `${Number((size + 10) * ratio)}px sans-serif`;
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
export const drawLine = (
  lastLoc: ILoc,
  curLoc: ILoc,
  ele: HTMLCanvasElement,
  ratio: number,
  info: { size: number; color: string },
) => {
  const context = ele.getContext('2d') as CanvasRenderingContext2D;
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
export const drawMosaic = (ele: HTMLCanvasElement, curLoc: ILoc, size: number, ratio: number) => {
  const context = ele.getContext('2d') as CanvasRenderingContext2D;
  const { width: cw, height: ch } = context.canvas;
  // 获取图像信息 得出一个Uint8ClampedArray的数组 arrayLength = w * h * 4
  const imgData = context.getImageData(0, 0, cw, ch).data;

  const w = Math.ceil(cw / size);
  const h = Math.ceil(ch / size);
  const x = curLoc.x * ratio;
  const y = curLoc.y * ratio;
  const pointList: { x: number; y: number; color: string }[] = [];

  //处理边界值
  const startRow = Math.max(0, Math.floor(x / size));
  let startCol = Math.max(0, Math.floor(y / size));
  const endRow = Math.min(w, Math.ceil(x / size));
  const endCol = Math.min(h, Math.ceil(y / size));
  while (startCol < endCol) {
    let row = startRow;
    let sum = { r: 0, g: 0, b: 0 };
    while (row < endRow) {
      row += 1;
      const index = startCol * w + row;
      const locX = (index % w) - 1;
      const locY = Math.floor(index / w);

      const dataIndex = Math.floor(locY * size) * cw + Math.floor(locX * size);

      //每4个是一个像素点的rgba值
      sum.r += imgData[dataIndex * 4];
      sum.g += imgData[dataIndex * 4 + 1];
      sum.b += imgData[dataIndex * 4 + 2];

      const color = rgbToHex(sum.r, sum.g, sum.b);

      if (!pointList.find((point) => point.x === x && point.y === y)) {
        pointList.push({ x: locX, y: locY, color });
      }
    }
    startCol += 1;
  }

  pointList.forEach((point) => {
    context.fillStyle = point.color;
    context.fillRect(point.x * size, point.y * size, size, size);
  });
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
const componentToHex = (c: any) => {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};
/**
 * getTimeStamp
 * @returns ''
 */
export const getTimeStamp = () => {
  return new Date().getTime();
};
/**
 * uuid
 * @returns uuid
 */
export const uuid = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};
