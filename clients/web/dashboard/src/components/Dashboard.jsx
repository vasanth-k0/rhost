import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import {
  SettingOutlined,
  FileOutlined,
  AppstoreOutlined ,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Button, Space, ConfigProvider, Modal, Divider } from 'antd';
import {theme as Themer} from 'antd' ;
import { 
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined 
} from '@ant-design/icons';
import ContentList from './ContentList';
import {useTheme} from './context/Theme'
import * as antColour from '@ant-design/colors'
import PathCrumb from './context/PathCrumb';
import MenuItemContext from './context/MenuItemContext';

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
  getItem('System Settings', 'System', <SettingOutlined />),
];

const Dashboard = () => {

  const { theme, setTheme } = useTheme();
  const [ modal, contextHolder ] = Modal.useModal();
  const [ activeContent, setActiveContent ] = useState('Apps')
  const [ menuItems , setMenuItems ] = useState(items)
  const [showContentList, setShowContentList] = useState({
                "default" : ['Apps', 'Files', 'Accounts', 'Members', 'System'],
                "user": []
              });
  const [selectedKeys, setSelectedKeys] = useState(['Apps']);


  const getCustomColor = ({theme, lite=null})=>{
    let colorTheme = theme.active;
    let activeTheme  = theme.available[colorTheme]
    colorTheme = colorTheme.toLowerCase(); // donot move
     if (/^(?!#)/.test(activeTheme[0])) {
      activeTheme[0] = antColour[colorTheme][activeTheme[0]];
      activeTheme[1] = antColour[colorTheme][activeTheme[1]];
    }
    return lite? activeTheme[1]: activeTheme[0]
  }
  const CustomColor = useMemo(()=>{
    return getCustomColor({theme})
  },[theme]);

  const CustomColorLite =useMemo(()=>{
    return getCustomColor({theme, lite:true})
  }, [theme])

  const Crumb = useContext(PathCrumb)

  const FirstRender = useRef(true);
  useEffect(()=>{
      if (FirstRender.current) {
        FirstRender.current = false;
        return
      }
      (
        async () => {
          await fetch('/system/theme',
                {
                    'method': 'POST',
                     headers: {
                        'Content-Type': 'application/json'
                      },
                    'body': JSON.stringify({
                        'active': theme.active
                    })
                }
            )}
        )();
  },[theme]);

    const confirm = () => {
      modal.confirm({
        title: 'Confirm',
        content: 'You are about to sign out. Do you want to continue?',
        okText: 'Signout',
        cancelText: 'Cancel',
        async onOk() {
              let res = await fetch('/system/logout');
              res = await res.json();
              if (res.logout === true) {
                  window.location.reload();
              }
        },
      });
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'left',
        zIndex: 1000,
        marginRight: 20,
        height: '3.5rem'
        };

  const [collapsed, setCollapsed] = useState(true);
  const [fullscreen, setFullScreen] = useState(false);

    const {
        token: { colorBgContainer },
    } = Themer.useToken();

  const menuOnclick = ({ key,keyPath })=>{
    Crumb.path[1]['title'] = key;
    Crumb.setPath([...Crumb.path])
    setActiveContent(key);
  }

  const toggleFullscreen = () => {
    setFullScreen(!fullscreen)
    if (!fullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
      document.exitFullscreen();
    }
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
        MenuItem: {
          paddingLeft : '1px'
        },
        Tooltip: {
          colorBgSpotlight: CustomColor, 
        }
      },
    }}
  >
    <MenuItemContext.Provider value={{
          menuItems, 
          setMenuItems, 
          showContentList, 
          setShowContentList, 
          activeContent, 
          setActiveContent,
          selectedKeys,
          setSelectedKeys
          }}>             
              <Layout style={{ display: 'block', height: '100%', width: '100%', backgroundColor: CustomColor+'15' }} >
                <Header style={{ padding: 0, background: colorBgContainer, height: '3.5rem' }} >
                    <div style={ headerStyle }>
                        
                        <Space size="large" style={{ marginRight: 'auto' }}>
                                <span style={{ marginLeft: 10, fontWeight:500, fontSize: '19px', color: antColour['grey'][6] }} >
                                   rHost 
                                   <span style={{ fontSize: '14px' }}> Console </span>
                                </span>
                                <Breadcrumb style={{ 
                                    margin: '12px 21px', 
                                    fontWeight: 500, 
                                    fontSize: '13px',
                                    borderRadius: '5rem',
                                    border: 'solid 1px ' + CustomColor+'10',
                                    backgroundColor : CustomColorLite+'08',
                                    padding: '5px 15px'
                                    }} items={ (activeContent!='Files') ? Crumb.path.slice(0,2): Crumb.path } />
                        </Space>
                        <Space>
                                { fullscreen 
                                        ? <FullscreenExitOutlined onClick= {toggleFullscreen} style={{ margin: '10px' }} />
                                        :  <FullscreenOutlined onClick= {toggleFullscreen} style={{ margin: '10px' }} />
                                }
                                <LogoutOutlined onClick={confirm} style={{marginRight: 10, color: CustomColor}} />
                        </Space>
                    </div>    
                </Header>
                <div style={{ display: 'flex', width: '100%', }}>
                      <Content style={{ width: '25%', height: '84.5vh', padding: '5px'}} >
                      <div style={{ borderRadius: '7px' , height: '100%', display: 'flex' , overflow: 'hidden', backgroundColor: 'white' }}>
                            <Sider 
                                  trigger={null}
                                  collapsible
                                  collapsed={collapsed}
                                  onCollapse={value => setCollapsed(value)}
                                  width={'170px'}
                                  collapsedWidth={'3.8rem'}
                                  >
                                  <div className="demo-logo-vertical" />
                                  <Menu 
                                      onClick={menuOnclick} 
                                      theme="dark" 
                                      selectedKeys={[activeContent]} 
                                      defaultSelectedKeys={['Apps']} 
                                      mode="inline" 
                                      items={menuItems} 
                                  />
                            </Sider>
                            <div style={{padding: '10px', width: '100%', height: '100%', alignContent: 'flex-start', textAlign: 'left' }}>
                              <Button
                                    type="text"
                                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    onClick={() => setCollapsed(!collapsed)}
                                    style={{
                                    fontSize: '19px',
                                    width: 17,
                                    height: 17,
                                    outline: 'none',
                                    color: antColour['grey'][6],
                                    marginRight: 7, 
                                    marginTop: 3
                                    }}
                                />
                                  <span style={{ padding: '0 7px', float: 'right' }}>{activeContent}</span>
                                  <Divider style={{ margin: '10px 0px' }} />
                                  <ContentList context='controls' activeContent={activeContent} colorPalette={{CustomColor, CustomColorLite}} />
                              </div>
                      </div>
                    </Content>
                    <Content style={{ width: '75%', height: '84.5vh', padding: '5px 5px 5px 0px'}} >
                        <div style={{ borderRadius: '7px' , height: '100%', display: 'flex' , overflow: 'hidden'}}>
                            <ContentList context='pages' activeContent={activeContent} colorPalette={{CustomColor, CustomColorLite}} />
                        </div>
                    </Content>
                
                </div>
                <Footer style={{ textAlign: 'center' , padding: '8px' , backgroundColor: colorBgContainer }}>
                  rHost Console ©{new Date().getFullYear()} Created by Vasanth.K
                </Footer>
           </Layout>
      {contextHolder}  
    </MenuItemContext.Provider>
  </ConfigProvider>
  );
};
export default Dashboard;