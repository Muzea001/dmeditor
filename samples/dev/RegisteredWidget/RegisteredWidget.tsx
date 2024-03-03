import * as React from 'react';
import { css } from '@emotion/css';
import { Slider } from '@mui/material';
import { EntityRegisteredWidget } from './entity';
import { useEditorStore } from 'Src/core';
import { DME } from 'Src/core/types';


const { useState, useEffect } = React;

export const RegisteredWidget = (props: DME.WidgetRenderProps<EntityRegisteredWidget>) => {
  const {
    blockNode: {
      data: { settings },
    },
  } = props;

  const [placeholder, setPlaceHolder] = useState(settings.placeholder ?? 'Hei');
  

  const { updateSelectedBlock } = useEditorStore();

  useEffect(() => {
    setPlaceHolder(settings.placeholder ?? 'Hei');
  }, [settings],);

  return (
    <input
      type="text"
      placeholder={settings.placeholder || 'Default Placeholder'}
      style={{ width: '100%', padding: '10px', fontSize: '16px', margin: '5px 0' }}
    />
  );
};
export default RegisteredWidget;

