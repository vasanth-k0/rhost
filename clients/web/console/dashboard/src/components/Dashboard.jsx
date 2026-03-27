import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import {
  SettingOutlined,
  FileOutlined,
  AppstoreOutlined ,
  UserOutlined,
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Button, Space, ConfigProvider, Modal, Divider } from 'antd';
import {theme as Themer} from 'antd' ;
import ContentList from './ContentList';
import ThemeContext from './context/ThemeContext'
import * as antColour from '@ant-design/colors'
import PathCrumb from './context/PathCrumb';
import MenuItemContext from './context/MenuItemContext';
import FullScreener from './sub_components/FullScreener';
import UserContext from './context/UserContext';
import ShowContent from './ShowContent';
import SystemContext from './context/SystemContext';
import AppsContext from './context/AppContext';
import * as AntIcons from '@ant-design/icons';


const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const guestMenuItems = [
  getItem('Apps', 'Apps', <AppstoreOutlined />),
  getItem('User', 'Users', <UserOutlined />, [
    getItem('Account', 'Accounts')
  ]),
  getItem('System Settings', 'System', <SettingOutlined />), 
];

const adminMenuItems = [  
                                              ...guestMenuItems, 
                                              getItem('Files', 'Files', <FileOutlined />),
                                          ];

adminMenuItems[1] = getItem('User', 'Users', <UserOutlined />, [
    getItem('Account', 'Accounts'),
    getItem('Members', 'Members')
  ])

const temp = {...adminMenuItems[1]};
adminMenuItems[1] = {...adminMenuItems[2]}
adminMenuItems[2] = temp;

