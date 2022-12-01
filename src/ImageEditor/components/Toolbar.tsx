import classNames from 'classnames';
import React, { forwardRef, useState } from 'react';
import { ArrowContainer, Popover } from 'react-tiny-popover';
import { actionBar, plugins, prefixCls } from '../constant';
import { PluginsInterface } from '../type';
import { useCombinedRefs } from '../utils/utils';
import Stroke from './Stroke';
import Svg from './Svg';
interface Props {
  type: string;
  info: { size: number; color: string };
  toolbar: { items: [] };
  setInfo: any;
  handelChange: (type: string) => void;
}

const ToolBar = forwardRef<any, Props>(({ info, type, setInfo, toolbar, handelChange }, ref) => {
  const [selected, setSelected] = useState('');
  const toolsRef = React.useRef(null);
  const combinedRef = useCombinedRefs(ref, toolsRef) as any;

  const handleClick = (e: any, curType: string) => {
    handelChange(curType);
    setSelected(curType);
  };

  const renderPlugin = (plugin: any) => {
    return (
      <Popover
        positions={plugin.positions}
        align="start"
        key={plugin.name}
        isOpen={selected === plugin.name}
        content={({ childRect, popoverRect }) => (
          <ArrowContainer
            position={plugin.positions}
            childRect={childRect}
            popoverRect={popoverRect}
            arrowColor={plugin.arrowColor}
            arrowSize={plugin.arrowSize}
          >
            <Stroke
              info={info}
              isStroke={plugin.isStroke}
              isColor={plugin.isColor}
              isSelect={plugin.isSelect}
              handleChange={(options) => {
                setInfo((opt: { size?: number; color?: string }) => ({
                  ...opt,
                  ...options,
                }));
              }}
            />
          </ArrowContainer>
        )}
      >
        <div className={classNames(plugin.classNames)} onClick={(e) => handleClick(e, plugin.name)}>
          <Svg type={type} pluginName={plugin.name} />
        </div>
      </Popover>
    );
  };

  return (
    <div className={`${prefixCls}-tools`} ref={combinedRef}>
      {toolbar.items.map((item) => {
        return Object.keys(plugins).map((plugin) => {
          if (plugins[plugin as keyof typeof PluginsInterface].name === item) {
            return renderPlugin(plugins[plugin as keyof typeof PluginsInterface]);
          }
        });
        return null;
      })}
      {actionBar.map((action) => {
        if (action === 'line') {
          return <div key={action} className="tools-line" />;
        }
        return (
          <div
            className={classNames('tools-item')}
            onClick={(e) => handleClick(e, action)}
            key={action}
          >
            <Svg pluginName={action} />
          </div>
        );
      })}
    </div>
  );
});
export default ToolBar;
