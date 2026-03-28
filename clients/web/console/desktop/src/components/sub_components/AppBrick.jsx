import { useState, useEffect, useContext } from "react"
import MenuItemContext from "../context/MenuItemContext"
import UserContext from '../context/UserContext';

const AppBrick = ({colorPalette, Icon, app, appName}) => {

    const [isAppHovered, setAppHovered] = useState(false);
    const {menuItems, setMenuItems} = useContext(MenuItemContext);
    const {showContentList, setShowContentList} = useContext(MenuItemContext);
    const {setActiveContent} = useContext(MenuItemContext);
    const {setSelectedKeys} = useContext(MenuItemContext);
    const {login} = useContext(UserContext);

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
        borderColor: (isAppHovered? '#ffffff25' : colorPalette.CustomColor+'25'),
    }
    return <div 
                                align="start" 
                                direction="vertical" 
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '5px',
                                    cursor: 'pointer', 
                                    margin: '0', 
                                    border: 'solid 1px white',
                                    borderRadius: 5,
                                    padding: '10px 7px',
                                    fontSize: '12px',
                                    background: '#ffffff60',
                                    backdropFilter: 'blur(10px)',
                                    width: '5.5rem',
                                    ...itemStyle}} 
                                    onClick={openApp}
                                    onMouseEnter={ () => { setAppHovered(true) }} 
                                    onMouseLeave={ () => { setAppHovered(false) }}
                                    >
                                        <Icon style={{fontSize: '17px', filter: 'brightness(0.7)'}} />
                                        <span style={{color: 'rgb(50, 50, 50)'}}>{appName}</span>
        </div>
}

export default AppBrick;