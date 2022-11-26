export const prefixCls = 'react-img-editor';

export const imageSize = {
  width: 0,
  height: 0,
};

export const point = {
  0: ['right', 'bottom'],
  1: ['left', 'bottom'],
  2: ['right', 'top'],
  3: ['left', 'top'],
};

export const initInfo = {
  size: 4,
  color: '#ff0000',
};

export const pluginsDefault = {
  positions: 'top',
  arrowColor: '#272323',
  arrowSize: 4,
  isColor: true,
  classNames: 'tools-item',
};

export const plugins = {
  rect: {
    ...pluginsDefault,
    isStroke: true,
    name: 'rect',
  },
  circle: {
    ...pluginsDefault,
    name: 'circle',
  },
  mosaic: {
    ...pluginsDefault,
    name: 'mosaic',
    isColor: false,
  },
  text: {
    ...pluginsDefault,
    name: 'text',
    isStroke: false,
    isSelect: true,
  },
  pen: {
    ...pluginsDefault,
    name: 'pen',
  },
};
export const actionBar = ['line', 'revoke', 'download', 'close', 'right'];
