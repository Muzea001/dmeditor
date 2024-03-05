import { nanoid } from 'nanoid';

import { CalenderWidget } from './CalenderWidget';
import { registerSettingComponent, registerWidget, registerWidgetVariant } from 'Src/core';
import {
  getWidget,
  getWidgetVariant,
  registerWidgetStyle,
  registerWidgetStyleOption,
} from 'Src/core/components/widgets';   
import { DMEData } from 'Src/core/types';

const registerCalenderWidget = () => {
    console.log('CalenderWidget:', CalenderWidget);
    registerWidget({
      type: 'Calender',
      name: 'CalenderWidget',
      category: 'widget', 
      icon: 'A', 
      settings: [
        {
            name: 'Width',
            settingComponent: 'setting_input',
            property: 'settings.width',
            
          },
          {
            name: 'Height',
            settingComponent: 'setting_input',
            property: 'settings.height',
            
          },
          {
            name: 'Header',
            settingComponent: 'setting_input',
            property: 'settings.header',
            
          },
          
        
      ],
  
      events: {
        createBlock: () => ({
          id: nanoid(),
          type: 'Calender',
          data: {
            settings: {
                width: 2000,
                height: 500,
                header:'Upcoming events'

            },
          },
        }),
        updateData: () => void 0,
      },
    }, CalenderWidget); 
  };


  registerWidgetStyle('Calender', {
    identifier: 'default-style',
    name: 'Default Style',
    display: 'inline-block', 
    options: [{
        identifier: 'custom-style',
        name: 'Custom Style',
        cssStyle: `
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: flex-start;
            max-width: 100%;
            border: 1px solid #ccc;
            box-sizing: border-box;
            padding: 20px;
            overflow: auto;
        `,
        icon: '' 
    }]
});
  
  export default registerCalenderWidget;
