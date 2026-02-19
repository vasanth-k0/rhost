import { Space } from "antd"
import { FolderFilled } from '@ant-design/icons';
import { useState } from 'react'

const FolderBrick = ({name, path, colorPalette})=>{

    const [isFolderBrickHovered, setFolderBrickHovered] = useState(false);

    return (<>
    <div path={path} name={name} className="space-align-block" style={{ 
                                    cursor: 'pointer',
                                    margin: 8,
                                    fontSize: 14, 
                                    border: 'solid 2px transparent',
                                    borderRadius: 3,
                                    borderLeftColor: !isFolderBrickHovered? 'transparent': colorPalette.CustomColor,
                                    paddingLeft: '4px'
                                }} 
                    onMouseEnter={()=>{ setFolderBrickHovered(!isFolderBrickHovered) }} 
                    onMouseLeave={()=>{ setFolderBrickHovered(!isFolderBrickHovered) }}
                    onClick={(e)=>{console.log('clicked', e.currentTarget.getAttribute('name'))}}>
                                <Space align='start' style={{margin:2, fontSize: 15}}>
                                        <FolderFilled style={{ color: colorPalette.CustomColor }}/>
                                </Space>
                                <Space align='end' style={{margin:2}}>{name}</Space>
                            </div>
    </>)
}

export default FolderBrick;