const Dashboard = () => {

  const { theme } = useContext(ThemeContext);
  const { Apps } = useContext(AppsContext);
  const [ modal, contextHolder ] = Modal.useModal();
  const [ activeContent, setActiveContent ] = useState('Apps')
  const [ menuItems , setMenuItems ] = useState(guestMenuItems)
  const [showContentList, setShowContentList] = useState({
                "default" : {'Apps':'Apps', 'Files':'Files', 'Accounts':'Accounts', 'Members': 'Members', 'System':'System'},
                "user": {}
              });
  const [selectedKeys, setSelectedKeys] = useState(['Apps']);
  const {login} = useContext(UserContext);
  const {settings} = useContext(SystemContext);
  const [gotoConsole, setGotoConsole] = useState(()=>{
       if (window.location.pathname == '/console') {
          return true;
      }
      return false;
  });
    
  let siteMenuItems = Object.keys(Apps).filter( app => Apps[app].published && (settings.defaultApp != app) ).map((app) => {
    let Icon = AntIcons[Apps[app]['icon']];
    return getItem(Apps[app]['name'], app, <Icon />)
  });

if (Apps.length!=0) {
    let TempIcon = AntIcons[Apps[settings.defaultApp]['icon']];
    siteMenuItems = [ getItem(Apps[settings.defaultApp].name,  settings.defaultApp, <TempIcon />), ...siteMenuItems]
}

  useEffect(()=>{
    if (login) {
      setMenuItems(adminMenuItems);
    } else {
      setMenuItems(guestMenuItems);
    } 
  }, [login]);

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
  

  const putTheme =  async () => {
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
            )};

  useEffect(()=>{

      if (FirstRender.current) {
        FirstRender.current = false;
        return
      }

      if (login) {
        putTheme();
      }
      localStorage.setItem('theme', JSON.stringify(theme));

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

    const {
        token: { colorBgContainer },
    } = Themer.useToken();

  const menuOnclick = ({ key,keyPath })=>{
    Crumb.path[1]['title'] = key;
    Crumb.setPath([...Crumb.path])
    setActiveContent(key);
  }

  const logStyle = { 
                                cursor: 'pointer',
                                backgroundColor: CustomColorLite + '0f',
                                height: '27px',
                                padding: '6px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '3rem',
                                gap: '5px'
                            };

  const consoleLogin = (login && gotoConsole) || gotoConsole;
  const Dash = <>
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
                                  <span style={{ fontWeight: '500', padding: '0 7px', float: 'right' }}>
                                      { showContentList['default'][activeContent] 
                                            ? showContentList['default'][activeContent] 
                                            : showContentList['user'][activeContent] }
                                  </span>
                                  <Divider style={{ margin: '10px 0px' }} />
                                  <ContentList context={consoleLogin ? 'controls':'pages'} activeContent={activeContent} colorPalette={{CustomColor, CustomColorLite}} />
                              </div>
                      </div>
  </>
  
  const [ siteApp, setSiteApp ] = useState(settings['defaultApp']);

  const Site = <div style={{ width: '100%', height: '100%', display: 'flex', gap: '0.21rem' }}>
                            <Sider 
                                  trigger={null}
                                  collapsible
                                  collapsed={collapsed}
                                  onCollapse={value => setCollapsed(value)}
                                  width={'170px'}
                                  collapsedWidth={'3.8rem'}
                                  style= {{ background: colorBgContainer }}
                                  >
                                  <div className="demo-logo-vertical" />
                                  <Menu
                                        onClick={(item)=>{ setSiteApp(item.key); }}
                                        defaultSelectedKeys={[siteApp]}
                                        mode="inline"
                                        items={siteMenuItems}
                                  />
                            </Sider>
                            
                              {
                                Object.keys(Apps)
                                    .filter( app => Apps[app].published )
                                    .map((app) => {
                                        return <div style={{ width: '100%', display: (app == siteApp) ? 'block': 'none'}} >
                                              <ShowContent content={app} tools='hide' colorPalette={{CustomColor, CustomColorLite}} context='pages' />
                                            </div>
                                    })
                              }
                                    
                          </div>

  const toggleSite = ()=>{ 
  
      if (!gotoConsole) { 
            setGotoConsole(true); 
            if (!login) {
                setActiveContent('Accounts'); 
            } 
      } else { 
            setGotoConsole(false); 
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
              <Layout style={{ display: 'block', height: '100%', width: '100%', background: 'linear-gradient(to top, ' + CustomColor + '10, ' + CustomColor + '15' + ')' }} >
                <Header style={{ padding: 0, background: colorBgContainer, height: '3.5rem' }} >
                    <div style={ headerStyle }>
                        
                        <Space size="large" style={{ marginRight: 'auto' }}>
                                <span style={{ marginLeft: 10, fontWeight:500, fontSize: '19px', color: antColour['grey'][6] }} >
                                   { consoleLogin
                                        ? <>{settings['name']}  <small style={{marginLeft: '15px'}}>rHost <span style={{ fontSize: '14px' }}> Console </span></small></> 
                                        : settings['name'] 
                                    }
                                </span>
                                {
                                  login 
                                    && <Breadcrumb style={{ 
                                    margin: '12px 21px', 
                                    fontWeight: 500, 
                                    fontSize: '13px',
                                    borderRadius: '5rem',
                                    border: 'solid 1px ' + CustomColor+'10',
                                    backgroundColor : CustomColorLite+'08',
                                    padding: '5px 15px'
                                    }} items={ (activeContent!='Files') ? Crumb.path.slice(0,2): Crumb.path } />
                                }
                                
                        </Space>
                        <Space>
                                <FullScreener fullscreenstyle={{ margin: '5px' }} />
                                { login 
                                      ? <>
                                              <div onClick={toggleSite} style={logStyle} >
                                                    <span>{ gotoConsole ? 'Home •' : 'Console •'  }</span>
                                              </div>
                                              <div onClick={confirm} style={logStyle} >
                                                    <span>Logout •</span>
                                                    <LogoutOutlined  style={{color: CustomColor}} />
                                              </div>
                                        </> 
                                      : <div onClick={toggleSite} style={logStyle} >
                                              <span>{ consoleLogin ? 'Home • ' : 'Login •' }</span>
                                              <LoginOutlined style={{color: CustomColor}} />
                                        </div>
                                  }
                        </Space>
                    </div>    
                </Header>
                <div style={{ display: 'flex', width: '100%', }}>
                 
                    <Content style={{ display: (consoleLogin ? 'block' : 'none' ), width: consoleLogin ? '25%':'100%' , height: ( login ? '84' : '90' ) + '.5vh', padding: '5px'}} >
                         { Dash }
                    </Content>
                    <Content style={{ display: (consoleLogin ? 'none' : 'block' ), width: consoleLogin ? '25%':'100%' , height: ( login ? '84' : '90' ) + '.5vh', padding: '5px'}} >
                         { Site }
                    </Content>

                    {
                      (consoleLogin) && 
                        <Content style={{ width: '75%', height: ( login ? '84' : '90' ) + '.5vh', padding: '5px 5px 5px 0px'}} >
                          <div style={{ borderRadius: '7px' , height: '100%', display: 'flex' , overflow: 'hidden'}}>
                              <ContentList context='pages' activeContent={activeContent} colorPalette={{CustomColor, CustomColorLite}} />
                          </div>
                      </Content>
                    }
                    
                </div>
                { login 
                      && <Footer style={{ textAlign: 'center' , padding: '8px' , backgroundColor: colorBgContainer }}>
                                  rHost Console ©{new Date().getFullYear()} Created by Vasanth.K
                             </Footer>
                }
           </Layout>
      {contextHolder}  
    </MenuItemContext.Provider>
  </ConfigProvider>
  );
  
};
export default Dashboard;