import { Flex, Radio, Divider } from 'antd';
import {useTheme} from '../context/Theme'

const SystemsPage = () => {

    const { theme, setTheme } = useTheme();

    const onChange = e => {
        setTheme({...theme, active: e.target.value});
    };

    const colorThemesList = Object.keys(theme.available)

    return (
        <div style={{textAlign: 'left', padding: '15px'}}>
            <h3 style={{ fontWeight: 'normal'}}>Themes</h3>
            <Divider />
            <div style={{ marginLeft: 10}}>
                <div style={{ fontSize: 13, marginBottom: 10, marginTop: 15 }}>
                    <span style={{ color: theme.available[theme.active][0]}}>◈</span>  Color
                </div>
                <div>
                    <Flex vertical gap="middle">
                        <Radio.Group onChange={onChange} defaultValue={theme.active}>
                        {
                            colorThemesList.map((colour, index)=>{
                                return <Radio.Button value={colour}>{colour}</Radio.Button>
                            })
                        }
                        </Radio.Group>
                    </Flex>
                </div>
            </div>
        </div>
    );

}

export default SystemsPage;