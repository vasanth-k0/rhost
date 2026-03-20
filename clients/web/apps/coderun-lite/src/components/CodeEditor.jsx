import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const CodeEditor = () => {
  const [code, setCode] = useState("console.log('hello world!');\n\n\n\n");

  const onChange = (value, viewUpdate) => {
    setCode(value);
    console.log('value:', value);
  };

  return (
    <CodeMirror
      value={code}
      height='77vh '
      extensions={[javascript({ jsx: true })]} 
      onChange={onChange}
    />
  );
};

export default CodeEditor;
