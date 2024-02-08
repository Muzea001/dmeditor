import type { EntityTabsBlock } from './entity';
import type { DMEditor } from 'Core/types';

const TabsWidget: DMEditor.Widget = {
  // ?category options: widget, layout, form, chart, advanced
  category: 'widget',
  icon: 'TextFormatOutlined',
  name: 'Tabs',
  type: 'tabs',
  events: {
    createBlock: (): EntityTabsBlock => {
      return {
        value: 'This is a new block',
        level: 2,
        settings: {
          align: 'left',
          color: '#000000',
        },
        children: [
          {
            type: 'list',
            id: '1',
            data: 'Tab1',
            children: [
              { type: 'heading', id: '1', data: 'Tab1 Title', level: 2 },
              {
                type: 'text',
                id: '2',
                data: [{ type: 'paragraph', children: [{ text: 'Default text' }] }],
              },
            ],
            setting: {},
          },
          {
            type: 'list',
            id: '2',
            data: 'Tab2',
            children: [
              { type: 'heading', id: '1', data: 'Tab2 Title', level: 2 },
              {
                type: 'text',
                id: '2',
                data: [{ type: 'paragraph', children: [{ text: 'Default text' }] }],
              },
            ],
            setting: {},
          },
        ],
      };
    },
    updateData: () => {},
  },
  settings: [
    { name: 'Align', settingComponent: 'align', category: 'settings', property: 'settings.align' },
    {
      name: 'Background',
      settingComponent: 'color',
      category: 'block',
      property: 'settings.background-color',
    },
    { name: 'Text color', settingComponent: 'color', category: 'settings', property: 'settings.color' },
    { name: 'Border', settingComponent: 'color', category: 'block', property: 'settings.border' },
    { name: 'Padding', settingComponent: 'range', category: 'block', property: 'settings.padding' },
    { name: 'Margin', settingComponent: 'range', category: 'block', property: 'settings.margin' },

    { name: '', settingComponent: 'heading', category: 'settings', custom: true, property: '' },
  ],
};

export default TabsWidget;
