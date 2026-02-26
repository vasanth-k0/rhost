import { useState } from "react"
import { useContext } from "react"
import MenuItemContext from "../context/MenuItemContext"

const AppBrick = ({colorPalette, Icon, app, appName}) => {

    const [isAppHovered, setAppHovered] = useState(false);
    const {menuItems, setMenuItems} = useContext(MenuItemContext);
    const {showContentList, setShowContentList} = useContext(MenuItemContext);
    const {activeContent, setActiveContent} = useContext(MenuItemContext);
    const {selectedKeys, setSelectedKeys} = useContext(MenuItemContext);

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
            newShowContentList.user.push(app)
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
                                align="start" 
                                direction="vertical" 
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer', 
                                    margin: '7px', 
                                    border: 'solid 1px transparent',
                                    borderRadius: 5,
                                    padding: '10px 7px',
                                    ...itemStyle}} 
                                    onClick={openApp}
                                    onMouseEnter={()=>{ setAppHovered(true) }} 
                                    onMouseLeave={()=>{ setAppHovered(false) }}
                                    >
                                        <Icon style={{fontSize: '19px'}} />
                                        <span style={{color: 'rgb(50, 50, 50)'}}>{appName}</span>
                    </div>
}

export default AppBrick;