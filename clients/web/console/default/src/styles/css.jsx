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
            backgroundColor: "white"
        },
        body: {
            width: '100%',
            height: 'calc(100vh - 9.3vh)',
        },
        base : base,
        iframe: iframe,
        toolmenu: {}
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
        toolmenu: {}
    }
}

const css = {
    dashboard: dashboardcss(),
    desktop: desktopcss(),
    hybrid: hybridcss()
}

export default css;