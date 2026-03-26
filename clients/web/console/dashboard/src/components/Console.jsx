import {useEffect, useState } from 'react';
import { Spin } from 'antd';
import Dashboard from './Dashboard';
import ThemeContext from './context/ThemeContext'
import PathCrumb from './context/PathCrumb'
import { HomeOutlined } from '@ant-design/icons';
import UserContext from './context/UserContext';
import AppContext from './context/AppContext';
import SystemContext from './context/SystemContext';

const Console = () => {

  /**
   * Get default theme and path
   */
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

             /**
             * get and set Theme
             */
            const themeUrl= "/system/theme"
            let res = await fetch(themeUrl);
            res = await res.json();
            setTheme(res);
        })();
    },[]);

    if (!theme) {
      return <Spin />;
    }

    const dasboardStyle = {
        width: '100%',
        height: '100%',
    }

    return (
    <div id='console' style={dasboardStyle}>
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
  );
}

export default Console;