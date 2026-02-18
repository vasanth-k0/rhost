import {useEffect, useState } from 'react';
import { Modal } from 'antd';
import Dashboard from './Dashboard';
import SiginIn from './Signin';

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
    const [modal, contextHolder] = Modal.useModal();

  const confirm = () => {
    modal.confirm({
      title: 'Confirm',
      content: 'You are about to sign out. Do you want to continue?',
      okText: 'Signout',
      cancelText: 'Cancel',
      async onOk() {
            let res = await fetch('/api/logout');
            res = await res.json();
            if (res.logout === true) {
                window.location.reload();
            }
      },
    });
  };

    const dasboardStyle = {
        width: '100%',
        height: '100%',
    }
  return (
    <>
    
    <div style={dasboardStyle}>
        <Dashboard />
    </div>
     
      {contextHolder}
    </>
  );
}