import * as React from 'react';
import { nanoid } from 'nanoid';

import registerSampleWidget from './SampleWidget';
import { DMEditor } from 'Src/core';
import { registerTheme } from 'Src/core/components/page';

registerSampleWidget();
registerTheme({
  identifier: 'red',
  name: 'Red',
  cssStyle: `
    background: #ffd4d4;    
    /*todo: use css variable*/
  `
});
registerTheme({
  identifier: 'blue',
  name: 'Blue',
  cssStyle: `
    background: #d4e2ff;
  `
});

const { useRef, useEffect } = React;

const App = () => {
  const editorRef = useRef(null);
  // const [editor] = useEditor()
  const data = [
    {
      id: `widget-${nanoid()}`,
      style: {'_':'big-space'},
      data: {
        value: 'This is a heading',
        level: 2,
        settings: {
          align: 'left',
          // value: '',
        },
      },
      type: 'heading',
    },
    {
      id: `widget-${nanoid()}`,
      style: {'_':'big-space'},
      data: {
        value: 'This is a heading 2',
        level: 2,
        settings: {
          align: 'left',
        },
      },
      type: 'heading:gradient',
    },
    {
      id: `widget-${nanoid()}`,
      data: {
        value: 'This is a heading 2',
        level: 2,
        settings: {
          align: 'right',
          // value: '',
        },
      },
      type: 'heading',
    },
    {
      id: `widget-${nanoid()}`,
      data: {
        columns: 3,
      },
      type: 'grid',
      children: [
        {
          id: `widget-${nanoid()}`,
          data: {
            value: 'This is a heading 1 ',
            level: 2,
            settings:{},
          },
          type: 'heading',
        },
        {
          id: `widget-${nanoid()}`,
          data: {
            value: 'This is a heading 2',
            level: 2,
            settings:{},
          },
          type: 'heading',
        },
        {
          id: `widget-${nanoid()}`,     
          type: 'list',
          data:{
          },
          children: [
            {
              id: `widget-${nanoid()}`,
              data: {
                value: 'This is a heading 1 in List ',
                level: 2,
                settings:{},
              },
              type: 'heading',
            },
            {
              id: `widget-${nanoid()}`,
              data: {
                value: 'This is a heading 2 in List',
                level: 2,
                settings:{},
              },
              type: 'heading',
            },
            {
              id: `widget-${nanoid()}`,
              data: {
                value: 'This is a heading 3 in List',
                level: 2,
                settings:{},
              },
              type: 'heading',
            }
          ],      
        },
        {
          id: `widget-${nanoid()}`,
          data: {
            value: 'This is a heading 3',
            level: 2,
            settings:{},
          },
          type: 'heading',
        }
      ],      
    },
    {
      id: `widget-${nanoid()}`,
      data: {
        value: 'This is a heading 3',
        level: 2,
        settings:{},
      },
      type: 'heading:gradient',
    },
    {
      id: `widget-${nanoid()}`,     
      type: 'list',
      data:{
        direction: 'horizontal'
      },
      children: [
        {
          id: `widget-${nanoid()}`,
          data: {
            value: 'This is a heading 1 in List ',
            level: 2,
            settings:{},
          },
          type: 'heading',
        },
        {
          id: `widget-${nanoid()}`,
          data: {
            value: 'This is a heading 2 in List',
            level: 2,
            settings:{},
          },
          type: 'heading',
        },
        {
          id: `widget-${nanoid()}`,
          data: {
            value: 'This is a heading 3 in List',
            level: 2,
            settings:{},
          },
          type: 'heading',
        }
      ],      
    },
  ];
  useEffect(() => {
    // editorRef.current.setDesingerJson(jsonString(data))
    editorRef.current?.setEditorJson(data);
    editorRef.current?.setPageSettings([
      {identifier: 'cover_image', name:'Cover image', type: 'image'},
      {identifier: 'summary', name:'Summary', type: 'richtext'},
      {identifier: 'meta_key', name:'Meta key', type: 'text'},     
      {identifier: 'meta_description', name:'Meta description', type: 'multitext'},
    ]);
    editorRef.current?.setPageData({title:'Test', meta_key:'test key'});
  }, []);

  return <DMEditor ref={editorRef} />;
};

export default App;
