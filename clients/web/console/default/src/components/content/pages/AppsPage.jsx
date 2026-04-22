import * as AntIcons from '@ant-design/icons';
import { Flex } from "antd";

const AppsPage = ({colorPalette}) => {

    const {login} = useContext(UserContext)
    const {Apps} = useContext(AppContext)
    const {settings} = useContext(SystemContext);

    const style = css[settings.ui];

    return (<div style={app}>
        <Flex align="start" style={style.appflex}>
            {Object.keys(Apps).filter( app => login || Apps[app].published ).map((app) => {
                let Icon = AntIcons[Apps[app].icon];
                return <AppBrick colorPalette={colorPalette} Icon={Icon} app={app} appName={Apps[app].name} />
            })}
        </Flex>
    </div>)
}

export default AppsPage;