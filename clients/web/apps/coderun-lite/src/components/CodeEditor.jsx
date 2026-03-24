import  { useCallback, useState } from 'react';
import CodeMirror , {keymap} from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { php } from "@codemirror/lang-php";
import { PlayCircleFilled } from '@ant-design/icons';
import { Tabs, Splitter } from 'antd';

const ScriptPanel = ({defaults, lang})=>{

  const [code, setCode] = useState(defaults[lang]['code']);
  const [output, setOutput] = useState("...");
  const [showShortcut, setShowShortcut] = useState(false);

  const toggleShowShortcut = ()=>{
    setShowShortcut(!showShortcut);
  }

  const onChange = (value, viewUpdate) => {
    setCode(value);
  };

  const runWithShortcut = useCallback(async (v)=>{
    await runCode();
  });

  const shortcutKeymap = keymap.of([
    {
      key: 'Alt-s',
      run: runWithShortcut,
    },
  ]);

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
        setOutput(` ${res.replace('\n','<br>')}`);
  };

  return <div style={{ height: '100%' }}>
    
                <Splitter vertical style={{ height: '83vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                      <Splitter.Panel defaultSize="65%" min="35%" max="65%">
                        <div style={{padding: '10px',}} >
                            <CodeMirror
                                value={code}
                                autoFocus={true}
                                extensions={[
                                  shortcutKeymap, 
                                  (lang=='js') ? javascript() : ( (lang=='php') ? php() : python() )
                                ]} 
                                onChange={onChange}
                                onFocus={toggleShowShortcut}
                                onBlur={toggleShowShortcut}
                            />
                        </div>
                      </Splitter.Panel>
                  <Splitter.Panel defaultSize="35%" min="35%" max="65%">
                    <div style={{padding: '10px',}} >
                        <div>
                          <span style={{ backgroundColor: '#1677ff10', borderRadius: '1rem', padding: '3px 10px' }}> {defaults[lang]['name']} • Output Terminal • STDOUT</span>
                          <PlayCircleFilled onClick={runCode}  style={{ color: '#1677ff', float: 'right', fontSize: '1.3rem', margin: '2px 10px' }} />
                          <span style={{ float: 'right' }}>{showShortcut && <>[ <small style={{color: '#1677ff'}}>Alt+s</small> ] •</>} Execute</span>
                          
                      </div>
                      <div style={{ width: '96.5%', backgroundColor: '#1677ff05', borderRadius: '5px', marginTop: '10px', padding: '10px', minHeight: '4.5rem'}}  dangerouslySetInnerHTML={{ __html: output }} >
                      </div>
                    </div>
                    
                  </Splitter.Panel>
                </Splitter>
            </div>
          
}

const CodeEditor = () => {

  const defaults = {
    php : {
      name: 'PHP',
      code: "echo 'Hello World..!';" + "\n".repeat(11)
    },
    js : {
      name: 'JavaScript',
      code: "console.log('Hello World...!');" + "\n".repeat(11)
    },
    py : {
      name: 'Python',
      code: "print('Hello World...!')" + "\n".repeat(11)
    }
  }

  const editors = Object.keys(defaults).map((lang)=>{ 
    return {
        label: defaults[lang]['name'],
        key: lang,
        children: <ScriptPanel defaults={{[lang] : defaults[lang]}} lang={lang} />
    }

  });

  return (
    <div style={{ borderRadius: '5rem', padding: '10px' }}>
      <Tabs
        size='small'
        style={{ width: '100%' }}
        tabPlacement='top'
        items={editors}
      />
    </div>
  );
};

export default CodeEditor;
