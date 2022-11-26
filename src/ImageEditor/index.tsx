import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import Canvas from './components/Canvas';
import { imageSize, point, prefixCls } from './constant';
import type { ImageEditorBoxProps, RectInterface } from './type';
import { ILoc, Status } from './type';

import './index.less';
import {
  drawCutCanvas,
  getLocalOffset,
  getLocRect,
  setDrawEffect,
  setDrawImage,
  setImageSize,
} from './utils/utils';

const image = new Image();

const ImageEditor: React.FC<ImageEditorBoxProps> = ({
  src,
  width,
  height,
  className,
  holdSize,
  imageType,
  toolbar,
  onClose,
  onDownload,
  onConfirm,
}) => {
  // state
  const [status, setStatus] = useState(Status.loading);
  const [size, setSize] = useState(imageSize);
  const [isDrag, setDrag] = useState(false);
  const [isMove, setMove] = useState(false);
  const [isSelected, setSelected] = useState(false);
  const [lastDraw, setLastDraw] = useState<() => void>(() => () => {});

  // ref
  const dragRef = useRef<HTMLDivElement>(null);
  const magnifierContainerRef = useRef<HTMLDivElement>(null);
  const magnifierRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ratioRef = useRef<number>(1);
  const locRef = useRef<ILoc>({ x: 0, y: 0 });

  const handelDragMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDrag || isMove) {
      return;
    }
    const container = magnifierContainerRef.current as HTMLDivElement;
    const magnifier = magnifierRef.current as HTMLCanvasElement;
    const dragEle = dragRef.current as HTMLDivElement;

    const { clientX, clientY } = event;
    const curOffset = getLocalOffset(dragEle, clientX, clientY);
    drawCutCanvas({
      image,
      container,
      magnifier,
      locOffset: curOffset,
      ratioRef,
      event,
    });
  };

  const handlePointDown = (type: Number, direction?: 'horizontal' | 'vertical') => {
    const containerEle = canvasContainerRef.current as HTMLDivElement;
    const dragEle = dragRef.current as HTMLDivElement;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const canvasRect = canvas.getBoundingClientRect() as RectInterface;

    const antiPoint = {
      // @ts-ignore
      x: canvasRect[point[type][0] as keyof typeof RectInterface],
      // @ts-ignore
      y: canvasRect[point[type][1] as keyof typeof RectInterface],
    };

    const curOffset = getLocalOffset(dragEle, antiPoint.x, antiPoint.y);
    locRef.current = curOffset;

    const handlePointDragMove = (moveEvent: MouseEvent) => {
      const lastX = direction && direction === 'vertical' ? canvasRect['left'] : moveEvent.clientX;
      const lastY =
        direction && direction === 'horizontal' ? canvasRect['bottom'] : moveEvent.clientY;

      const lastOffset = getLocalOffset(dragEle, lastX, lastY);
      const curRect = getLocRect(curOffset, lastOffset);
      const curDraw = setDrawEffect({
        curRect,
        containerEle,
        canvas,
        ratioRef,
        image,
      });
      return curDraw;
    };
    dragEle.onmousemove = handlePointDragMove;
    canvas.onmousemove = handlePointDragMove;

    document.onmouseup = (upEvent: MouseEvent) => {
      setLastDraw(() => handlePointDragMove(upEvent));
      dragEle.onmousemove = null;
      canvas.onmousemove = null;
      document.onmouseup = null;
      setDrag(true);
    };
  };
  useEffect(() => {
    image.onload = () => {
      setStatus(Status.loaded);
      setSize(setImageSize(image, width, height));
    };
    image.onerror = () => {
      setStatus(Status.failed);
    };
  }, []);

  useEffect(() => {
    image.crossOrigin = 'anonymous';
    // @ts-ignore
    image.src = src;
  }, [src]);

  useEffect(() => {
    ratioRef.current = image.width / size.width;
  }, [size]);

  useEffect(() => {
    if (status !== Status.loaded) return;
    const dragEle = dragRef.current as HTMLDivElement;
    const containerEle = canvasContainerRef.current as HTMLDivElement;
    const canvas = canvasRef.current as HTMLCanvasElement;

    if (isSelected) {
      dragEle.style.cursor = 'unset';
      canvas.style.cursor = 'unset';
      return;
    }

    const handleMouseDragMove = (moveEvent: MouseEvent) => {
      const lastOffset = getLocalOffset(dragEle, moveEvent.clientX, moveEvent.clientY);
      const curRect = getLocRect(locRef.current, lastOffset);

      const curDraw = setDrawEffect({
        curRect,
        containerEle,
        canvas,
        ratioRef,
        image,
      });
      return curDraw;
    };

    dragEle.onmousedown = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const curOffset = getLocalOffset(dragEle, clientX, clientY);
      locRef.current = curOffset;
      setDrag(false);

      dragEle.onmousemove = handleMouseDragMove;
      document.onmouseup = (event: MouseEvent) => {
        setLastDraw(() => handleMouseDragMove(event));
        setDrag(true);
        dragEle.onmousemove = null;
        document.onmouseup = null;
      };
    };

    return () => {
      document.onmouseup = null;
      dragEle.onmousedown = null;
    };
  }, [isSelected, status]);

  useEffect(() => {
    if (status !== Status.loaded) return;

    const dragEle = dragRef.current as HTMLDivElement;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const containerEle = canvasContainerRef.current as HTMLDivElement;
    canvas.style.cursor = 'move';

    if (isSelected) {
      dragEle.style.cursor = 'unset';
      canvas.style.cursor = 'unset';
      return;
    }

    if (isDrag) {
      const canvasmove = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const canvasRect = canvas.getBoundingClientRect();
        const { width: boxW, height: boxH } = containerEle.getBoundingClientRect();

        const ratio = ratioRef.current;
        const curLoc = getLocalOffset(dragEle, event.clientX, event.clientY);
        const { x, y } = locRef.current;
        const disOffet = {
          // @ts-ignore
          x: curLoc.x - x + parseFloat(containerEle.style.left || 0),
          // @ts-ignore
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

        containerEle.style.left = `${disOffet.x}px`;
        containerEle.style.top = `${disOffet.y}px`;
        locRef.current = curLoc;
        const curRect = [disOffet.x, disOffet.y, canvasRect.width, canvasRect.height];

        setDrawImage({
          image,
          context,
          curRect,
          ratio,
        });
        return setDrawImage;
      };
      canvas.onmousedown = (event: MouseEvent) => {
        const firstLoc = getLocalOffset(dragEle, event.clientX, event.clientY);
        locRef.current = firstLoc;
        canvas.onmousemove = canvasmove;

        document.onmouseup = (upevent: MouseEvent) => {
          setLastDraw(() => canvasmove(upevent));
          canvas.onmousemove = null;
          document.onmouseup = null;
        };
      };
    }
  }, [isDrag, status]);

  const style = {
    width: `${size.width}px`,
    height: `${size.height}px`,
  };

  return (
    <>
      <div className={classNames(`${prefixCls}`, className)} style={style}>
        <div className={`${prefixCls}-container`}>
          <img src={src} alt="" width={size.width} height={size.height} />
          <div className={`${prefixCls}-mask`} ref={dragRef} onMouseMove={handelDragMove} />
          <div className={`${prefixCls}-canvas`} ref={canvasContainerRef}>
            <Canvas
              ref={canvasRef}
              isDrag={isDrag}
              ratio={ratioRef.current}
              lastDraw={lastDraw}
              toolbar={toolbar}
              handlePointDown={handlePointDown}
              handleClose={onClose}
              handelSelected={setSelected}
              handleDownload={onDownload}
              handleConfirm={onConfirm}
            />
          </div>
          {!isDrag && (
            <div className={`${prefixCls}-magnifier`} ref={magnifierContainerRef}>
              <canvas ref={magnifierRef} width="0" height="0" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
ImageEditor.defaultProps = {
  imageType: 'png',
  toolbar: {
    items: ['rect', 'circle', 'text', 'pen', 'mosaic'],
  },
};
export default ImageEditor;
