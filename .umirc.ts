import { defineConfig } from 'dumi';
const path = require('path');
export default defineConfig({
  mode: 'doc',
  title: 'react-screen-editor-simple',
  favicon: '/react-screen-editor-simple/editor_logo.png',
  logo: '/react-screen-editor-simple/editor_logo.png',
  outputPath: 'docs-dist',
  base: '/react-screen-editor-simple/',
  publicPath: '/react-screen-editor-simple/',
  alias: {
    src: './src',
  },
  apiParser: {
    propFilter: {
      // 是否忽略从 node_modules 继承的属性，默认值为 false
      skipNodeModules: true,
      // 需要忽略的属性名列表，默认为空数组
      skipPropsWithName: [],
      // 是否忽略没有文档说明的属性，默认值为 false
      skipPropsWithoutDoc: false,
    },
  },
  // more config: https://d.umijs.org/config
});
