import {
    FullscreenOutlined,
    FullscreenExitOutlined,
    UpCircleFilled 
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useState } from 'react';

const FullScreener = ({element = document.documentElement,  onMouseEnter, onMouseLeave, fullscreenstyle = {}, icon = null})=>{
    const [fullscreen, setFullScreen] = useState(false);
    element = element.current || element;
    const toggleFullscreen = () => {
        setFullScreen(!fullscreen)
        if (!fullscreen) {
        element.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
        document.exitFullscreen();
        }
  }

    return <>
            <Tooltip title="Fullscreen" placement="right"> 
                {
                    icon ? <UpCircleFilled onClick= {toggleFullscreen} style={fullscreenstyle} onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave} />
                        : (
                            fullscreen 
                                ? <FullscreenExitOutlined onClick= {toggleFullscreen} style={fullscreenstyle} onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave} />
                                :  <FullscreenOutlined onClick= {toggleFullscreen} style={fullscreenstyle} onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave} />
                        )
                }
            </Tooltip>
    </> 
}

export default FullScreener;