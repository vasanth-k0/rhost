import {useEffect, useState } from 'react';
import { Spin } from 'antd';
import Dashboard from './Dashboard';
import SiginIn from './Signin';
import {Theme} from './context/Theme'
import PathCrumb from './context/PathCrumb'
import { HomeOutlined } from '@ant-design/icons';


export default function Console(){
    const [url , setUrl] = useState("/api/login");
    const [login, setLoginStatus] = useState(null);

    useEffect(() => {
        (async ()=>{
            let res = await fetch(url);
            res = await res.json();
            setLoginStatus(res.login);
        })();
    }, [url]);
    return (
        <div>
            {login === true ? (<ConsoleHome />) : ( login === false ? <SiginIn setUrl={setUrl} /> : null )}
        </div>
    );
}

const ConsoleHome = () => {

  /**
   * Get default theme and path
   */
    const [theme, setTheme] = useState(null);
    const [path, setPath] = useState([{ 
                                              title: <HomeOutlined style={{ color: 'rgb(43 43 43)', fontSize: '12px' }} /> }, 
                                              { title: 'Apps' }, 
                                              {title: 'Internal'}
                                          ])

    useEffect(()=>{
      (async ()=> {
        const themeUrl= "/api/theme"
        let res = await fetch(themeUrl);
        res = await res.json();
        setTheme(res);
      })();
    }, []);

    if (!theme) {
      return <Spin />;
    }

    const dasboardStyle = {
        width: '100%',
        height: '100%',
    }

    return (
    <>
    <div style={dasboardStyle}>
      <Theme.Provider value={{ theme, setTheme }}>
          <PathCrumb.Provider value={{'path': path, 'setPath': setPath}} >
              <Dashboard />
          </PathCrumb.Provider>
      </Theme.Provider>
    </div>
    </>
  );
}