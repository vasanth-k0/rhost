import {theme, Spin, Flex} from 'antd';
import {Suspense, lazy} from 'react';
import { useContext } from 'react';
import MenuItemContext from './context/MenuItemContext';

const PageList = {
  Apps: lazy(() => import('./content/AppsPage')),
  Files: lazy(() => import('./content/FilesPage')),
  Accounts: lazy(() => import('./content/AccountsPage')),
  Members: lazy(() => import('./content/MembersPage')),
  System: lazy(() => import('./content/SystemPage')),
};

const ShowContent = ({content, colorPalette}) => {

  const {showContentList} = useContext(MenuItemContext);
  let ContentComponent;
  
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
            style = {{width: '100%', height: '100%', padding: '10px', border: 'none'}}
          ></iframe>
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
            }}
          >
          {ContentComponent}
        </Flex>
    );
}

export default ShowContent;