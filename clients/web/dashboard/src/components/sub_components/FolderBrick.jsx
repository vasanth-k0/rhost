import { Space } from "antd"
import { FolderFilled, FileFilled } from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react'
import PathCrumb from "../context/PathCrumb";

const FolderBrick = ({name, path, dir, colorPalette, active, setActive,FolderClickAction})=>{

    const [isFolderBrickHovered, setFolderBrickHovered] = useState(null);
    
    useEffect(()=>{
        setFolderBrickHovered((active==name)? true:false);
    }, [active, name]);

    const Crumb = useContext(PathCrumb)

    const FolderClick = (e)=>{
        setActive(name)
        let level = 3;
        Crumb.path[level-1] = {'title': name};
        Crumb.setPath([...Crumb.path]);
        FolderClickAction(path)
    }

    const itemStyle= {
        color: (isFolderBrickHovered? colorPalette.CustomColor:colorPalette.CustomColorLite)
    }
    
    return (<>
    <div path={path} name={name} className="space-align-block" style={{ 
                                    cursor: 'pointer',
                                    margin: 8,
                                    fontSize: 14, 
                                    border: 'solid 1px transparent',
                                    borderRadius: 3,
                                    borderColor: !isFolderBrickHovered? 'transparent': colorPalette.CustomColorLite+'33' ,
                                    paddingLeft: '4px'
                                }} 
                    onMouseEnter={()=>{ if (active!=name) {setFolderBrickHovered(!isFolderBrickHovered)} }} 
                    onMouseLeave={()=>{ if (active!=name) {setFolderBrickHovered(!isFolderBrickHovered)} }}
                    onClick={FolderClick}>
                                <Space align='start' style={{margin:2, fontSize: 15}}>
                                    { dir? <FolderFilled style={ itemStyle }/> : <FileFilled style={ itemStyle } />}
                                        
                                </Space>
                                <Space align='end' style={{margin:3}}>{name}</Space>
                            </div>
    </>)
}

export default FolderBrick;