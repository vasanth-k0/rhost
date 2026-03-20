import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const CodeEditor = () => {
  const [code, setCode] = useState("console.log('hello world!');");

  // Handle changes to the editor content
  const onChange = (value, viewUpdate) => {
    setCode(value);
    console.log('value:', value);
  };

  return (
    <CodeMirror
      value={code}
      height="200px" // Set the height of the editor
      extensions={[javascript({ jsx: true })]} // Enable JavaScript/JSX syntax highlighting
      onChange={onChange}
      theme="dark" // Optional: use a dark theme
    />
  );
};

export default CodeEditor;
