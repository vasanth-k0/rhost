import { Button, Card, Form, Input, } from 'antd';

const SiginIn = ({setUrl}) => { 
    const onFinish = formData => {
        setUrl('/api/login?username=' + formData.username + '&password=' + formData.password);
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const loginFormStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', 
        width: 400, 
    }

    const loginForm = () => (
        <div style={ loginFormStyle }>
            <Card title="rHost Console" >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 320 }}
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
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    </Form.Item>
                </Form>
        </Card>
        </div>
    );
    return loginForm();
}

export default SiginIn;