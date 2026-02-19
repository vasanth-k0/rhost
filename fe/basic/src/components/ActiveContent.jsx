import {theme, Spin, Flex} from 'antd';
import {Suspense, lazy} from 'react'

const PageList = {
  Apps: lazy(() => import('./content/AppsPage')),
  Files: lazy(() => import('./content/FilesPage')),
  Accounts: lazy(() => import('./content/AccountsPage')),
  Members: lazy(() => import('./content/MembersPage')),
  Systems: lazy(() => import('./content/SystemsPage')),
};

const ActiveContent = ({activeContent, colorPalette}) => {

  const Page = PageList[activeContent]

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
        
    return (
        <Flex 
            style={{
              padding: 24,
              minHeight: '72.5vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
          <Suspense fallback={<div><Spin /></div>}>
            {Page ? <Page colorPalette={colorPalette} /> : <div>Page not found</div>}
          </Suspense>
        </Flex>
    );
}

export default ActiveContent;