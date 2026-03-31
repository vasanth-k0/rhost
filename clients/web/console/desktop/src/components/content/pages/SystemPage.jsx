import { Flex, Radio, Card, Descriptions, Badge, Button } from 'antd';
import ThemeContext from '../../context/ThemeContext'
import {useContext, useState, useEffect} from "react";
import SystemContext from '../../context/SystemContext';
import UserContext from '../../context/UserContext'

const SystemPage = () => {

    const { theme, setTheme } = useContext(ThemeContext);
    const { settings } = useContext(SystemContext);
    const [ release , setRelease ] = useState({});
    const { login } = useContext(UserContext);

    const onChange = e => {
        setTheme({...theme, active: e.target.value});
    };

    const colorThemesList = Object.keys(theme.available)

    const labelStyle = {
        height: 32,
        lineHeight: '32px',
        };

    const colorOptions = colorThemesList.map((color, index)=>{
                                return {
                                    value: color,
                                    style: labelStyle,
                                    label: color
                                }
                            })

    useEffect(()=>{
        (async()=>{
            let rel = await fetch(`https://api.github.com/repos/${settings.rhost.github_repo}/releases/latest`);
            setRelease(await rel.json());
        })();
    },[]);

    const updateSystem = ()=>{
        this.setAttribute('load', '');
        (async() => {
            const res = await fetch('/system/update');
            if(!res.ok) {
                alert('error during update');
            }
            this.removeAttribute('load');
        })();
    }
    
    const lightBg = theme.available[theme.active][1] + "08";
    const lightBgStyle = { backgroundColor: lightBg }
    const systemData= [
        {
            label: 'Version',
            span: 'filled',
            children: settings.rhost.release,
            labelStyle: lightBgStyle
        },
        {
            label: 'Last Update',
            span: 'filled',
            children: settings.rhost.last_update,
            labelStyle: lightBgStyle
        },
        {
            label: '' ,
            span: 2,
            children: login ? ( new Date(release.published_at) > new Date(settings.rhost.last_update)
                                            &&  parseFloat(release.tag_name) > parseFloat(settings.rhost.release) ) 
                                        ? <>
                                                <Badge status="processing" text={`New version rHost-${release.tag_name} available for update`} />
                                                <Button type="primary" variant="filled" onClick={updateSystem}  style={{ margin: '0px 7px' }} >
                                                    Update
                                                </Button>
                                        </> 
                                        : <Badge status="success" text='Running on latest version' />
                            : <Badge status="processing" text='Running on a previous version' />,
            labelStyle: {display: 'none', ...lightBgStyle }
        }
    ]

    const cardStyle={
        width: '50%',
        borderColor: lightBg,
        background: '#ffffffca',
        backdropFilter: 'blur(7px)',
    }

    return (
        <div style={{ 
                textAlign: 'left', 
                padding: '5px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignContent: 'center' , 
                overflow: 'scroll', 
                margin: '3rem',
                gap: '3rem'
        }}>
            <Card style={cardStyle} bodyPadding='15' headerPadding='15' title='rHost Software' size='small' headerBg={lightBg} >
                <Descriptions bordered title="System Info" items={systemData} size='small' />
            </Card>
            <Card style={cardStyle} bodyPadding='15' headerPadding='15' title='Themes' size='small' headerBg={lightBg} >
                    <div style={{ marginLeft: 10}}>
                        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 10, marginTop: 15 }}>
                            <span style={{ color: theme.available[theme.active][0] }}>◈</span>  Color
                        </div>
                        <div>
                            <Flex gap="middle"
                                style={{ 
                                    backgroundColor: lightBg,
                                    fontSize: '13px',
                                    padding: 12,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    maxWidth: '98%'
                                }}
                            >
                                <Radio.Group
                                    onChange={onChange} 
                                    defaultValue={theme.active}
                                    options={colorOptions} 
                                >
                                {/* {
                                    colorThemesList.map((colour, index)=>{
                                        return <Radio.Button value={colour}>{colour}</Radio.Button>
                                    })
                                } */}
                                </Radio.Group>
                            </Flex>
                        </div>
                    </div>
            </Card>
        </div>
    );

}

export default SystemPage;