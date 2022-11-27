import {
  CircleOutlined,
  CloseOutlined,
  DownloadOutlined,
  MosaicOutlined,
  PenOutlined,
  RectOutlined,
  RevokeOutlined,
  RightOutlined,
  TextOutlined,
} from '@icons';

import classNames from 'classnames';
import React from 'react';
interface Props {
  type?: string;
  pluginName: string;
}

const Svg: React.FC<Props> = ({ type, pluginName }) => {
  const renderIcon = {
    rect: (
      <RectOutlined
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    circle: (
      <CircleOutlined
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    pen: (
      <PenOutlined
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    mosaic: (
      <MosaicOutlined
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    text: (
      <TextOutlined
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    revoke: <RevokeOutlined className={'tools-icon'} />,
    close: <CloseOutlined className="tools-icon" />,
    download: <DownloadOutlined className="tools-icon" />,
    right: <RightOutlined className="tools-icon" />,
  };
  // @ts-ignore
  return <div>{renderIcon[pluginName]}</div>;
};
export default Svg;
