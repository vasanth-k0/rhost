import { Flex, Radio, Card, Descriptions, Badge, Button, Modal } from 'antd';
import ThemeContext from '../../context/ThemeContext'
import {useContext, useState, useEffect} from "react";
import SystemContext from '../../context/SystemContext';
import UserContext from '../../context/UserContext'

const SystemPage = () => {

    const { theme, setTheme } = useContext(ThemeContext);
    const { settings, setSettings } = useContext(SystemContext);
    const [ release , setRelease ] = useState({});
    const { login } = useContext(UserContext);
    const [ modalStatus, setModalStatus ] = useState(false);
    const [ preferredLayout, setPreferredLayout ] = useState(settings.ui);

    const onColorChange = e => {
        setTheme({...theme, active: e.target.value});
    };
    
    const onLayoutChange = async (e) => {
        await fetch('/system/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ui: preferredLayout })
        }).then(()=>{
            setModalStatus(false);
            location.href = '/';
        })
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
    const layoutOptions = settings.layoutOptions.map((layout, index)=>{
                                return {
                                    value: layout.toLowerCase(),
                                    style: labelStyle,
                                    label: layout
                                }
                            })

    useEffect(()=>{
        (async()=>{
            let rel = await fetch(`https://api.github.com/repos/${settings.rhost.github_repo}/releases/latest`);
            setRelease(await rel.json());
        })();
    },[]);

    const updateSystem = (event)=>{
        event.target.setAttribute('load', '');
        (async() => {
            const res = await fetch('/system/update');
            if(!res.ok) {
                alert('error during update');
            }
            event.target.removeAttribute('load');
        })();
    }
    
    const primaryColor = theme.available[theme.active][0];
    const secondaryColor = theme.available[theme.active][1];
    const lightBg = secondaryColor + "08";
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
                                                <Button color="cyan"  size='small' variant="filled" onClick={updateSystem}  style={{ margin: '0px 7px', float: 'right' }} >
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
        borderRadius: 0
    }

    const themeStyle = { 
                                    backgroundColor: lightBg,
                                    fontSize: '13px',
                                    padding: 12,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    maxWidth: '98%'
                                };

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
                                    <div>
                        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 10, marginTop: 15 }}>
                            <span style={{ color: theme.available[theme.active][0] }}>◈</span>  Layout
                        </div>
                        <Flex gap="middle"
                                style={themeStyle}
                            >
                        <Radio.Group
                                style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '16px',
                                        padding: '5px',
                                    }}
                                    onChange={(e)=>{setPreferredLayout(e.target.value); setModalStatus(true);}} 
                                    defaultValue={preferredLayout}
                                    options={layoutOptions} 
                                    value={preferredLayout}
                                ></Radio.Group>
                            </Flex>
                    </div>
                    <div style={{ marginLeft: 10}}>
                        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 10, marginTop: 15 }}>
                            <span style={{ color: theme.available[theme.active][0] }}>◈</span>  Colour Palette
                        </div>
                        <div>
                            <Flex gap="middle"
                                style={themeStyle}
                            >
                                <Radio.Group
                                    onChange={onColorChange} 
                                    defaultValue={theme.active}
                                    //options={colorOptions} 
                                >
                                {colorOptions.map(opt => (
                                            <Radio
                                                size='small'
                                                key={opt.value} 
                                                value={opt.value}
                                                style={{ width: '7.5rem', marginInlineEnd: 0 }}
                                            >
                                                {opt.label}
                                            </Radio>
                                        ))}
                                </Radio.Group>
                            </Flex>
                        </div>
                    </div>
            </Card>
            
            <Modal
                    title="System Settings Update"
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    open={modalStatus}
                    onOk={onLayoutChange}
                    onCancel={()=>{setPreferredLayout(settings.ui);setModalStatus(false)} }
                >
                    <p>Please note that the session will be reloaded with the new Layout</p>
                    <p>Any unsaved changes will be lost.</p>
            </Modal>

        </div>
    );

}

export default SystemPage;