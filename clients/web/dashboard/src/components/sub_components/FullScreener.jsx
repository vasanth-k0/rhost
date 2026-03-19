import {
    FullscreenOutlined,
    FullscreenExitOutlined 
} from '@ant-design/icons';
import { useState } from 'react';

const FullScreener = ({element = document.documentElement, fullscreenstyle})=>{
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
            { fullscreen 
                   ? <FullscreenExitOutlined onClick= {toggleFullscreen} style={fullscreenstyle} />
                   :  <FullscreenOutlined onClick= {toggleFullscreen} style={fullscreenstyle} />
           }
    </> 
}

export default FullScreener;