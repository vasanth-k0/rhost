import {
    FullscreenOutlined,
    UpCircleFilled 
} from '@ant-design/icons';
import { Tooltip } from 'antd';

const FullScreener = ({element = document.documentElement,  onMouseEnter, onMouseLeave, fullscreenstyle = {}, icon = null})=>{

    element = element.current || element || document.documentElement;
    const goFullscreen = () => {
        element.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
  }

    return <>
            <Tooltip title="Fullscreen" placement="right"> 
                {
                    icon ? <UpCircleFilled onClick= {goFullscreen} style={fullscreenstyle} onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave} />
                        : <FullscreenOutlined onClick= {goFullscreen} style={fullscreenstyle} onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave} />
                }
            </Tooltip>
    </> 
}

export default FullScreener;