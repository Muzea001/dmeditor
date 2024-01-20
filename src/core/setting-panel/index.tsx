import * as React from 'react';
import { useMemo, useState } from 'react';
import { css } from '@emotion/css';
import { Settings } from '@mui/icons-material';
import { Button } from '@mui/material';

import { useEditorStore } from '../main/store';
import { BlockList } from './BlockList';
import { CommonSettings } from './common-setting';
import { PageSetting } from './PageSetting';
import { Path, PathItem, PathItemProps } from './Path';
import WidgetSetting from './property-setting/property-item';
import { PageTitle, SettingHeader, Space } from './style';

const { useEffect } = React;

type SettingPanelMode = 'setting' | 'list' | 'page-setting';

// const SettingPanel = ({ selectedWidget }: { selectedWidget: string }) => {
const SettingPanel = (props) => {
  const {
    selected: { blockIndex: selectedBlockIndex, currentList },
    getSelectedBlock,
    isSelected,
  } = useEditorStore((state) => state);

  const [mode, setMode] = useState<SettingPanelMode>('setting');
  const [pathArray, setPathArray] = useState([] as Array<PathItem>);

  useEffect(() => {
    setMode('setting');

    //for test for now
    setPathArray([
      { text: 'Page', id: '111', level: 0 },
      { text: 'Heading', id: '112', level: 1, disableClick: true },
    ]);
  }, [selectedBlockIndex]);

  const hasSelect = isSelected();

  const selectedBlock = useMemo(() => getSelectedBlock(selectedBlockIndex), [selectedBlockIndex]);

  const selectPathItem = (index: number) => {
    const path = pathArray[index];
    setMode('list');
  };

  return (
    <div
      className={css`
        padding: 5px;
      `}
    >
      <div>
        <div style={{ float: 'right' }}>
          <Button title="Page settings" onClick={() => setMode('page-setting')}>
            <Settings />
          </Button>
        </div>
        <PageTitle>New page</PageTitle>
      </div>
      <Space />
      <Path pathArray={pathArray} onSelect={selectPathItem} />
      <Space />
      {['list', 'setting'].includes(mode) && (
        <>
          {mode === 'list' && <BlockList data={currentList} selectedIndex={selectedBlockIndex} />}
          <SettingHeader>{selectedBlock?.type}</SettingHeader>
          {hasSelect && mode === 'setting' && (
            <CommonSettings {...props} selectedWidgetIndex={selectedBlockIndex} />
          )}
          {/* <WidgetSetting selected={selectedWidget} /> */}
        </>
      )}
      {mode === 'page-setting' && <PageSetting />}
    </div>
  );
};

export default SettingPanel;
