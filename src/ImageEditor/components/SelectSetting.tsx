import classNames from 'classnames';
import React from 'react';

interface Props {
  value?: number | undefined;
  onChange: ({ size }: { size?: number }) => void;
}

const sizeOptions = {
  小: 4,
  中: 8,
  大: 16,
};

const SelectSetting: React.FC<Props> = ({ value, onChange }) => {
  return (
    <>
      {Object.keys(sizeOptions).map((item) => {
        return (
          <div className="size-item" key={item} onClick={() => {}}>
            <div
              className={classNames('font-item', {
                'tools-font-selected':
                  value !== undefined
                    ? +value === +sizeOptions[item as keyof typeof sizeOptions]
                    : false,
              })}
              onClick={() =>
                onChange({ size: Number(sizeOptions[item as keyof typeof sizeOptions]) })
              }
            >
              {item}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SelectSetting;
