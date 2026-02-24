import Entrypoint from "./Entrypoint.mjs";

global.devMode = Entrypoint.settings.env.type === 'dev' ? true : false;

global.log = (msg) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} @ ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    console.log(">>> [rhost]-[" + formatted + "] " + msg);
}

