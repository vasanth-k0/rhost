import { Button, Card, Form, Input, notification, Tabs } from 'antd';
import { useState, useEffect, useContext } from 'react';
import UserContext from './context/UserContext';
import MenuItemContext from './context/MenuItemContext';
import ThemeContext from './context/ThemeContext';

const SignIn = () => {

    const [url, setUrl] = useState('/system/login');
    const {setLoginStatus} = useContext(UserContext);
    const {setActiveContent} = useContext(MenuItemContext)
    const {theme} = useContext(ThemeContext)

    const onFinish = formData => {
        setUrl('/system/login?username=' + formData.username + '&password=' + formData.password);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

        useEffect(() => {
        (async ()=>{
            let res = await fetch(url);
            res = await res.json();
            setLoginStatus(res.login);
            if (!res.login && url != '/system/login') {
                notification.error({
                    message: 'Login failed',
                    description: `Please enter valid credentials and retry.`,
                    placement: 'bottomRight',
                    duration: 3, 
                });
                setTimeout(()=>{setUrl('/system/login');}, 2500);
            }
            if (res.login) {
                setActiveContent('Apps');
            }
        })();
    }, [url]);

    const loginForm = <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ minWidth: 320, alignItems: 'center', margin: '15px' }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            >
                            <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                            <Input />
                            </Form.Item>

                            <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                            <Input.Password />
                            </Form.Item>

                            <Form.Item label={null}>
                            <Button type="primary" variant="filled" htmlType="submit">
                                Submit
                            </Button>
                            
                            </Form.Item>
                        </Form>

        const loginFormStyle = {
            width: '100%', 
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '6rem',
            minWidth: '400px'
        }

        const items = [
        {
            key: '1',
            label: 'Social Login',
            children: <div style={{ minWidth: 320, marginTop: '25px' }}>Social login</div>,
        },
        {
            key: '2',
            label: 'Admin Login',
            children: loginForm,
        },
        ];
        return (
        
        <div style={{ position: 'relative', width: '100%' }}>
                <div style={ loginFormStyle }>
                        <Tabs style={{ 
                                                height: '56%', 
                                                width : '30rem',
                                                padding: '3rem', 
                                                borderRadius: '5px', 
                                                alignItems: 'center'
                                            }} 
                        tabPlacement='top'  defaultActiveKey="1" items={items} onChange={()=>{console.log('')}} />
                </div>
        </div>
        
    );

}

export default SignIn;