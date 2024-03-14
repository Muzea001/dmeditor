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
          {
            name: 'Position',
            settingComponent: 'setting_input',
            property: 'settings.position',
            
          },

          
        
      ],
  
      events: {
        createBlock: () => ({
          id: nanoid(),
          type: 'Calender',
          data: {
            settings: {
                width: 800,
                height: 850,
                header:'Upcoming events'

            },
          },
        }),
        updateData: () => void 0,
      },
    }, CalenderWidget); 
  };


  registerWidgetStyle('Calender', {
    identifier: 'headerStyle',
    name: 'Header Style',
    display: 'inline-block',
    options: [{
        identifier: 'centeredBold',
        name: 'Centered & Bold',
        cssStyle: `
            text-align: center;
            font-weight: bold;
            padding: 20px;
        `,
        icon: '' // Optionally specify an icon URL or class here
    }]
});

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
