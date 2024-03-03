import * as React from 'react';
import { css } from '@emotion/css';
import { Slider } from '@mui/material';
import { EntityTestWidget } from './entity';
import { useEditorStore } from 'Src/core';
import { DME } from 'Src/core/types';


const { useState, useEffect } = React;

export const TestWidget = (props: DME.WidgetRenderProps<EntityTestWidget>) => {
  const {
    blockNode: {
      data: { settings },
    },
  } = props;

  const [width, setWidth] = useState(settings.width ?? 300);
  const [height, setHeight] = useState(settings.height ?? 150);
  const [header, setHeader] = useState(settings.header ?? '');
  const [backgroundColor, setBackgroundColor] = useState(settings.backgroundColor ?? '#ffffff');

  const { updateSelectedBlock } = useEditorStore();

  useEffect(() => {
    setHeight(settings.height ?? 300);
    setWidth(settings.width ?? 300);
    setHeader(settings.header ?? '');
    setBackgroundColor(settings.backgroundColor ?? '#ffffff')
  }, [settings],);

  const updateHeight = (e : number, v : number) => {
    
    updateSelectedBlock<EntityTestWidget>((data) => {
      data.settings.width = v as number;
    });
  };

  const updateWidth = (e: number, v : number) => {
    
    updateSelectedBlock<EntityTestWidget>((data) => {
      data.settings.width = v as number;
    });
  };

    const updateHeader = (newHeader: string) => {
      updateSelectedBlock<EntityTestWidget>((data) => {
        data.settings.header = newHeader;
      });
    };

    const updateBackgroundColor = (newColor: string) => {
      updateSelectedBlock<EntityTestWidget>((data) => {
        data.settings.backgroundColor = newColor;
      });
    }

    
  
  

    return (
      <div>
        <Slider
          aria-label="Width"
          valueLabelDisplay="auto"
          value={width}
          step={5}
          max={800}
          onChange={(e, newValue) => setWidth(Array.isArray(newValue) ? newValue[0] : newValue)}
        />
        <Slider
          aria-label="Height"
          valueLabelDisplay="auto"
          value={height}
          step={5}
          max={800}
          onChange={(e, newValue) => setHeight(Array.isArray(newValue) ? newValue[0] : newValue)}
        />
  
        <div
          className={css`
            width: ${width}px;
            height: ${height}px;
            background-color: ${backgroundColor};
            padding: 16px;
            box-sizing: border-box;
          `}
        >
          <input type="text" value={header} onChange={(e) => updateHeader(e.target.value)} placeholder="Header Text" />
          
          
          
        </div>
      </div>
    );

};
  export default TestWidget;
