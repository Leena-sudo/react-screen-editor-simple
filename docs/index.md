## Basic 基本使用

Demo:

```tsx
import html2canvas from 'html2canvas';
import React, { useState } from 'react';
import { ImageEditor } from 'react-screen-editor-simple';

export default () => {
  const [visible, setVisible] = useState(false);
  const [cropImg, setCropImg] = useState('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(500);

  const handleScreenShot = (e: any) => {
    e.preventDefault();
    html2canvas(document.body).then((canvas: any) => {
      setCropImg(canvas.toDataURL());
      setVisible(true);
    });
  };
  const handleClose = () => {
    setVisible(false);
  };
  const handleConfirm = (img: any) => {
    setVisible(false);
  };

  return (
    <div>
      <div onClick={handleScreenShot}>click me!</div>
      {visible && (
        <ImageEditor
          width={width}
          height={height}
          src={cropImg}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};
```
