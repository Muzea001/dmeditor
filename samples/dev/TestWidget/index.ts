import { nanoid } from 'nanoid';

import TestWidget from './TestWidget';
import { registerSettingComponent, registerWidget, registerWidgetVariant } from 'Src/core';
import {
  getWidget,
  getWidgetVariant,
  registerWidgetStyle,
  registerWidgetStyleOption,
} from 'Src/core/components/widgets';
import { DMEData } from 'Src/core/types';

const registerTestWidget = function () {
  registerWidget(
    {
      type: 'test',
      name: 'Test widget',
      category: 'widget',
      icon: 'A',
      settings: [
        {
          name: 'Background Color',
          settingComponent: 'color',
          property: 'settings.backgroundColor',
        },
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
          type: 'test',
          data: {
            level: 2,
            settings: {
              width: 100,
              height: 100,
              header: 'Default Header',
              backgroundColor: '#cccccc',
            },
          },
        }),
        updateData: () => void 0,
      },
    },
    TestWidget,
  );
};

const registerTestWidgetVariant = () => {
registerWidgetVariant(
{
        widget : 'test',
        identifier: 'highlited_test',
        name: 'Highlighted Test Widget',
        enabledSettings : [
          'settings.header', 
        ],
        getDefaultData: () => ({
          id:nanoid(),
          type: 'test:highlighted_test',
          data : {
            settings: {
              width: 500,
              height: 700,
              header: 'Widget Variant Header',
              backgroundColor: '#ffcc00',

              
            },
          },
        }),
      });
    };

export default registerTestWidget;