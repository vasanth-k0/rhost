import FolderBrick from "../sub_components/FolderBrick.jsx"
import {useState} from 'react';
import { Flex, Splitter, } from 'antd';
import * as antColour from '@ant-design/colors'

const FilesPage = ({colorPalette}) => {
    const basePath = 'app/storage/' 
    const FoldersList = {
        'Internal': 'internal/admin',
        'External': 'external',
        'Mysite': 'mysite',
        'Network': 'network',
        'Shared': 'shared'
    }

  const [sizes, setSizes] = useState(['12%', '88%']);
  const [activeFileType, setActiveFileType] = useState('Internal')

    return (
        <>
            <Flex vertical gap="middle" style={{ width: '100%'}}>
                <Splitter
                    onResize={setSizes}
                    style={{ height: '27rem' }}
                >
                    <Splitter.Panel size={sizes[0]} resizable={true}>
                        <div className="space-align-container" style={{padding: '10px'}}>
                            <div className="space-align-block" align='start' direction="vertical">
                                {
                                    Object.keys(FoldersList).map((name, index)=>{
                                        let path = basePath + FoldersList[name]
                                        return (
                                            <FolderBrick 
                                                path={path} 
                                                name={name} 
                                                colorPalette={colorPalette} 
                                                active={activeFileType} 
                                                setActive={setActiveFileType}
                                            > </FolderBrick>
                                        )
                                    })
                                }
                                </div>
                        </div>
                    </Splitter.Panel>
                    <Splitter.Panel size={sizes[1]}>
                        <Flex style={{ padding: 15}}>
                            <div style={{ width: '100%', height: '100%', textAlign: 'left' }} >
                                <div style={{ fontWeight:500, color:  antColour['grey'][7], fontSize: '15px' }} width='100'>{activeFileType}</div>
                                <div width='100' style={{ color: antColour['grey'][5]}}>
                                    {activeFileType}
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