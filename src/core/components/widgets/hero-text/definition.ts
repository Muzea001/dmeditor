import { nanoid } from 'nanoid';

import { EntityHeroText } from './entity';
import { DMEData } from 'Core/types/dmeditor';
import { DME } from 'Src/core/types/dmeditor';

const heroTextWidget: DME.Widget = {
  // ?category options: widget, layout, form, chart, advanced
  category: 'mixed',
  icon: 'TextFormatOutlined',
  name: 'Hero text',
  type: 'hero-text',
  isBaseWidget: true,
  //todo: support children: Array or [prop: string]: object
  //childen :{hero: 'image', list: 'list:button'}
  //or {hero: 'image', list: {type: 'list', children:{'list:button', <variant definition>}}
  events: {
    createBlock: (): DMEData.Block<EntityHeroText> => {
      return {
        id: nanoid(),
        type: 'hero-text',
        data: {},
        children: [
          {
            id: nanoid(),
            type: 'heading',
            data: {
              value: 'Heading1',
              level: 2,
            },
          },
          {
            id: nanoid(),
            type: 'list',
            data: {},
            children: [
              {
                id: nanoid(),
                type: 'heading',
                data: {
                  value: 'Heading 2',
                  level: 2,
                },
              },
            ],
          },
        ],
      };
    },
    updateData: () => {},
  },
  settings: [
    {
      name: 'Hero position',
      property: '.heroPosition',
      settingComponent: 'button-group',
      parameters: {
        options: [
          { text: 'Left', value: 'left' },
          { text: 'Right', value: 'right' },
        ],
      },
    },
  ],
};

export default heroTextWidget;
