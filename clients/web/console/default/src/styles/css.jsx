import {
    head, login, dash, 
    headr, base, controls, 
    appbrick, tools, controlbtn} from "./component"

const dashboardcss = () => {
    return {
        header: {
            ...head,
            zIndex: 1000,
            },
        headr: {
            ...headr,
            padding: '5px',
            height: '6.6%'
        },
        login: login,
        dash: {
            ...dash,
            borderRadius: '7px',
            background: 'white'
        },
        body: {
            width: '100%',
            height: 'calc(100vh - 9.3vh)',
        },
        base : {
            ...base,
            borderRadius: '8px'
        },
        iframe: iframe,
        taskmenu: {},
        appflex : appflex,
        appbrick : {
            ...appbrick,
            gap: '8px',
            margin: '7px', 
            border: 'solid 1px transparent',
            borderRadius: 5,
            padding: '10px 7px',
            fontSize: '12px',
            textAlign: 'center',
        },
        appname : {
            ...appname,
            color: 'rgb(50, 50, 50)', 
            maxWidth: '4.5rem',
            minWidth: '3.5rem',
            whiteSpace: 'pre-wrap' 
        },
        icon  : {
            fontSize: '17px', filter: 'brightness(0.7)'
        },
        contents: fill,
        controls: controls,
        tools: tools,
        controlbtn: controlbtn
    }
}

const desktopcss = () => {
    return {
        header: {
            ...head,
            height: '100%'
            },
        headr: {
            zIndex: 30, 
            position: 'absolute', 
            transform: 'translateX(-50%)',
            left: '50%',
            padding: 0, 
            background: '#ffffffa2', 
            height: '2.7rem', 
            overflow: 'hidden',
            backdropFilter: 'blur(7px)',
            transition: 'all 0.5s ease',
            top: '5px',
            borderRadius: '0 0 5px 5px',
            boxShadow: '1px 1px 15px 1px #00000033',
            width: '65%' 
        },
        login: login,
        dash: {
            ... dash,
            padding: '3rem 5rem 7rem'
        },
        task: { 
            position: 'absolute',
            bottom: '2.5rem',
            left: '5rem',
            right: '5rem',
            height: '60px',
            width: '100% !important',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            transition: 'all 0.5s ease',
        },
        body: {
            width: '100%',
            height: '100%',
        },
        base : {
            ...base,
            boxShadow: '0 5px 10px rgba(0, 0, 0, 0.3)', 
            backgroundSize: 'cover',
        },
        iframe: iframe,
        taskmenu: {
            width: '100%',
            height: '2.9rem',
            fontSize: '12px',
          },
        appflex : {
            ...appflex,
            padding: 0,
            gap: 30,
            flexDirection: 'column',
            alignContent: 'flex-start',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            width: 'fit-content'
        },
        appbrick : {
            ...appbrick,
            border: 'solid 1px white',
            fontSize: '10px',
            textAlign: 'center',
            backdropFilter: 'blur(5px)',
            width: '3.8rem',
            height: '4.3rem',
            background: '#ffffff30',
        },
        appname : {
            ...appname,
            color: 'rgb(50, 50, 50)', 
            background: '#ffffff9f',
            width: '100%',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            padding: '3px',
            minHeight: '25px'
        },
        icon : {
            fontSize: '21px',
            filter: 'brightness(0.7)',
            margin: '11px'
        },
        contents: {
            ...fill,
            background: "#ffffffca",
            backdropFilter: 'blur(7px)',
        },
        controls: {
            ...controls,
            padding: 0,
        },
        tools: {
            ...tools,
            top: 0,
            right: '2.3rem',
            position: 'absolute',
            zIndex: '10',
            fontSize: '16px',
            flexFlow: 'row-reverse',
            padding: '5px 8px',

        },
        controlbtn: {
            ...controlbtn,
            fontSize: '16px',
            width: 33,
            height: 33,
            margin: '-6px -3px 0 auto',
            float: 'right',
            padding: '5px',
        }
    }
}

const solidcss = ()=>{
    return {
        ...desktopcss(),
        dash: {
            ...desktopcss().dash,
            background: 'transparent',
            gap: 7
        },
        task: {
            ...desktopcss().task,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '5px',
            height: '41px',
            left: '15rem',
            right: '15rem'
        },
        contents: {
            ...fill,
            borderRadius: '5px',
            overflow: 'hidden',
            background: 'white',
        },
        controls: {
            ...controls,
            borderRadius: '5px',
        },
        appflex : {
            ...desktopcss().appflex,
            padding: '15px',
        },
        tools : {
            ...desktopcss().tools,
            right: '0.3rem',
        },
        
    } 
}

const hybridcss = () => {
    return {
        header: {
            ...head,
            zIndex: 1000,
            height: '3.5rem'
            },
        headr: {
            ...headr,
            position: 'absolute', 
            width: '100%', 
            bottom: 6 
        },
        login: login,
        dash: dash,
        body: {
            width: '100%',
            height: 'calc(100% - 40px)',
            padding: '10px',
        },
        base : {
            ...base,
            boxShadow: '0 5px 10px rgba(0, 0, 0, 0.3)', 
            backgroundSize: 'cover',
        },
        iframe: iframe,
        taskmenu: {},
        appflex : {
            ...appflex,
            padding: 15,
            gap: 15,
            flexDirection: 'column',
            alignContent: 'flex-start'
        },
        appbrick : {
            ...appbrick,
            gap: '5px',
            border: 'solid 1px white',
            borderRadius: 5,
            padding: '14px 3px',
            fontSize: '10px',
            textAlign: 'center',
            background: '#ffffffca',
            backdropFilter: 'blur(7px)',
            width: '3.8rem',
            height: '4.1rem',
        },
        appname : {
            ...appname,
            color: 'rgb(50, 50, 50)', 
            height: '1rem', 
            width: '3rem',
            whiteSpace: 'nowrap' 
        },
        icon : {
            fontSize: '16px',
            filter: 'brightness(0.7)'
        },
        contents: fill,
        controls: controls,
        tools: {
            ...tools,
            right: '-1px',
            fontSize: '17px',
            padding: 5,
            border: 'solid 1px lightgray'
        },
        controlbtn: controlbtn
    }
}

const css = {
    dashboard: dashboardcss(),
    desktop: desktopcss(),
    'hybrid-console': hybridcss(),
    solid: solidcss()
}

export default css;