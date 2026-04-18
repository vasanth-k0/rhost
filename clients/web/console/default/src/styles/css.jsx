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
        iframe: iframe
    }
}

const desktopcss = () => {
    return {
        header: {
            ...head,
            height: '100%'
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
        iframe: iframe
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
        iframe: iframe
    }
}

const css = {
    dashboard: dashboardcss(),
    desktop: desktopcss(),
    hybrid: hybridcss()
}

export default css;