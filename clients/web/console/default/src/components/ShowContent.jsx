import {theme, Spin, Flex, Divider, Tooltip, Collapse} from 'antd';

import MenuItemContext from './context/MenuItemContext';
import {CloseCircleFilled, PlusCircleFilled, LayoutFilled} from '@ant-design/icons';
import FullScreener from './sub_components/FullScreener.jsx'
import ReactJsonView from '@microlink/react-json-view'
import css from "../styles/css.jsx"

/**
 * Notice: Webpack requires static imports. no dynamic imports using variables supported.
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

const ShowContent = ({content, tools='show', colorPalette, context}) => {

    const [service, setService] = useState({"Data": "Not Available"});
    const {Apps} = useContext(AppContext);
    const {settings} = useContext(SystemContext);

      useEffect(()=>{
          if (Object.keys(Apps).includes(content)) {
                  (async()=>{
                      let res = await fetch(`${content}/config`);
                      setService(await res.json());
                  })();
          }
      },[]);

      const {showContentList, setShowContentList, setActiveContent} = useContext(MenuItemContext);
      const [onHover, setOnHover] = useState({
        close: false,
        publish: false,
        fullscreen:false
      });
      const {menuItems, setMenuItems} = useContext(MenuItemContext);

      let ContentComponent;

      const closeContent = ()=>{
        let newShowContentList = structuredClone(showContentList);
        let newMenuItems = menuItems.filter((item) => item.key != content);

        delete newShowContentList[content];
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
        let styleProp = tool == 'fullscreen' ? 'fullscreenstyle':'style'
          return {
              [styleProp]: commonStyle(tool), 
              onMouseEnter: ()=>{ setOnHover({...onHover, [tool]: true}) },
              onMouseLeave: ()=>{ setOnHover({...onHover, [tool]: false}) }
          }
      }

      const style = css[settings.ui];
      
      const iframeRef = useRef(null);

      if (Object.keys(showContentList.default).includes(content)) {
          const Page = context=='pages' ?  PageList[content] : ControlList[content];
          ContentComponent = <Suspense 
                                fallback={
                                  <Flex align='center' style={{ width: '100%', justifyContent: 'center' }}>
                                    <Spin />
                                    </Flex>
                                  }
                              >
                                {Page ? <Page colorPalette={colorPalette} /> : <div>Page not found</div>}
                              </Suspense>
      } else {
        if (context=='pages') {
            ContentComponent = <div style={fit}>
                <iframe 
                    ref = {iframeRef}
                    allow = "fullscreen"
                    src = {"/" + content} 
                    style = {style.iframe}
                  ></iframe>
                  {
                    tools == 'show' 
                      && <div style={{
                                  top: '10px',
                                  right: '10px',
                                  background: 'white',
                                  backdropFilter: 'blur(7px)',
                                  padding: '5px',
                                }}
                                >
                                      <Tooltip title="Close" placement="left">
                                            <CloseCircleFilled 
                                                  onClick={closeContent} {...commonProps('close')}
                                            />
                                          </Tooltip>
                                      <Divider size="small" style={{ margin: '3px 0px' }} />
                                      <Tooltip title="Publish" placement="right"> 
                                              <PlusCircleFilled 
                                                    onClick={()=>{alert('published')}} {...commonProps('publish')}
                                              />
                                      </Tooltip>
                                      <Divider size="small" style={{ margin: '3px 0px' }} />
                                      <Tooltip title="Open in new Tab" placement="right"> 
                                              <LayoutFilled 
                                                    onClick={()=>{open("/" + content, '_blank') }} {...commonProps('publish')}
                                              />
                                      </Tooltip>
                                      <Divider size="small" style={{ margin: '3px 0px' }} />
                                      <FullScreener element={iframeRef} icon='true' {...commonProps('fullscreen')} />

                            </div>   
                  }
                  
            </div>
        } else {

              const onChange = key => {
                console.log(key);
              };

               const items = [
                    {
                        key: '1',
                        label: 'Info',
                        children: <ReactJsonView
                                  style={{ fontSize: '11px' }}
                                  theme='grayscale:inverted'
                                  src={Apps[content]}
                                  iconStyle='circle'
                                  enableClipboard={false}
                                  displayObjectSize={false}
                                  displayDataTypes={false}
                                  showComma={false}
                                />,
                    },
                    {
                        key: '2',
                        label: 'Settings • ' + ( service.readonly ? "ReadOnly":"Read/Write"),
                        children:  <ReactJsonView
                                            style={{ fontSize: '11px' }}
                                            theme='grayscale:inverted'
                                            src={service}
                                            iconStyle='circle'
                                            enableClipboard={false}
                                            displayObjectSize={false}
                                            displayDataTypes={false}
                                            showComma={false}
                                        />,
                    }
                  ];

              ContentComponent = <div style={{ display: 'block', overflow: 'scroll', fontSize: '13px' , height: '92.5%'}}>
                    <iframe src={`/${content}/about`} style={{...style.iframe, height: '75%', ...((settings.ui!='dashboard')? {background:'transparent'}:{}) }}></iframe>
                    <Collapse size='small' ghost items={items} onChange={onChange} />
              </div>
          }
      }

      const {
          token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
          
      return (
          <Flex 
              style={{
                height: '100%',
                background: settings.ui != 'dashboard' ? 'transparent' : 'white',
              }}
            >
            {ContentComponent}
          </Flex>
      );
}

export default ShowContent;