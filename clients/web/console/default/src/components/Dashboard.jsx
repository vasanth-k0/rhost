import {
  SettingOutlined,
  FileOutlined,
  AppstoreOutlined ,
  UserOutlined,
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Button, Space, ConfigProvider, Modal, Divider } from 'antd';
import {theme as Themer, Spin, Tooltip, notification } from 'antd' ;
import * as antColour from '@ant-design/colors'
import * as AntIcons from '@ant-design/icons';
import { useEffect, useMemo } from 'react';


const { Header, Content, Sider } = Layout;

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

  const deskRef = useRef(null);
  const [deskRefReady, setDeskRefReady] = useState(true); // Need to check
  const { theme } = useContext(ThemeContext);
  const { Apps } = useContext(AppContext);
  const [ modal, contextHolder ] = Modal.useModal();
  const [ activeContent, setActiveContent ] = useState('Apps')
  const [ menuItems , setMenuItems ] = useState(guestMenuItems)
  const [showContentList, setShowContentList] = useState({
                "default" : {
                            'Apps':'Apps', 
                            'Files':'Files', 
                            'Accounts':'Accounts', 
                            'Members': 'Members', 
                            'System':'System'
                          },
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

  const wallp = `url("/resources/vx-${settings.wallp}.webp")`;

  useEffect(()=>{
    setGotoConsole(Boolean(settings.gotoConsole));
  },[settings]);
    
  let siteMenuItems = Object
                        .keys(Apps)
                        .filter( app => Apps[app].published && (settings.defaultApp != app) )
                        .map((app) => {
    let Icon = AntIcons[Apps[app]['icon']];
    return getItem(Apps[app]['name'], app, <Icon />)
  });

  if (Apps.length!=0) {
      let TempIcon = AntIcons[Apps[settings.defaultApp]['icon']];
      siteMenuItems = [ 
                        getItem(Apps[settings.defaultApp].name,  
                        settings.defaultApp, <TempIcon />), 
                        ...siteMenuItems
                      ]
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

    useEffect(()=>{
      if(deskRef.current) {
        setDeskRefReady(true);
      }
    },[]);

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

  const [collapsed, setCollapsed] = useState(true);
  const [controlCollapsed, setControlCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = Themer.useToken();

  const menuOnclick = ({ key,keyPath })=>{
    Crumb.path[1]['title'] = key;
    Crumb.setPath([...Crumb.path])
    setActiveContent(key);
  }

  const style = css[settings.ui];
  if (style != null) {
    style.login = {...style.login, backgroundColor: CustomColorLite + '08'}
  }

  const onControlCollapse = () => {
    if (settings.ui == 'dashboard') {
      setCollapsed(!collapsed);
    } else {
      setControlCollapsed(!controlCollapsed);
    }
  }

  const [headerDock, setHeaderDock] = useState(false);

  const dockHeader = ()=>{
    if (settings.ui == 'desktop') {
      setTimeout(()=>{
        setHeaderDock(true);
      }, 2100);
    }
  };

  const ControlStyle = {
                        
                        width: controlCollapsed ? '2.5rem' : '30%', 
                        height: '100%', 
                        background: 'white',
                        backdropFilter: 'blur(7px)',
                    }
  const CommonControlStyle = {
                              padding: '10px', 
                              alignContent: 'flex-start',
                              textAlign: 'left',
                              transition: 'all 0.3s ease',
  }
  const DeskControlStyle = {
                          width: controlCollapsed ? '2.5rem' : '35%', 
                          height: (controlCollapsed) ? '2.5rem' : '100%', 
                          background: controlCollapsed ? 'transparent' : '#ffffffca',
                          backdropFilter: controlCollapsed ? 'none' : 'blur(7px)' 
                        }
  const CommonControlBtnStyle = {
    outline: 'none',
    color: antColour['grey'][6],
    float: 'right',
  }
  const ControlBtnStyle = {
                    fontSize: '19px',
                    width: 17,
                    height: 17,
                    margin: 3,
                    }
  const DeskControlBtnStyle = {
                                fontSize: '16px',
                                width: 33,
                                height: 33,
                                margin: -5,
                                background: controlCollapsed && activeContent=="Apps" ? '#ffffffca' : 'transparent ',
                                borderRadius: activeContent=='Apps' ? '50%' : 'none'
                              }
  useEffect(()=>{
    dockHeader();
  }, [settings]);

  useEffect(()=>{
    if (settings.ui=='dashboard') {
      setControlCollapsed(false);
    } else {
      setControlCollapsed(true);
    }
  }, [settings.ui]);


  const consoleLogin = (login && gotoConsole) || gotoConsole;

  const Controls = <div id="controls" style={{...CommonControlStyle , ...(settings.ui == 'desktop' ? DeskControlStyle: ControlStyle)}}>
                    <Button
                    type="text"
                    icon={controlCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    onClick={onControlCollapse}
                    style={{...CommonControlBtnStyle, ...(settings.ui == 'desktop' ? DeskControlBtnStyle : ControlBtnStyle)}}
                    />
                    <span style={{ fontWeight: '500', padding: '0 7px', display: controlCollapsed ? 'none':'block' }}>
                    { showContentList['default'][activeContent] 
                        ? showContentList['default'][activeContent] 
                        : showContentList['user'][activeContent] }
                    </span>
                    <Divider style={{ margin: '10px 0px' }} />
                    <div style={{ display : controlCollapsed ? 'none':'block', height: '78vh' }} >
                    <ContentList context={consoleLogin ? 'controls':'pages'} activeContent={activeContent} colorPalette={{CustomColor, CustomColorLite}} />
                    </div>

                    </div>

  const Dash = <>
                <div id="dash" style={style != null ? style.dash: ""}>
                  <div id="task" style={settings.ui == 'desktop' ? style.task : {height: '100%'}}>
                  { 
                    settings.ui != 'desktop' &&
                      <Sider 
                          trigger={null}
                          collapsible
                          collapsed={collapsed}
                          onCollapse={value => setCollapsed(value)}
                          width={'170px'}
                          collapsedWidth={'3.8rem'}
                          style={{height: '100%'}}
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
                  }
                  {
                    settings.ui == 'desktop' &&
                    <Menu 
                      mode="horizontal"
                      onClick={menuOnclick} 
                      theme="dark" 
                      selectedKeys={[activeContent]} 
                      defaultSelectedKeys={['Apps']} 
                      items={menuItems}
                      style={ style!=null ? style.toolmenu:{} }
                  />
                  }
                  </div>
                
                {(settings.ui=='dashboard') && Controls}
                {(settings.ui=='dashboard') && <Divider orientation="vertical" style={{ height: '100%' }} />}
                <Content style={fill} >
                    <ContentList context='pages' activeContent={activeContent} colorPalette={{CustomColor, CustomColorLite}} />
                </Content>
                {(settings.ui!='dashboard') && Controls}
              </div>
              </>

const [ siteApp, setSiteApp ] = useState(settings['defaultApp']);

const Site = <div id="site" style={{ 
                  ...fit,
                  alignItems: 'normal',
              }}>
                <Sider 
                      trigger={null}
                      collapsible
                      collapsed={true}
                      width={'170px'}
                      collapsedWidth={'3.8rem'}
                      >
                      <div className="demo-logo-vertical" />
                      <Menu
                            onClick={(item)=>{ setSiteApp(item.key); }}
                            defaultSelectedKeys={[siteApp]}
                            mode="inline"
                            theme="dark" 
                            items={siteMenuItems}
                      />
                </Sider>
                
                  {
                    Object.keys(Apps)
                        .filter( app => Apps[app].published )
                        .map((app) => {
                            return <div style={{ ...fill, display: (app == siteApp) ? 'block': 'none'}} >
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

  return  (
   (settings.ui != null) ? 
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
             <Layout style={{ 
                 ...fit,
                 display: 'block',
                 backgroundColor: 'linear-gradient(to top, ' + CustomColor + '05, ' + CustomColor + '07' + ')'
                 }} 
             >
               <Header style={{
                          ...style.headr, 
                          ...(settings.ui=='desktop' 
                              ? {top : headerDock ? '-2.1rem' : '7px'}
                              :{})
                          }} 
                        onMouseEnter={()=>{setHeaderDock(false);}} 
                        onMouseLeave={dockHeader} >
                   <div style={ style.header }>
                       <Space size="large" style={{ marginRight: 'auto', height: '40px' }}>
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
                       <Space style={{ height: '40px' }}>
                               { deskRefReady && <FullScreener fullscreenstyle={{ margin: '5px' }} /> }
                               <Tooltip  title={"rHost © " + new Date().getFullYear() + " - by Vasanth.K"} placement="right" >
                                    <InfoCircleOutlined onClick={ ()=>{  notification.info({
                                        message: 'rHost',
                                        description: `This site is powered by rHost web operating system`,
                                        placement: 'bottomRight',
                                        duration: 3, 
                                    });} }/>
                              </Tooltip>
                               { login 
                                     ? <>
                                             <div onClick={toggleSite} style={style.login} >
                                                   <span>{ gotoConsole ? 'Home •' : 'Console •'  }</span>
                                             </div>
                                             <div onClick={confirm} style={style.login} >
                                                   <span>Logout •</span>
                                                   <LogoutOutlined  style={{color: CustomColor}} />
                                             </div>
                                       </> 
                                     : <div onClick={toggleSite} style={style.login} >
                                             <span>{ consoleLogin ? 'Home • ' : 'Login •' }</span>
                                             <LoginOutlined style={{color: CustomColor}} />
                                       </div>
                                 }
                       </Space>
                   </div>    
               </Header>
               
               <div id="body" layout={settings.ui} style={{
                                    ...style.body, 
                                    ...(consoleLogin 
                                        ? {padding: settings.ui == 'dashboard' 
                                            ? '0px 10px 0px 10px' 
                                            : settings.ui == 'hybrid' ? '10px' : 0} 
                                        : {}) }}>

                   <div id="base" ref={deskRef}
                         style={{
                                ...style.base,
                                backgroundImage: wallp,
                                ...( !consoleLogin ? {borderRadius:0} : {} )
                          }}>
                       
                           <Content style={{ display: (consoleLogin ? 'block' : 'none' ), ...fill, width: 'auto' }} >
                               { Dash }
                           </Content>
                           <Content style={{ display: (consoleLogin ? 'none' : 'block' ), ...fill }} >
                               { Site }
                           </Content>

                       </div>
               </div>
               
          </Layout>
     {contextHolder}  
   </MenuItemContext.Provider>
 </ConfigProvider>
  : <Spin />);
  
};
export default Dashboard;