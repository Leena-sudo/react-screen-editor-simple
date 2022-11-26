import React from 'react';
import { prefixCls } from '../constant';
interface Props {
  type: string;
  width: number;
  height: number;
  stroke?: string;
  strokeWidth?: number;
}

const SvgDraw = React.forwardRef<any, Props>(
  ({ type, width, height, stroke, strokeWidth }, ref) => {
    return (
      <svg
        className={`${prefixCls}-svg-draw`}
        width={width}
        height={height}
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
      >
        {type === 'rect' && (
          <rect
            width={width}
            height={height}
            stroke={stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
          />
        )}
        {type === 'circle' && (
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width / 2}
            ry={height / 2}
            stroke={stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
          />
        )}
      </svg>
    );
  },
);

export default SvgDraw;
