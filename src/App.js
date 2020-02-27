/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo, useCallback } from 'react';
import { createEditor, Transforms, Editor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import PropTypes from 'prop-types';

import './App.css';

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
    <Slate editor={editor} value={value} onChange={value2 => setValue(value2)}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          if (!event.ctrlKey) return;

          switch (event.key) {
            case '1': {
              event.preventDefault();
              // otherwise, set the currently selected blocks type to "code"
              const [match] = Editor.nodes(editor, {
                match: n => n.type === 'code',
              });
              Transforms.setNodes(
                editor,
                { type: match ? 'paragraph' : 'code' },
                { match: n => Editor.isBlock(editor, n) }
              );

              break;
            }

            case 'b': {
              event.preventDefault();
              console.log(Text);
              Transforms.setNodes(
                editor,
                { bold: true },
                // Apply it to text nodes, and split the text node up if the
                // selection is overlapping only part of it.
                { match: n => new Text(n), split: true }
              );
              break;
            }

            default:
          }
        }}
      />
    </Slate>
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
