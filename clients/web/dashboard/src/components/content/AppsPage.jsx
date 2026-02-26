import { useEffect, useState } from "react";
import * as AntIcons from '@ant-design/icons';
import { Flex } from "antd";
import AppBrick from "../sub_components/AppBrick";

const AppsPage = ({colorPalette}) => {

    const [Apps, setApps] = useState([]);

    useEffect(()=>{
        (async()=>{
            let appList = await fetch("/apps/list");
            appList = await appList.json();
            setApps(appList);
        })();
    },[]);

    return (<div style={{width: '100%', height: '100%', padding: '8px'}}>
        <Flex align="start" style={{padding: 15, gap: 15, flexWrap: 'wrap'}}>
            {Object.keys(Apps).map((app) => {
                let Icon = AntIcons[Apps[app].icon];
                return <AppBrick colorPalette={colorPalette} Icon={Icon} app={app} appName={Apps[app].name} />
            })}
        </Flex>
    </div>)
}

export default AppsPage;