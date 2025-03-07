import React, { PropsWithChildren, ReactNode, Ref, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { css, cx } from '@emotion/css';
import {
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatUnderlined,
} from '@mui/icons-material';
import {
  createEditor,
  Editor,
  Node,
  Point,
  Range,
  Element as SlateElement,
  Transforms,
} from 'slate';
import { withHistory } from 'slate-history';
import { useFocused, useSlate, withReact } from 'slate-react';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

interface BaseProps {
  className: string;
  [key: string]: unknown;
}
// type OrNull<T> = T | null;
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
    ref: Ref<HTMLSpanElement>,
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#666'};
        `,
      )}
    />
  ),
);

const getIcon = (format: string): ReactNode => {
  switch (format) {
    case 'align-left':
      return <FormatAlignLeft />;
    case 'align-center':
      return <FormatAlignCenter />;
    case 'align-right':
      return <FormatAlignRight />;
    case 'align-justify':
      return <FormatAlignJustify />;
    case 'bulleted-list':
      return <FormatListBulleted />;
    case 'numbered-list':
      return <FormatListNumbered />;
    case 'bold':
      return <FormatBold />;
    case 'italic':
      return <FormatItalic />;
    case 'underline':
      return <FormatUnderlined />;
    default:
      return null;
  }
};

const MarkButton = ({ format }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {getIcon(format)}
    </Button>
  );
};

const BlockButton = ({ format }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {getIcon(format)}
    </Button>
  );
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
const isBlockActive = (editor, format, blockType = 'type') => {
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
const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const Menu = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<HTMLDivElement>) => (
    <div
      {...props}
      data-test-id="menu"
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
const Toolbar = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<HTMLDivElement>) => (
    <Menu
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          position: relative;
          padding: 10px;
          border-bottom: 1px solid #eee;
          margin-bottom: 10px;
        `,
      )}
    />
  ),
);

export const resetNodes = (
  editor: Editor,
  options: {
    nodes?: Node | Node[];
    at?: Location;
  } = {},
): void => {
  const cachedSelection = editor.selection;
  const children = [...editor.children];
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    editor.apply({ type: 'remove_node', path: [0], node });
  }

  if (options.nodes) {
    const nodes = Node.isNode(options.nodes) ? [options.nodes] : options.nodes;
    for (let i = 0; i < nodes.length; i++) {
      editor.apply({ type: 'insert_node', path: [i], node: nodes[i] });
    }
  }

  if (cachedSelection && Point.isBefore(cachedSelection.anchor, Editor.end(editor, []))) {
    Transforms.select(editor, cachedSelection);
    return;
  }
  Transforms.select(editor, Editor.end(editor, []));
};

const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null;
};

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection) {
      return;
    }
    if (domSelection.rangeCount === 0) {
      return;
    }
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = '1';
    el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`;
    el.style.left = `${rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2}px`;
  });

  return (
    <Portal>
      <Menu
        ref={ref}
        className={css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 51;
          top: -10000px;
          left: -10000px;
          margin-top: -6px;
          opacity: 0;
          background-color: #222;
          border-radius: 4px;
          transition: opacity 0.75s;
        `}
        onMouseDown={(e: MouseEvent) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        <MarkButton format="bold" />
        <MarkButton format="italic" />
        <MarkButton format="underline" />
      </Menu>
    </Portal>
  );
};

export { toggleMark, MarkButton, BlockButton, HoveringToolbar, Toolbar };
