export type PluginParamName = 'strokeWidth' | 'color' | 'fontSize';

export interface PluginParamValue {
  strokeWidth?: number;
  color?: string;
  fontSize?: number;
}

export type ILoc = {
  x: number;
  y: number;
};

export interface BaseImageEditorBoxPropsProps {
  /**
   * @default true
   * @description  图片 url
   */
  src: string;
  /**
   * @description  画板宽度
   */
  width?: number;
  /**
   * @description  画板高度
   */
  height?: number;
  /**
   * @description  自定义类名
   */
  className?: string;
  // /**
  //  * @description  放大镜大小(x 10)
  //  */
  // locSize?: number;
  // /**
  //  * @description 图片加载时, 占位 svg 宽高
  //  */
  // holdSize?: { w: number | string; h: number | string };
  /**
   * @description 下载图片的类型
   */
  imageType?: string;
  /**
   * @description 工具栏配置
   */
  toolbar?: { items: ['rect', 'circle', 'text', 'pen', 'mosaic'] };
  /**
   * @description 关闭
   */
  onClose?: (close?: () => void) => void;
  /**
   * @description 下载
   */
  onDownload?: (close?: () => void) => void;
  /**
   * @description 确认
   */
  onConfirm?: (url?: string, close?: () => void) => void;
}

export type ImageEditorBoxProps = Partial<BaseImageEditorBoxPropsProps>;

export enum Status {
  loading,
  loaded,
  failed,
}

export interface RectInterface {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}

export interface PluginsInterface {
  rect: object;
  circle: object;
  mosaic: object;
  text: object;
  pen: object;
}
