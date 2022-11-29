// import {
//   CircleOutlined,
//   CloseOutlined,
//   DownloadOutlined,
//   MosaicOutlined,
//   PenOutlined,
//   RectOutlined,
//   RevokeOutlined,
//   RightOutlined,
//   TextOutlined,
// } from '@icons';
import { ReactComponent as CircleOutlined } from '../assets/svg/outlined/circle.svg';
import { ReactComponent as CloseOutlined } from '../assets/svg/outlined/close.svg';
import { ReactComponent as DownloadOutlined } from '../assets/svg/outlined/download.svg';
import { ReactComponent as MosaicOutlined } from '../assets/svg/outlined/mosaic.svg';
import { ReactComponent as PenOutlined } from '../assets/svg/outlined/pen.svg';
import { ReactComponent as RectOutlined } from '../assets/svg/outlined/rect.svg';
import { ReactComponent as RevokeOutlined } from '../assets/svg/outlined/revoke.svg';
import { ReactComponent as RightOutlined } from '../assets/svg/outlined/right.svg';
import { ReactComponent as TextOutlined } from '../assets/svg/outlined/text.svg';

import classNames from 'classnames';
import React from 'react';
interface Props {
  type?: string;
  pluginName: string;
}
const strokeSize = 20;

const Svg: React.FC<Props> = ({ type, pluginName }) => {
  const renderIcon = {
    rect: (
      <RectOutlined
        height={strokeSize}
        width={strokeSize}
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    circle: (
      <CircleOutlined
        height={strokeSize}
        width={strokeSize}
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    pen: (
      <PenOutlined
        height={strokeSize}
        width={strokeSize}
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    mosaic: (
      <MosaicOutlined
        height={strokeSize}
        width={strokeSize}
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    text: (
      <TextOutlined
        height={strokeSize}
        width={strokeSize}
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    revoke: <RevokeOutlined height={strokeSize} width={strokeSize} className={'tools-icon'} />,
    close: <CloseOutlined height={strokeSize} width={strokeSize} className="tools-icon" />,
    download: <DownloadOutlined height={strokeSize} width={strokeSize} className="tools-icon" />,
    right: <RightOutlined height={strokeSize} width={strokeSize} className="tools-icon" />,
  };
  // @ts-ignore
  return <div>{renderIcon[pluginName]}</div>;
};
export default Svg;
