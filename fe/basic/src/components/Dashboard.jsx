import { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  AppstoreOutlined ,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Button, Space, theme, ConfigProvider } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons';
import ActiveContent from './ActiveContent'; 

const CustomColor = '#683fcf';
const CustomColorLite = '#bca2fcab';

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Apps', 'Apps', <AppstoreOutlined />),
  getItem('Files', 'Files', <FileOutlined />),
  getItem('User', 'Users', <UserOutlined />, [
    getItem('Account', 'Accounts'),
    getItem('Members', 'Members'),
  ]),
  getItem('System', 'Systems', <DesktopOutlined />),
];
const Dashboard = () => {

    const [ activeContent, setActiveContent ] = useState('Apps')

    const headerStyle = {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'left',
        zIndex: 1000,
        marginRight: 20,
        height: '4rem'
        };

  const [collapsed, setCollapsed] = useState(true);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [currentPath, setCurrentPath] = useState([{ title: 'Apps' }])

  const menuOnclick = ({ key,keyPath })=>{
    setActiveContent(key);
    setCurrentPath([{title: key}])
  }

  return (
    <ConfigProvider
    theme={{
      components: {
        Layout: {
          siderBg: CustomColor,
        },
        Menu: {
            darkItemBg: CustomColor,
            darkItemSelectedBg: CustomColorLite,
            darkItemHoverBg: CustomColorLite,
            darkSubMenuItemBg: CustomColor,
            darkPopupBg: CustomColor, 
        },
        Tooltip: {
          colorBgSpotlight: CustomColor, 
        }
      },
    }}
  >
          <Layout style={{ minHeight: '100vh' }}>
              <Sider 
                trigger={null}
                collapsible
                collapsed={collapsed}
                onCollapse={value => setCollapsed(value)}
                width={'170px'}
                collapsedWidth={'3.7rem'}
                >
                <div className="demo-logo-vertical" />
                <Menu onClick={menuOnclick} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
              </Sider>
              <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} >
                    <div style={ headerStyle }>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                            outline: 'none',
                            }}
                        />
                        <Space size="large" style={{ marginRight: 'auto' }}>
                                <span> rHost Console </span>
                        </Space>
                        <Space>
                                <LogoutOutlined onClick={confirm} style={{marginRight: 10}} />
                        </Space>
                    </div>    
                </Header>
                <Content style={{ margin: '0 16px' }}>
                  <Breadcrumb style={{ margin: '16px 0' }} items={currentPath} />
                  <ActiveContent activeContent={activeContent}/>
                </Content>
                <Footer style={{ textAlign: 'center' , padding: '12px' }}>
                  rHost Console ©{new Date().getFullYear()} Created by Vasanth.K
                </Footer>
              </Layout>
            </Layout>
  </ConfigProvider>
  );
};
export default Dashboard;