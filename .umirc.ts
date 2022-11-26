import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'react-screen-editor-simple',
  favicon: '/react-screen-cut-simple/editor_logo.png',
  logo: '/react-screen-cut-simple/editor_logo.png',
  outputPath: 'docs-dist',
  base: '/react-screen-cut-simple/',
  publicPath: '/react-screen-cut-simple/',
  // icons: {
  //   entry: './src/ImageEditor/assets',
  // },
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
