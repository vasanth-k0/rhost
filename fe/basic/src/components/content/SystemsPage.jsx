import { Flex, Radio } from 'antd';
import {useTheme} from '../context/Theme'
import { useEffect } from 'react';

const SystemsPage = () => {

    const { theme, setTheme } = useTheme();

    const onChange = e => {
        setTheme({...theme, active: e.target.value});
    };

    const colorThemesList = ['Blue', 'Brown', 'Black', 'Teal']

    return (
        <div style={{textAlign: 'left'}}>
            <h3>Themes</h3>
            <hr/>
            <h5>Color</h5>
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
    );

}

export default SystemsPage;