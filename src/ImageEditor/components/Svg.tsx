import {
  CircleAssets,
  CloseAssets,
  DownloadAssets,
  MosaicAssets,
  PenAssets,
  RectAssets,
  RevokeAssets,
  RightAssets,
  TextAssets,
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
      <RectAssets
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    circle: (
      <CircleAssets
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    pen: (
      <PenAssets
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    mosaic: (
      <MosaicAssets
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    text: (
      <TextAssets
        className={classNames('tools-icon', {
          'tool-selected': type === pluginName,
        })}
      />
    ),
    revoke: <RevokeAssets className={'tools-icon'} />,
    close: <CloseAssets className="tools-icon" />,
    download: <DownloadAssets className="tools-icon" />,
    right: <RightAssets className="tools-icon" />,
  };
  // @ts-ignore
  return <div>{renderIcon[pluginName]}</div>;
};
export default Svg;
