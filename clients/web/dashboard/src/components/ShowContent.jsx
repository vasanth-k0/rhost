import {theme, Spin, Flex, Divider, Tooltip} from 'antd';
import {Suspense, lazy} from 'react';
import { useContext, useState } from 'react';
import MenuItemContext from './context/MenuItemContext';
import {CloseCircleFilled, PlusCircleFilled} from '@ant-design/icons';

/**
 * Notice: Webpack requires static imports. no dynamic imports supported.
 */
const PageList = {
  Apps: lazy(() => import('./content/pages/AppsPage.jsx')),
  Files: lazy(() => import('./content/pages/FilesPage.jsx')),
  Accounts: lazy(() => import('./content/pages/AccountsPage.jsx')),
  Members: lazy(() => import('./content/pages/MembersPage.jsx')),
  System: lazy(() => import('./content/pages/SystemPage.jsx')),
};


const ControlList = {
  Apps: lazy(() => import('./content/controls/AppsControl.jsx')),
  Files: lazy(() => import('./content/controls/FilesControl.jsx')),
  Accounts: lazy(() => import('./content/controls/AccountsControl.jsx')),
  Members: lazy(() => import('./content/controls/MembersControl.jsx')),
  System: lazy(() => import('./content/controls/SystemControl.jsx')),
};


const ShowContent = ({content, colorPalette, context}) => {

  const {showContentList, setShowContentList, setActiveContent} = useContext(MenuItemContext);
  const [onHover, setOnHover] = useState({
    close: false,
    publish: false
  });
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
  
  const commonStyle = (tool)=>{ 
        return {
            fontSize: '17px',
            color:  ( onHover[tool] 
                              ? colorPalette.CustomColor
                              : colorPalette.CustomColorLite
                        )              
        }
  }

  const commonProps = (tool) => {
      return {
          style: commonStyle(tool), 
          onMouseEnter: ()=>{ setOnHover({...onHover, [tool]: true}) },
          onMouseLeave: ()=>{ setOnHover({...onHover, [tool]: false}) }
      }
  }

  if (showContentList.default.includes(content)) {
      const Page = context=='pages' ?  PageList[content] : ControlList[content];
      ContentComponent = <Suspense 
                  fallback={<Flex align='center' style={{ width: '100%', justifyContent: 'center' }}><Spin /></Flex>}
                  >
                    {Page ? <Page colorPalette={colorPalette} /> : <div>Page not found</div>}
                  </Suspense>
  } else {
    ContentComponent = <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <iframe 
            src= {"/" + content} 
            style = {{width: '100%', height: 'auto', padding: '10px', border: 'none'}}
          ></iframe>
          <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: colorPalette.CustomColorLite + '10',
                borderColor: colorPalette.CustomColor + '10',
                borderRadius: '5px',
                padding: '5px',
              }}
              
              >
              <Tooltip title="Close" placement="left">
                <CloseCircleFilled 
                      onClick={closeContent} {...commonProps('close')}
                />
              </Tooltip>
           <Divider size="small" style={{ margin: '3px 0px' }} />
           <Tooltip title="Publish" placement="left"> 
                  <PlusCircleFilled 
                        onClick={()=>{console.log('published')}} {...commonProps('publish')}
                  />
           </Tooltip>
          </div>   
    </div>
  }

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
        
    return (
        <Flex 
            style={{
              height: '100%',
              background: 'white',
              borderRadius: borderRadiusLG,
            }}
          >
          {ContentComponent}
        </Flex>
    );
}

export default ShowContent;