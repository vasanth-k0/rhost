import {theme, Spin, Flex, Divider, Tooltip} from 'antd';
import {Suspense, lazy} from 'react';
import { useContext, useState } from 'react';
import MenuItemContext from './context/MenuItemContext';
import {CloseCircleFilled, PlusCircleFilled} from '@ant-design/icons';

const PageList = {
  Apps: lazy(() => import('./content/AppsPage')),
  Files: lazy(() => import('./content/FilesPage')),
  Accounts: lazy(() => import('./content/AccountsPage')),
  Members: lazy(() => import('./content/MembersPage')),
  System: lazy(() => import('./content/SystemPage')),
};

const ShowContent = ({content, colorPalette}) => {

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
          <div style={{
                position: 'absolute',
                top: '17px',
                right: '17px',
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
           <Divider size="small" />
           <Tooltip title="Publish" placement="left"> 
                  <PlusCircleFilled 
                        onClick={()=>{console.log('published')}} {...commonProps('publish')}
                  />
           </Tooltip>
          </div>   
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