import { Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import '../App.css';

const Console = () => {

    const consoleRef = useRef(null)
    const {Apps} = useContext(AppContext);
    const {theme} = useContext(ThemeContext)
    const [path, setPath] = useState([{ 
                                              title: <HomeOutlined style={{ color: 'rgb(43 43 43)', fontSize: '12px' }} /> }, 
                                              { title: 'Apps' }, 
                                              {title: 'Internal'}
                                          ])

    useEffect(()=>{
        if (consoleRef.current) {
            consoleRef.current.style.setProperty('--scrollbar-color', theme.available[theme.active][1]);
        }
    }, [theme]);

    if (!theme) {
      return <Spin />;
    }

    return (Apps !== null) ? (
    <div id='console' ref={consoleRef} style={fit}>
                        <PathCrumb.Provider value={{'path': path, 'setPath': setPath}} >
                              <Dashboard />
                        </PathCrumb.Provider>
    </div>
  ) : <div id='console' ref={consoleRef} style={fit}><Spin /></div>;
}

export default Console;