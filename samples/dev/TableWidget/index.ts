import { nanoid } from 'nanoid';

import TableWidget from './TableWidget';
import { registerSettingComponent, registerWidget, registerWidgetVariant } from 'Src/core';
import {
  getWidget,
  getWidgetVariant,
  registerWidgetStyle,
  registerWidgetStyleOption,
} from 'Src/core/components/widgets';
import { DMEData } from 'Src/core/types';


const registerTableWidget = () => {
    registerWidget( 
        {
            type: 'tabell',
            name: 'Tabell',
            category:'widget',
            icon: 'A',
            settings: [
                {
                    name: 'Table Header',
                    settingComponent:'text_input',
                    property: 'settings.tableHeader'
                   },
               {
                name: 'Number of Columns',
                settingComponent:'number_input',
                property: 'settings.columns'
               },
               {
                name: 'Number of Rows',
                settingComponent:'number_input',
                property: 'settings.rows'
               },
               {
                name: 'Column Width',
                settingComponent:'number_input',
                property: 'settings.columnWidth'
               },
               {
                name: 'Cell Text',
                settingComponent:'text_input',
                property: 'settings.defaultText'
               }
            ],

            events: {
                createBlock: () => ({
                  id: nanoid(),
                  type: 'table',
                  data: {
                    settings: {
                      rows: 3,
                      columns:3,
                      header: 'Default Header',
                      defaultText: 'Ingenting',
                      columnWidth : '100px',
                    },
                  },
                }),
                updateData: () => void 0,
              },
        },
        TableWidget,
    );
};

export default registerTableWidget;

            
            
            
        


               
             



        

   