import { Flex, Radio, Divider } from 'antd';
import ThemeContext from '../../context/ThemeContext'
import {useContext} from "react";

const SystemPage = () => {

    const { theme, setTheme } = useContext(ThemeContext);

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

    return (
        <div style={{textAlign: 'left', padding: '15px', }}>
            <h3 style={{ fontWeight: 'normal'}}>Themes</h3>
            <Divider />
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
                            maxWidth: '70%'
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
        </div>
    );

}

export default SystemPage;