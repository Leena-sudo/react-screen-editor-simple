import classNames from 'classnames';
import React from 'react';

interface Props {
  value?: number | undefined;
  onChange: ({ size }: { size?: number }) => void;
}

const sizeOptions = {
  small: 4,
  mid: 8,
  large: 16,
};

const StrokeSetting: React.FC<Props> = ({ value, onChange }) => {
  return (
    <>
      {Object.keys(sizeOptions).map((item) => {
        return (
          <div
            className="size-item"
            key={item}
            onClick={() => {
              onChange({ size: sizeOptions[item as keyof typeof sizeOptions] });
            }}
          >
            <div
              className={classNames(`stroke-${item}`, {
                'tools-size-selected':
                  value !== undefined
                    ? +value === sizeOptions[item as keyof typeof sizeOptions]
                    : false,
              })}
            />
          </div>
        );
      })}
    </>
  );
};
export default StrokeSetting;
