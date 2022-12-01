import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { initInfo, prefixCls } from '../constant';
import type { ILoc } from '../type';
import SvgDraw from './SvgDraw';
import ToolBar from './Toolbar';

import {
  drawLine,
  drawMosaic,
  drawSvg,
  drawSvgOnCanvas,
  drawText,
  getLocalOffset,
  getTimeStamp,
  useCombinedRefs,
} from '../utils/utils';

interface Props {
  isDrag: boolean;
  ratio: number;
  toolsRef: React.RefObject<HTMLDivElement>;
  imageType?: string;
  handlePointDown: unknown;
  toolbar: unknown;
  handelSelected: unknown;
  lastDraw: () => void;
  // eslint-disable-next-line no-unused-vars
  handleClose?: (close?: () => void) => void;
  handleDownload?: (close?: () => void) => void;
  handleConfirm?: (url?: string, close?: () => void) => void;
}

const Canvas = forwardRef<unknown, Props>(
  (
    {
      isDrag,
      toolbar,
      toolsRef,
      imageType,
      ratio,
      lastDraw,
      handelSelected,
      handlePointDown,
      handleClose,
      handleDownload,
      handleConfirm,
    },
    ref,
  ) => {
    const canvasRef = useRef();
    const combinedRef = useCombinedRefs(ref, canvasRef) as any;
    const svgRef = useRef<SVGElement>(null);
    const actionsRef = useRef<any[]>([]);
    const downLoc = useRef<ILoc>({ x: 0, y: 0 });
    const preLoc = useRef<ILoc>({ x: 0, y: 0 });
    const wordRef = useRef<string>('');
    const curInfo = useRef<{ size: number; color: string }>(initInfo);
    const iptRef = useRef<any>(null);
    const pointListRef = useRef<ILoc[]>([]);

    const infoRef = useRef<{ size: number; color: string }>(initInfo);
    const [info, setInfo] = useState<{ size: number; color: string }>(initInfo);
    const [type, setType] = useState('');
    const [size, setSize] = useState<[number, number]>([0, 0]);
    const [isEdit, setEdit] = useState(false);
    const [isSelect, setSelect] = useState(false);
    const [word, setWord] = useState('');

    const setInputPosition = () => {
      const iptEle = iptRef.current as HTMLInputElement;
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      const context = canvasEle.getContext('2d') as CanvasRenderingContext2D;
      const { x, y } = downLoc.current;
      const {
        current: { size },
      } = curInfo;

      let disX = x,
        disY = y;
      iptEle.style.height = `${Number(+size + 12)}px`;

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
      iptEle.style.top = `${disY}px`;
      iptEle.style.left = `${Number(disX + 4)}px`;
    };

    const handleMove = (moveEvent: MouseEvent) => {
      const svgEle = svgRef.current as SVGElement;
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      const curLoc = getLocalOffset(canvasEle, moveEvent.clientX, moveEvent.clientY);
      if (!svgEle) return;
      const [w, h] = drawSvg(downLoc.current, curLoc, svgEle);
      setSize([w, h]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      preLoc.current = downLoc.current;
      setWord(target.value);
    };

    const handleRemove = (upEvent: MouseEvent, curType: string) => {
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      const curLoc = getLocalOffset(canvasEle, upEvent.clientX, upEvent.clientY);
      const context = canvasEle.getContext('2d') as CanvasRenderingContext2D;

      actionsRef.current = [
        ...actionsRef.current,
        drawSvgOnCanvas(curType, downLoc.current, curLoc, context, ratio, infoRef.current),
      ];
      canvasEle.onmousemove = null;
      document.onmouseup = null;
    };
    const handleDrawRect = (curType: string) => {
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      const svgEle = svgRef.current as SVGElement;
      canvasEle.onmousedown = (event) => {
        const { clientX, clientY } = event;
        setEdit(true);
        downLoc.current = getLocalOffset(canvasEle, clientX, clientY);
        canvasEle.onmousemove = handleMove as any;
        document.onmouseup = (upEvent) => {
          setEdit(false);
          setSize([0, 0]);
          handleRemove(upEvent, curType);
          if (svgEle) svgEle.onmousemove = null;
        };
      };
    };
    const handleDrawPen = () => {
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      let lastLoc: ILoc;
      canvasEle.onmousedown = (event) => {
        setEdit(true);
        lastLoc = getLocalOffset(canvasEle, event.clientX, event.clientY);
        const firstLoc = lastLoc;

        canvasEle.onmousemove = (moveEvent) => {
          const curLoc = getLocalOffset(canvasEle, moveEvent.clientX, moveEvent.clientY);
          pointListRef.current = pointListRef.current.concat(curLoc);
          drawLine(lastLoc, curLoc, canvasEle, ratio, curInfo.current);
          lastLoc = curLoc;
        };
        document.onmouseup = () => {
          setEdit(false);
          canvasEle.onmousemove = null;
          document.onmouseup = null;
          // draw history
          const drawAction = ((points) => {
            const _info = curInfo.current;

            return () => {
              points.reduce((acc, cur) => {
                drawLine(acc, cur, canvasEle, ratio, _info);
                return cur;
              }, firstLoc);
            };
          })(pointListRef.current);

          actionsRef.current = [...actionsRef.current, drawAction];

          pointListRef.current = [];
        };
      };
    };
    const handleDrawText = () => {
      const _info = curInfo.current;
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      canvasEle.onmousedown = (event) => {
        setEdit(true);
        downLoc.current = getLocalOffset(canvasEle, event.clientX, event.clientY);
        const iptEle = iptRef.current as HTMLInputElement;
        if (iptEle) {
          setInputPosition();
        }
        document.onmouseup = () => {
          if (wordRef.current.length > 0) {
            drawText(canvasEle, preLoc.current, wordRef.current, ratio, _info);
            setEdit(false);
            wordRef.current = '';
          }
          actionsRef.current = [
            ...actionsRef.current,
            drawText(canvasEle, preLoc.current, wordRef.current, ratio, _info),
          ];
          document.onmouseup = null;
        };
      };
    };
    const handleDrawMosaic = () => {
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      canvasEle.onmousedown = () => {
        setEdit(true);
        canvasEle.onmousemove = (moveEvent) => {
          const curLoc = getLocalOffset(canvasEle, moveEvent.clientX, moveEvent.clientY);
          drawMosaic(canvasEle, curLoc, infoRef.current.size * ratio, ratio);
        };
        document.onmouseup = () => {
          setEdit(false);
          canvasEle.onmousemove = null;
          document.onmouseup = null;
        };
      };
    };
    const handleRevoke = () => {
      const curActions = actionsRef.current.slice(0, -1);
      if (!curActions.length) return;
      curActions.forEach((action) => action && action());
      actionsRef.current = curActions;
    };
    const handleDownloadImg = () => {
      const canvas = combinedRef.current as HTMLCanvasElement;
      const dataURL = canvas.toDataURL(`image/${imageType}`);
      const aEle = document.createElement('a');
      aEle.href = dataURL;
      aEle.download = `${getTimeStamp()}`;
      document.body.appendChild(aEle);
      aEle.click();
      aEle.remove();
      if (typeof handleDownload === 'function') {
        handleDownload(handleToolsClose);
      }
    };
    const handleToolsClose = () => {
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      // const curActions = (actionsRef.current = []);
      canvasEle.onmousemove = null;
      document.onmouseup = null;
      // curActions.forEach((action) => action && action());
      // actionsRef.current = curActions;
      setEdit(false);
      setSelect(false);
      setSize([0, 0]);
    };
    const handleCloseEditor = () => {
      handleToolsClose();
      if (typeof handleClose === 'function') {
        handleClose();
      }
    };

    const handleCopy = () => {
      const canvasEle = combinedRef.current as HTMLCanvasElement;
      const urlData = canvasEle.toDataURL(`image/${imageType}`);
      if (typeof handleConfirm === 'function') {
        handleConfirm(urlData, handleToolsClose);
        return;
      }
      handleToolsClose();
    };

    const handleToolChange = (curType: string) => {
      handelSelected(true);
      setSelect(true);
      setType(curType);
      const canvasEle = combinedRef.current as HTMLCanvasElement;
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
          document.onmouseup = () => {
            setEdit(false);
            canvasEle.onmousemove = null;
            document.onmouseup = null;
          };
      }
    };

    useEffect(() => {
      if ((type === 'rect' || type === 'circle') && isEdit) {
        const svgEle = svgRef.current as SVGElement;
        svgEle.onmousemove = handleMove;
        return () => {
          svgEle.onmousemove = null;
        };
      }

      if (type === 'text' && isEdit && iptRef) {
        const canvasEle = combinedRef.current as HTMLCanvasElement;
        curInfo.current = info;
        setInputPosition();
      }
    }, [type, isEdit, handleMove, iptRef, info]);

    useEffect(() => {
      actionsRef.current = [lastDraw];
    }, [lastDraw]);

    useEffect(() => {
      infoRef.current = info;
      curInfo.current = info;
    }, [info, type]);

    useEffect(() => {
      wordRef.current = word;
    }, [word]);

    return (
      <div className={`${prefixCls}-canvas-inner`}>
        <canvas className="canvas" ref={combinedRef} width="0" height="0" />
        {(type === 'rect' || type === 'circle') && isEdit && (
          <SvgDraw
            ref={svgRef}
            type={type}
            width={size[0]}
            height={size[1]}
            stroke={info.color}
            strokeWidth={info.size}
          />
        )}
        {isDrag && !isSelect && (
          <div className={`${prefixCls}-drag`}>
            <div className="point left-top" onMouseDown={() => handlePointDown(0)} />
            <div className="point right-top" onMouseDown={() => handlePointDown(1)} />
            <div className="point left-bottom" onMouseDown={() => handlePointDown(2)} />
            <div className="point right-bottom" onMouseDown={() => handlePointDown(3)} />
            <div
              className="point right-center"
              onMouseDown={() => handlePointDown(3, 'horizontal')}
            />
            <div
              className="point left-center"
              onMouseDown={() => handlePointDown(2, 'horizontal')}
            />
            <div className="point top-center" onMouseDown={() => handlePointDown(0, 'vertical')} />
            <div
              className="point bottom-center"
              onMouseDown={() => handlePointDown(2, 'vertical')}
            />
          </div>
        )}
        {type === 'text' && isEdit && (
          <input ref={iptRef} type="text" onChange={handleInputChange} />
        )}
        {isDrag && (
          <ToolBar
            info={info}
            type={type}
            ref={toolsRef}
            setInfo={setInfo}
            toolbar={toolbar}
            handelChange={handleToolChange}
          />
        )}
      </div>
    );
  },
);
export default Canvas;
