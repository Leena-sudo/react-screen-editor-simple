import classNames from 'classnames';
import React from 'react';

interface Props {
  value?: string;
  onChange: ({ color }: { color: string }) => void;
}
const colors = ['#ff0000', '#00b0f0', '#00b050', '#ffff00 ', '#7f7f7f', '#ffffff'];
const ColorSetting: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className={'color-container'}>
      {colors.map((el) => (
        <span
          key={el}
          className={classNames('color-item', { 'tools-color-selected': value === el })}
          style={{ backgroundColor: el }}
          onClick={() => onChange({ color: el })}
        />
      ))}
    </div>
  );
};
export default ColorSetting;
