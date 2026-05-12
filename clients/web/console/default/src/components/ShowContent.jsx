import {theme, Spin, Flex, Divider, Tooltip, Collapse} from 'antd';
import MenuItemContext from './context/MenuItemContext';
import FullScreener from './sub_components/FullScreener.jsx'
import ReactJsonView from '@microlink/react-json-view'
import css from "../styles/css.jsx"
import {UserContext} from './context/UserContext';

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

const ShowContent = ({content, colorPalette, context, pvt=false}) => {

    const [service, setService] = useState({"Data": "Not Available"});
    const {Apps} = useContext(AppContext);
    const {settings} = useContext(SystemContext);
    const {login} = useContext(UserContext);

      useEffect(()=>{
          if (Object.keys(Apps).includes(content)) {
                  (async()=>{
                      let res = await fetch(`${content}/config`);
                      setService(await res.json());
                  })();
          }
      },[]);

      const {showContentList} = useContext(MenuItemContext);

      let ContentComponent;
  
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
                    id = "application-container"
                    ref = {iframeRef}
                    allow = "fullscreen"
                    src = { `/${content}` + (pvt && login ? "/pvt" : "")}
                    style = {style.iframe}
                  ></iframe>
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
                    <iframe 
                        id="about-application" 
                        src={`/${content}/about`} 
                        style={{
                            ...style.iframe, 
                            height: '75%', 
                            ...((settings.ui!='dashboard')
                                ? {background:'transparent'}
                                :{}) }}>
                      </iframe>
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
                padding: context=='controls' ? '3px':0,
              }}
            >
            {ContentComponent}
          </Flex>
      );
}

export default ShowContent;