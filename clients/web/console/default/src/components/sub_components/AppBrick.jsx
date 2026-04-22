import { useState, useEffect, useContext } from "react"
import MenuItemContext from "../context/MenuItemContext"

const AppBrick = ({colorPalette, Icon, app, appName}) => {

    const [isAppHovered, setAppHovered] = useState(false);
    const {menuItems, setMenuItems} = useContext(MenuItemContext);
    const {showContentList, setShowContentList} = useContext(MenuItemContext);
    const {setActiveContent} = useContext(MenuItemContext);
    const {setSelectedKeys} = useContext(MenuItemContext);
    const {login} = useContext(UserContext);
    const {settings} = useContext(SystemContext);

    const style = css[settings.ui];

    const openApp = ()=>{
        let newMenuItems = [...menuItems];
        let newShowContentList = structuredClone(showContentList)

         let isAppOpen = false;
         Object.values(menuItems).forEach((item)=>{
            if (item.key == app) {
                isAppOpen = true;
            }
         });
         if (!isAppOpen) {
            newMenuItems.push({
                label: appName,
                key: app,
                icon: <Icon />
             });
            newShowContentList.user[app] = appName;
         }
        setMenuItems(newMenuItems)
        setActiveContent(app)
        setShowContentList(newShowContentList);
        setSelectedKeys(app)
    }

    const itemStyle = {
        color: (isAppHovered? colorPalette.CustomColor:colorPalette.CustomColorLite),
        borderColor: (isAppHovered? colorPalette.CustomColor+'33':'transparent'),
    }
    return <div 
                                id="appbrick"
                                align="start" 
                                direction="vertical" 
                                style={{
                                    ...style.appbrick,
                                    ...itemStyle
                                    }}
                                    onClick={openApp}
                                    onMouseEnter={ () => { setAppHovered(true) }} 
                                    onMouseLeave={ () => { setAppHovered(false) }}
                                    >
                                        <Icon style={style.icon} />
                                        <span id="appname" style={style.appname}>{appName}</span>
        </div>
}

export default AppBrick;