import * as React from 'react';
import { css } from '@emotion/css';
import { Slider } from '@mui/material';
import { EntityTableWidget } from './entity';
import TextField from '@mui/material/TextField';
import { useEditorStore } from 'Src/core';
import { DME } from 'Src/core/types';

const { useState, useEffect } = React;

export const TableWidget = (props: DME.WidgetRenderProps<EntityTableWidget>) => {
  console.log(props.blockNode.data.settings);
  const {
    blockNode: {
      data: { settings },
      
    },
  } = props;

  

  const [rows, setRows] = useState(settings.rows ?? 3);
  const [columns, setColumns] = useState(settings.columns ?? 3);
  const [header, setHeader] = useState(settings.header ?? 'Default Header');
  const [defaultText, setDefaultText] = useState(settings.defaultText ?? 'Cell Text');
  const [columnWidth, setColumnWidth] = useState(Number(settings.columnWidth?.replace(' px', '')) || 100);

  const { updateSelectedBlock } = useEditorStore();

  useEffect(() => {
    setRows(settings.rows ?? 3);
    setColumns(settings.columns ?? 3);
    setHeader(settings.header ?? 'DefaultText');
    setDefaultText(settings.defaultText ?? 'Cell Text')
    setColumnWidth(Number(settings.columnWidth?.replace(' px', '')) || 100);
  }, [settings],);


  const updateRows = (e : number, v : number) => {
    
    updateSelectedBlock<EntityTableWidget>((data) => {
      data.settings.rows = v as number;
    });
  };

  const updateColumns = (e : number, v : number) => {
    
    updateSelectedBlock<EntityTableWidget>((data) => {
      data.settings.columns = v as number;
    });
  };

  const updateHeader = (newHeader: string) => {
    updateSelectedBlock<EntityTableWidget>((data) => {
      data.settings.header = newHeader;
    });
  };

    const updateDefaultText = (newText: string) => {
      updateSelectedBlock<EntityTableWidget>((data) => {
        data.settings.defaultText = newText;
      });
    }
    const updateColumnWidth = (e : string, v : string) => {
    
      updateSelectedBlock<EntityTableWidget>((data) => {
        data.settings.columnWidth = v as string;
      });
    };

    const renderTable = () => {
      const tableRows = [];
      for (let i = 0; i < rows; i++) {
        const cells = [];
        for (let j = 0; j < columns; j++) {
          cells.push(
            <td
              key={`cell-${i}-${j}`}
              className={css`
                width: ${columnWidth}px;
                border: 1px solid #ddd;
                text-align: center;
              `}
            >
              {i === 0 ? header : defaultText}
            </td>
          );
        }
        tableRows.push(<tr key={`row-${i}`}>{cells}</tr>);
      }


      return (
        <table
          className={css`
            border-collapse: collapse;
            width: 100%;
          `}
        >
          <tbody>{tableRows}</tbody>
        </table>
      );
    };
  
    
    return (
      <div>
  <div
    style={{ marginBottom: '20px' }}
  >
    <label>
      Header:
      <input
        type="text"
        value={header}
        onChange={(e) => updateHeader(e.target.value)}
        style={{ marginRight: '8px', padding: '5px', margin: '5px' }}
      />
    </label>
    <label>
      Default Text:
      <input
        type="text"
        value={defaultText}
        onChange={(e) => updateDefaultText(e.target.value)}
        style={{ padding: '5px', margin: '5px' }}
      />
    </label>
  </div>
  {renderTable()}
</div>
    );
  };
    

export default TableWidget;