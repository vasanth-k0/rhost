import {head, login, dash, headr, base} from "./component"

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
        toolmenu: {},
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
        }
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
            width: '75%' 
        },
        login: login,
        dash: dash,
        task: { 
            position: 'absolute',
            bottom: 0,
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
        toolmenu: {
            width: '100%',
            height: '2.9rem',
            fontSize: '12px',
          },
        appflex : {
            ...appflex,
            padding: 15,
            gap: 21,
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
            background: '#ffffffa0',
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
        }
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
        toolmenu: {},
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
            fontSize: '17px',
            filter: 'brightness(0.7)'
        }
    }
}

const css = {
    dashboard: dashboardcss(),
    desktop: desktopcss(),
    hybrid: hybridcss()
}

export default css;