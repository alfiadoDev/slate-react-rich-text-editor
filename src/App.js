/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo, useCallback } from 'react';
import { createEditor, Transforms, Editor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

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

  // render the slate context
  return (
    <Slate editor={editor} value={value} onChange={value2 => setValue(value2)}>
      <Editable
        renderElement={renderElement}
        onKeyDown={event => {
          if (event.key === '1' && event.ctrlKey) {
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

export default App;
