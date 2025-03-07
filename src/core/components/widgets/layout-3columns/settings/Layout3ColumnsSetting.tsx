import { useEffect, useState } from 'react';
import { BorderAll, BorderClearOutlined, BorderHorizontalOutlined } from '@mui/icons-material';

import { EntityLayout3Columns } from '../Layout3Columns';
import { PropertyButton, PropertyItem, Ranger } from 'Core/utils';
import { useEditorStore } from 'Src/core/main/store';
import { DME } from 'Src/core/types';

export const Layout3ColumnsSetting = (props: DME.SettingComponentProps) => {
  const { updateSelectedBlock, getSelectedBlock } = useEditorStore();

  const blockData = getSelectedBlock<EntityLayout3Columns>();

  const [column1Width, setColumn1Width] = useState(blockData?.data.column1Width || 4);
  const [column2Width, setColumn2Width] = useState(blockData?.data.column2Width || 4);

  const totalWidth = 12;

  const handleChange1 = (v: number) => {
    const max = totalWidth - column2Width;
    if (v < max) {
      setColumn1Width(v);
    }
  };

  const handleChange2 = (v: number) => {
    const max = totalWidth - column1Width;
    if (v < max) {
      setColumn2Width(v);
    }
  };

  useEffect(() => {
    updateSelectedBlock<EntityLayout3Columns>((data) => {
      data.column1Width = column1Width;
      data.column2Width = column2Width;
    });
  }, [column1Width, column2Width]);

  return (
    <>
      <PropertyItem label="Column1 width">
        {/* todo: support showing disabled area where you can't slide to */}
        <Ranger
          defaultValue={blockData?.data.column1Width}
          min={1}
          max={11}
          step={1}
          onChange={handleChange1}
        ></Ranger>
      </PropertyItem>

      <PropertyItem label="Column2 width">
        <Ranger
          defaultValue={blockData?.data.column2Width}
          min={1}
          max={11}
          step={1}
          onChange={handleChange2}
        ></Ranger>
      </PropertyItem>
    </>
  );
};
