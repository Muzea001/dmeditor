import React, { PropsWithChildren, Ref } from 'react';
import ReactDOM from 'react-dom';
import { css, cx } from '@emotion/css';
import {
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatListBulleted,
  FormatListNumbered,
} from '@mui/icons-material';
import { Editor, Element as SlateElement } from 'slate';
import { useSlate } from 'slate-react';

interface BaseProps {
  className: string;
  [key: string]: unknown;
}
// type OrNull<T> = T | null
type OrNull<T> = T;

const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>,
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed ? (active ? 'white' : '#aaa') : active ? '#12913e;' : '#ccc'};
        `,
      )}
    />
  ),
);

export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<
      {
        value: any;
      } & BaseProps
    >,
    ref: Ref<OrNull<null>>,
  ) => {
    const textLines = value.document.nodes
      .map((node: any) => node.text)
      .toArray()
      .join('\n');
    return (
      <div
        // ref={ref}
        {...props}
        className={cx(
          className,
          css`
            margin: 30px -20px 0;
          `,
        )}
      >
        <div
          className={css`
            font-size: 14px;
            padding: 5px 20px;
            color: #404040;
            border-top: 2px solid #eeeeee;
            background: #f8f8f8;
          `}
        >
          Slate's value as text
        </div>
        <div
          className={css`
            color: #404040;
            font: 12px monospace;
            white-space: pre-wrap;
            padding: 10px 20px;
            div {
              margin: 0 0 0.5em;
            }
          `}
        >
          {textLines}
        </div>
      </div>
    );
  },
);

export const Icon = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        'material-icons',
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
        `,
      )}
    />
  ),
);

export const Instruction = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          white-space: pre-wrap;
          margin: 0 -20px 10px;
          padding: 10px 20px;
          font-size: 14px;
          background: #f8f8e8;
        `,
      )}
    />
  ),
);

export const Menu = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          & > * {
            display: inline-block;
          }
          & > * + * {
            margin-left: 15px;
          }
        `,
      )}
    />
  ),
);

export const Portal = ({ children }: any) => {
  return typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null;
};

export const Toolbar = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <Menu
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          position: relative;
          padding: 1px 18px 17px;
          margin: 0 -20px;
          border-bottom: 2px solid #eee;
          margin-bottom: 20px;
        `,
      )}
    />
  ),
);

export const ToolbarR = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <MenuR
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          padding: 0 17px;
          margin: 0 -20px;
          // border-bottom: 2px solid #eee;
          margin-bottom: 20px;
        `,
      )}
    />
  ),
);
export const MenuR = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        'toolSlate',
        className,
        css`
          & > * {
            display: inline-block;
          }
          & > * + * {
            margin-right: 15px;
            // margin-left: 15px;
          }
        `,
      )}
    />
  ),
);

export const getBlockButtonIcon = ({ formats }: any) => {
  let ele: any;
  if (formats === 'left') {
    ele = <FormatAlignLeft />;
  }
  if (formats === 'center') {
    ele = <FormatAlignCenter />;
  }
  if (formats === 'right') {
    ele = <FormatAlignRight />;
  }
  if (formats === 'justify') {
    ele = <FormatAlignJustify />;
  }
  if (formats === 'numbered-list') {
    ele = <FormatListNumbered />;
  }
  if (formats === 'bulleted-list') {
    ele = <FormatListBulleted />;
  }
  return ele;
};

const isBlockActive = (editor: any, format: any, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    }),
  );

  return !!match;
};

const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];
export const BlockButton = ({ format }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')}
      onMouseDown={(event) => {
        event.preventDefault();
        // toggleBlock(editor, format);
      }}
    >
      {/* <Icon>{icon}</Icon> */}
      {getBlockButtonIcon({ formats: format })}
    </Button>
  );
};
