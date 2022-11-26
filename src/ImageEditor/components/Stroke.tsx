import React from 'react';
import { prefixCls } from '../constant';
import ColorSetting from './ColorSetting';
import SelectSetting from './SelectSetting';
import StrokeSetting from './StrokeSetting';
interface Props {
  isStroke?: boolean;
  isColor?: boolean;
  isSelect?: boolean;
  info: { size: number; color: string };
  handleChange: ({ size, color }: { size?: number; color?: string }) => void;
}

const Stroke: React.FC<Props> = ({ isStroke, isColor, isSelect, info, handleChange }) => {
  return (
    <div className={`${prefixCls}-pop`}>
      {isStroke && (
        <StrokeSetting
          value={info.size}
          onChange={(value) => {
            handleChange(value);
          }}
        />
      )}
      {isSelect && (
        <SelectSetting
          value={info.size}
          onChange={(value) => {
            handleChange(value);
          }}
        />
      )}
      {isColor && (
        <ColorSetting
          value={info.color}
          onChange={(value) => {
            handleChange(value);
          }}
        />
      )}
    </div>
  );
};

Stroke.defaultProps = {
  isColor: false,
  isSelect: false,
  isStroke: true,
};

export default Stroke;
