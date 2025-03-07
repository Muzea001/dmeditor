import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { css } from '@emotion/css';
import _debounce from 'lodash/debounce';

import i18n from '../../../locales/i18n';
import { getDef } from '../../../ToolDefinition';
import { getWidgetComponent, getWidgetStyle, getWidgetVariant } from '../../components/widgets';
import type { DME, DMEData } from 'Core/types';

interface BlockProps<Type = DMEData.DefaultDataType> {
  data: DMEData.Block<Type>;
  active?: boolean;
  path: Array<number>;
  mode: 'edit' | 'view';
  inBlock?: boolean;
}

export const BlockRender = React.memo((props: BlockProps) => {
  const { active } = props;

  const blockType = props.data.type;

  const widgetArr = blockType.split(':');
  const Widget = getWidgetComponent(widgetArr[0]);

  const getCssStyles = () => {
    const styleData = props.data.style;
    let styleStr = '';
    let styleClasses: { [key: string]: Array<string> } = {};
    if (styleData) {
      for (const styleIdentifier of Object.keys(styleData)) {
        const widgetStyle = getWidgetStyle(blockType, styleIdentifier);
        if (!widgetStyle) {
          console.warn(`Style ${styleIdentifier} not found on ${blockType}. Ignored.`);
          continue;
        }
        const styleOption = widgetStyle.options.find(
          (item) => item.identifier === styleData[styleIdentifier],
        );
        if (styleOption) {
          if (styleOption.cssStyle) {
            styleStr += css(styleOption.cssStyle) + ' ';
          }
          const classes = styleOption.cssClasses;
          if (classes) {
            Object.keys(classes).map((key) => {
              styleClasses[key] = [...(styleClasses[key] || []), classes[key]];
            });
          }
        }
      }
    }

    let builtinClasses = ` dme-block dme-blocktype-${widgetArr[0]}`;
    if (widgetArr[1]) {
      builtinClasses += ' dme-blockvariant-' + widgetArr[1];
    }

    let rootClasses = styleStr + builtinClasses;
    if (Object.keys(styleClasses).length > 0) {
      if (styleClasses['root']) {
        rootClasses += ` ${styleClasses['root'].join(' ')}`;
      }
      return { rootClasses: rootClasses, styleClasses: styleClasses };
    }
    return { rootClasses: rootClasses };
  };

  return Widget ? (
    // <div className={`${getCssStyles()} dme-block dme-blocktype-${widgetArr[0]} ${widgetArr[1]?'dme-blockvariant-'+widgetArr[1]:''}`}>
    <Widget
      inBlock={props.inBlock ? true : false}
      {...getCssStyles()}
      blockNode={props.data}
      path={props.path}
      mode={props.mode}
      active={active ? true : false}
    />
  ) : (
    <></>
  );
});

export const RenderMenu = (props: {
  onAdd: (type: string, template?: string) => void;
  onCancel: () => void;
  allowedType?: string[];
}) => {
  const menuRoot = document.getElementById('dmeditor-add-menu');

  return menuRoot ? ReactDOM.createPortal(<div></div>, menuRoot as HTMLElement) : <></>;
};

export const getStyleCss = (blocktype: string, styleIdentifier?: string) => {
  let def = getDef(blocktype);
  let styleCss = '';
  if (styleIdentifier && def.styles) {
    const styleDef = def.styles[styleIdentifier];
    if (styleDef) {
      if (styleDef.css) {
        styleCss = styleDef.css;
      }
    } else {
      console.warn('Style ' + styleIdentifier + ' not found.');
    }
  }
  return styleCss;
};

export const getCommonBlockCss = (blockType: string, styleIdentifier?: string) => {
  let result = 'dme-block dme-blocktype-' + blockType;
  if (styleIdentifier) {
    result += ' dme-template-' + blockType + '-' + styleIdentifier;
    result += ' ' + getStyleCss(blockType, styleIdentifier);
  }
  return result;
};
