import  { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { php } from '@codemirror/lang-php';
import { PlayCircleFilled } from '@ant-design/icons';
import { Tabs, Spin } from 'antd';
import { renderToStaticMarkup } from 'react-dom/server';

const ScriptPanel = ({lang})=>{

  const defaults = {
    php : "echo 'Hello World..!';\n\n\n\n",
    js : "console.log('Hello World...!');\n\n\n\n",
    py : "print('Hello World...!')\n\n\n\n"
  }
  const [code, setCode] = useState(defaults[lang]);
  const [output, setOutput] = useState("Output: ");

  const onChange = (value, viewUpdate) => {
    setCode(value);
  };

  const runCode = async ()=>{

      setOutput('Script getting executed. Please wait ...');
      const outp = await fetch(
                                '/coderun-lite/' + lang, { 
                                  method: 'POST', 
                                  headers: {
                                    'Content-Type': 'application/json; charset=UTF-8'
                                  }, 
                                  body: JSON.stringify({script: code.trim()})
                                });
        const res = await(outp.text());
        setOutput(`Output:<br><small> ${res.replace('\n','<br>')}<small>`);
  };

  return <div style={{height: '100vh'}}>
                <CodeMirror
                    value={code}
                    height='77vh '
                    extensions={[
                      (lang=='js') ? javascript() : ( (lang=='php') ? php() : python() )
                    ]} 
                    onChange={onChange}
                />
                <PlayCircleFilled onClick={runCode}  style={{position: 'absolute', bottom: '5rem', right: '3rem'}} />
                <div style={{ width: '100%', height: '21vh', padding: '5px'}}  dangerouslySetInnerHTML={{ __html: output }} >
                </div>
            </div>
}

const CodeEditor = () => {

  const editors = ['php', 'js', 'py'].map((lang)=>{ 
    return {
        label: lang.toUpperCase(),
        key: lang,
        children: <ScriptPanel lang={lang} />
    }

  });

  return (
    <>
      <Tabs
        style={{ width: '100%', height: '100vh' }}
        tabPlacement='end'
        items={editors}
      />
    </>
  );
};

export default CodeEditor;
