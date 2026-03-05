import {theme, Spin, Flex} from 'antd';
import {Suspense, lazy} from 'react';
import { useContext, useState } from 'react';
import MenuItemContext from './context/MenuItemContext';
import {CloseCircleFilled} from '@ant-design/icons';

const PageList = {
  Apps: lazy(() => import('./content/AppsPage')),
  Files: lazy(() => import('./content/FilesPage')),
  Accounts: lazy(() => import('./content/AccountsPage')),
  Members: lazy(() => import('./content/MembersPage')),
  System: lazy(() => import('./content/SystemPage')),
};

const ShowContent = ({content, colorPalette}) => {

  const {showContentList, setShowContentList, setActiveContent} = useContext(MenuItemContext);
  const [onHover, setOnHover] = useState(false);
  const {menuItems, setMenuItems} = useContext(MenuItemContext);

  let ContentComponent;

  const closeContent = ()=>{
    let newShowContentList = structuredClone(showContentList);
    let newMenuItems = menuItems.filter((item) => item.key != content);

    newShowContentList.user.splice(newShowContentList.user.indexOf(content), 1);
    setShowContentList(newShowContentList)
    setActiveContent('Apps')
    setMenuItems(newMenuItems)
  }
  
  if (showContentList.default.includes(content)) {
      const Page = PageList[content];
      ContentComponent = <Suspense 
                  fallback={<Flex align='center' style={{ width: '100%', justifyContent: 'center' }}><Spin /></Flex>}
                  >
                    {Page ? <Page colorPalette={colorPalette} /> : <div>Page not found</div>}
                  </Suspense>
  } else {
    ContentComponent = <>
        <iframe 
            src= {"/" + content} 
            style = {{width: '100%', height: 'auto', padding: '10px', border: 'none'}}
          ></iframe>
          <CloseCircleFilled 
              style={{ 
                position: 'absolute',
                top: '17px',
                right: '17px',
                fontSize: '17px',
                color:  (onHover ? colorPalette.CustomColor + "ff" : colorPalette.CustomColorLite + "aa")
              }} 
              onClick={closeContent} 
              onMouseEnter={()=>{ setOnHover(true) }} 
              onMouseLeave={()=>{ setOnHover(false) }}
           />
    </>
  }

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
        
    return (
        <Flex 
            style={{
              minHeight: '82.8vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              position: 'relative',
            }}
          >
          {ContentComponent}
        </Flex>
    );
}

export default ShowContent;