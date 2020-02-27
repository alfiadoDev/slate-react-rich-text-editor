/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo, useCallback } from 'react';
import { createEditor, Transforms, Editor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
// import PropTypes from 'prop-types';
import Icon from 'react-icons-kit';
import { bold } from 'react-icons-kit/feather/bold';
import { italic } from 'react-icons-kit/feather/italic';
import { code } from 'react-icons-kit/feather/code';
import { list } from 'react-icons-kit/feather/list';
import { underline } from 'react-icons-kit/feather/underline';

import FormatToolbar from './components/FormatToolbar';

import './App.css';

// define a custom set of helpers
const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true,
    });
    return !!match;
  },
  isItalicMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.italic === true,
      universal: true,
    });
    return !!match;
  },
  isUnderlinecMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.underline === true,
      universal: true,
    });
    return !!match;
  },
  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    });
    return !!match;
  },
  isUlBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'list',
    });
    return !!match;
  },
  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => new Text(n), split: true }
    );
  },
  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    Transforms.setNodes(
      editor,
      { italic: isActive ? null : true },
      { match: n => new Text(n), split: true }
    );
  },
  toggleUnderlineMark(editor) {
    const isActive = CustomEditor.isUnderlinecMarkActive(editor);
    Transforms.setNodes(
      editor,
      { underline: isActive ? null : true },
      { match: n => new Text(n), split: true }
    );
  },
  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: n => Editor.isBlock(editor, n) }
    );
  },
  toggleUlBlock(editor) {
    const isActive = CustomEditor.isUlBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'list' },
      { match: n => Editor.isBlock(editor, n) }
    );
  },
};

function App() {
  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(() => withReact(createEditor()), []);

  // kepp track of state for the value of editor
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'a line of text in a paragraph' }],
    },
  ]);

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(props => {
    const { element } = props;
    switch (element.type) {
      case 'code':
        return <CodeElement {...props} />;
      case 'list':
        return <UlElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />;
  }, []);

  // render the slate context
  return (
    <div className="App">
      <Slate
        editor={editor}
        value={value}
        onChange={value2 => setValue(value2)}
      >
        <FormatToolbar>
          <button
            type="button"
            className="tooltip-icon-button"
            onPointerDown={event => {
              event.preventDefault();
              CustomEditor.toggleBoldMark(editor);
            }}
          >
            <Icon icon={bold} />
          </button>
          <button
            type="button"
            className="tooltip-icon-button"
            onPointerDown={event => {
              event.preventDefault();
              CustomEditor.toggleItalicMark(editor);
            }}
          >
            <Icon icon={italic} />
          </button>
          <button
            type="button"
            className="tooltip-icon-button"
            onPointerDown={event => {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
            }}
          >
            <Icon icon={code} />
          </button>
          <button
            type="button"
            className="tooltip-icon-button"
            onPointerDown={event => {
              event.preventDefault();
              CustomEditor.toggleUlBlock(editor);
            }}
          >
            <Icon icon={list} />
          </button>
          <button
            type="button"
            className="tooltip-icon-button"
            onPointerDown={event => {
              event.preventDefault();
              CustomEditor.toggleUnderlineMark(editor);
            }}
          >
            <Icon icon={underline} />
          </button>
        </FormatToolbar>
        <Editable
          style={{ textAlign: 'left' }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
            if (!event.ctrlKey) return;

            // Replace the `onKeyDown` logic with our new commands.
            switch (event.key) {
              case '1': {
                event.preventDefault();
                CustomEditor.toggleCodeBlock(editor);
                break;
              }

              case 'b': {
                event.preventDefault();
                CustomEditor.toggleBoldMark(editor);
                break;
              }

              case 'i': {
                event.preventDefault();
                CustomEditor.toggleItalicMark(editor);
                break;
              }

              case 'u': {
                event.preventDefault();
                CustomEditor.toggleUnderlineMark(editor);
                break;
              }

              case 'l': {
                event.preventDefault();
                CustomEditor.toggleUlBlock(editor);
                break;
              }

              default:
            }
          }}
        />
      </Slate>
    </div>
  );
}

const CodeElement = ({ attributes, children }) => {
  return (
    <pre {...attributes}>
      <code>{children}</code>
    </pre>
  );
};

const UlElement = ({ attributes, children }) => {
  return (
    <ul {...attributes}>
      <li>{children}</li>
    </ul>
  );
};

const DefaultElement = ({ attributes, children }) => (
  <p {...attributes}>{children}</p>
);

// define a react component to render leaves with bold and italic text
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold && !leaf.italic) {
    return (
      <span
        {...attributes}
        style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}
      >
        {children}
      </span>
    );
  }
  if (leaf.bold && leaf.italic) {
    return (
      <em>
        <span
          {...attributes}
          style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}
        >
          {children}
        </span>
      </em>
    );
  }

  if (leaf.bold && leaf.italic && leaf.underline) {
    return (
      <u>
        <em>
          <span
            {...attributes}
            style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}
          >
            {children}
          </span>
        </em>
      </u>
    );
  }

  if (leaf.bold && !leaf.italic && leaf.underline) {
    return (
      <u>
        <span
          {...attributes}
          style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}
        >
          {children}
        </span>
      </u>
    );
  }

  if (!leaf.bold && leaf.italic && leaf.underline) {
    return (
      <u>
        <em {...attributes}>{children}</em>
      </u>
    );
  }

  if (leaf.italic && !leaf.bold) {
    return <em {...attributes}>{children}</em>;
  }

  if (leaf.underline && !leaf.bold && !leaf.italic) {
    return <u {...attributes}>{children}</u>;
  }

  return (
    <span {...attributes} style={{ fontWeight: 'normal' }}>
      {children}
    </span>
  );
};

export default App;
