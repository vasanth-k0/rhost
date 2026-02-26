import FolderBrick from "../sub_components/FolderBrick.jsx"
import {useState, useEffect} from 'react';
import { Flex, Splitter,  } from 'antd';
import * as antColour from '@ant-design/colors'
import FileExplorer from "../FileExplorer.jsx";

const FoldersList = {
        'Internal': ['internal/admin', true],
        'External': ['external', true],
        'Mysite': ['mysite', true],
        'Network': ['network', true],
        'Shared': ['shared', true]
    }

const FilesPage = ({colorPalette}) => {

  const [sizes, setSizes] = useState(['12%', '88%']);
  const [activeFileType, setActiveFileType] = useState('Internal')
  const [scanResponse, setScanResponse] = useState({});
  const [fileCount, setFileCount] = useState(0);

        const openDirectory = (path)=> {
            (async()=>{
                let res = await fetch('/files/scandir',
                    {
                        'method': 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        'body': JSON.stringify({
                            dir: path
                        })
                });
                const resp = await res.json();
                let FileList = resp['response'];
                setScanResponse(FileList);
                setFileCount(Object.keys(FileList).length);
            })();
        }

        useEffect(()=>{
            openDirectory('internal/admin');
        },[]);

    return (
        <>
            <Flex vertical gap="middle" style={{ width: '100%'}}>
                <Splitter
                    onResize={setSizes}
                    style={{ height: '82.5vh', }}
                >
                    <Splitter.Panel size={sizes[0]} resizable={true}>
                        <div className="space-align-container" style={{padding: '10px'}}>
                            <div className="space-align-block" align='start' direction="vertical">
                                {
                                    Object.keys(FoldersList).map((name, index)=>{
                                        let path = FoldersList[name][0]
                                        let dir = FoldersList[name][1]
                                        return (
                                            <FolderBrick 
                                                path={path} 
                                                name={name} 
                                                dir={dir}
                                                colorPalette={colorPalette} 
                                                active={activeFileType} 
                                                setActive={setActiveFileType}
                                                FolderClickAction={openDirectory}
                                            > </FolderBrick>
                                        )
                                    })
                                }
                                </div>
                        </div>
                    </Splitter.Panel>
                    <Splitter.Panel size={sizes[1]}>
                        <Flex>
                            <div style={{ width: '100%', height: '100%', textAlign: 'left' }} >
                                <div style={{ 
                                    marginBottom: '15px',
                                    fontWeight:500, 
                                    color:  antColour['grey'][7], 
                                    fontSize: '15px' , 
                                    padding: '10px',
                                    }} width='100'>
                                        { activeFileType }
                                        <span style={{ 
                                                border: 'solid 1px ' + colorPalette.CustomColor+'10',
                                                borderRadius: '5rem',
                                                backgroundColor : colorPalette.CustomColorLite+'08',
                                                marginLeft: '10px',
                                                padding: '2px 10px',
                                                fontSize: '12px',
                                                color: colorPalette.CustomColor
                                                }}>
                                            { fileCount }
                                        </span>
                                </div>
                                <div width='100' style={{ color: antColour['grey'][5]}}>
                                    <FileExplorer 
                                            FoldersList={scanResponse}
                                            colorPalette={colorPalette} 
                                            FolderClickAction={openDirectory}
                                    />
                                </div>
                            </div>
                        </Flex>
                    </Splitter.Panel>
                </Splitter>
            </Flex>
        </>
    )
}

export default FilesPage;