import { nanoid } from 'nanoid';

import { RegisteredWidget } from './RegisteredWidget';
import { registerSettingComponent, registerWidget, registerWidgetVariant } from 'Src/core';
import {
  getWidget,
  getWidgetVariant,
  registerWidgetStyle,
  registerWidgetStyleOption,
} from 'Src/core/components/widgets';
import { DMEData } from 'Src/core/types';

const registerRegisteredWidget = () => {
    registerWidget({
      type: 'simple_text_field',
      name: 'SimpleTextFieldWidget',
      category: 'widget', 
      icon: 'A', 
      settings: [
        {
          name: 'Placeholder Text',
          settingComponent: 'setting_input',
          property: 'settings.placeholder',
        },
      ],
  
      events: {
        createBlock: () => ({
          id: nanoid(),
          type: 'simple_text_field',
          data: {
            settings: {
              placeholder: 'Enter text...',
            },
          },
        }),
        updateData: () => void 0,
      },
    }, RegisteredWidget); // 
  };
  
  export default registerRegisteredWidget;
