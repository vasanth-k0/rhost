import { Flex, Radio, Card, Descriptions, Badge } from 'antd';
import ThemeContext from '../../context/ThemeContext'
import {useContext, useState, useEffect} from "react";
import SystemContext from '../../context/SystemContext';

const SystemPage = () => {

    const { theme, setTheme } = useContext(ThemeContext);
    const { settings } = useContext(SystemContext);
    const [ release , setRelease ] = useState({});

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

    const systemData= [
        {
            label: 'Version',
            span: 'filled',
            children: settings.rhost.release,
        },
        {
            label: 'Last Update',
            span: 'filled',
            children: settings.rhost.last_update,
        },
        {
            label: '' ,
            span: 2,
            children: (new Date(release.published_at) > new Date(settings.rhost.last_update)) 
                            ? <Badge status="processing" text="Update available" /> 
                            : <Badge status="success" text='Running on latest version' />,
            labelStyle: {display: 'none'}
        }
    ]

    const cardStyle={
        width: '65%'
    }

    return (
        <div style={{ 
                textAlign: 'left', 
                padding: '5px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignContent: 'center' , 
                overflow: 'scroll', 
                margin: '21px',
                gap: '21px'
        }}>
            <Card style={cardStyle} bodyPadding='15' headerPadding='15' type='inner' title='rHost Software' size='small' >
                <Descriptions bordered title="System Info" items={systemData} size='small' />
            </Card>
            <Card style={cardStyle} bodyPadding='15' headerPadding='15' type='inner' title='Themes' size='small' >
                    <div style={{ marginLeft: 10}}>
                        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 10, marginTop: 15 }}>
                            <span style={{ color: theme.available[theme.active][0] }}>◈</span>  Color
                        </div>
                        <div>
                            <Flex gap="middle"
                                style={{ 
                                    backgroundColor: theme.available[theme.active][0]+"08",
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