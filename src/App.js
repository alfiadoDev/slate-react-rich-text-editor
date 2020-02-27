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
  idBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
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
  toggleBoldMark(editor) {
    const isActive = CustomEditor.idBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
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
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />;
  });

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
              // CustomEditor.toggleItalicMark(editor);
            }}
          >
            <Icon icon={italic} />
          </button>
          <button 
            type="button" 
            className="tooltip-icon-button"
            onPointerDown={event => {
              event.preventDefault();
              // CustomEditor.toggleItalicMark(editor);
            }}
          >
            <Icon icon={code} />
          </button>
          <button 
            type="button" 
            className="tooltip-icon-button"
            onPointerDown={event => {
              event.preventDefault();
              // CustomEditor.toggleItalicMark(editor);
            }}
          >
            <Icon icon={list} />
          </button>
          <button 
            type="button" 
            className="tooltip-icon-button"
            onPointerDown={event => {
              event.preventDefault();
              // CustomEditor.toggleItalicMark(editor);
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

const DefaultElement = ({ attributes, children }) => (
  <p {...attributes}>{children}</p>
);

// define a react component to render leaves with bold text
const Leaf = ({ attributes, children, leaf }) => (
  <span {...attributes} style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}>
    {children}
  </span>
);

/* App.propTypes = {
  element: PropTypes.shape({
    type: PropTypes.string,
  }).isRequired,
};
DefaultElement.propTypes = {
  attributes: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
};
Leaf.propTypes = {
  attributes: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
  leaf: PropTypes.shape({
    bold: PropTypes.string,
  }).isRequired,
};
CodeElement.propTypes = {
  attributes: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
};
 */
export default App;
