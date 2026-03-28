import { useContext } from "react";
import * as AntIcons from '@ant-design/icons';
import { Flex } from "antd";
import AppBrick from "../../sub_components/AppBrick";
import UserContext from '../../context/UserContext'
import AppContext from "../../context/AppContext";

const AppsPage = ({colorPalette}) => {

    const {login} = useContext(UserContext)
    const {Apps} = useContext(AppContext)

    return (<div style={{width: '100%', height: '100%', padding: '8px'}}>
        <Flex align="start" style={{padding: 15, gap: 15, flexWrap: 'wrap',flexDirection: 'column',
  alignContent: 'flex-start' }}>
            {Object.keys(Apps).filter( app => login || Apps[app].published ).map((app) => {
                let Icon = AntIcons[Apps[app].icon];
                return <AppBrick colorPalette={colorPalette} Icon={Icon} app={app} appName={Apps[app].name} />
            })}
        </Flex>
    </div>)
}

export default AppsPage;