import {useEffect, useState, useRef } from 'react';
import { Spin } from 'antd';
import Dashboard from './Dashboard';
import ThemeContext from './context/ThemeContext'
import PathCrumb from './context/PathCrumb'
import { HomeOutlined } from '@ant-design/icons';
import UserContext from './context/UserContext';
import AppContext from './context/AppContext';
import SystemContext from './context/SystemContext';
import '../App.css';

const Console = () => {

  /**
   * Get default theme and path
   */
    const consoleRef = useRef(null)
    const [login, setLoginStatus] = useState(null);
    const [theme, setTheme] = useState(null);
    const [Apps, setApps] = useState([]);
    const [settings, setSettings] = useState([]);
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
    

    const getTheme = async ()=>{
        const themeUrl= "/system/theme"
        let res = await fetch(themeUrl);
        res = await res.json();
        setTheme(res);
        localStorage.setItem('theme', JSON.stringify(res));
    }

    useEffect(()=>{
        (async()=>{

            /**
             * get and set System settings
             */
            const settingsUrl= "/system/settings"
            let sets = await fetch(settingsUrl);
            sets = await sets.json();
            setSettings(sets);

            /**
             * get and set AppList
             */
            let appList = await fetch("/apps/list");
            appList = await appList.json();
            setApps(appList);
                        
        })();
    },[]);

    useEffect(()=>{
        (async()=>{
            /**
             * get and set Theme
             */
            if ( !login ) {
                let localTheme = localStorage.getItem('theme');
                if ( localTheme != null) {
                    setTheme(JSON.parse(localTheme));
                } else {
                    getTheme();
                }
            } else {
                getTheme();
            }
        })();
    }, [login]);

    if (!theme) {
      return <Spin />;
    }

    const dashboardStyle = {
        width: '100%',
        height: '100%',
    }

    return (Apps.length!=0) ? (
    <div id='console' ref={consoleRef} style={dashboardStyle}>
      <SystemContext.Provider value={{ settings, setSettings }} >
          <AppContext.Provider value={{ Apps, setApps }}>
                <UserContext.Provider value={{ login, setLoginStatus }}>
                    <ThemeContext.Provider value={{ theme, setTheme }}>
                        <PathCrumb.Provider value={{'path': path, 'setPath': setPath}} >
                              <Dashboard />
                        </PathCrumb.Provider>
                    </ThemeContext.Provider>
                </UserContext.Provider>
          </AppContext.Provider>
      </SystemContext.Provider>
    </div>
  ) : <div id='console' ref={consoleRef} style={dashboardStyle}>Loading</div>;
}

export default Console;