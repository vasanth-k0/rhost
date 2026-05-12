import express from 'express';
import Entrypoint from '../helpers/Entrypoint.mjs';
import path from 'path';
import fs from 'fs';
import pm2 from 'pm2';
import Authorizer from '../helpers/Authorizer.mjs';

const appRouter = express.Router({ mergeParams: true });

appRouter.route('/list')
    .get((req, res) => {
        let appsList = structuredClone(Entrypoint.apps);
        Object.keys(appsList).forEach((app)=>{
            delete appsList[app].router;
            delete appsList[app].users
        })
        res.json(appsList);
    });

appRouter.route('/publish')
    .get((req, res)=>{
        const app = req.params.endpoint;
        Entrypoint.apps[app].published = Boolean(Number(req.query.set));
        fs.writeFileSync(path.join(Entrypoint.appsPath, 'apps.json'), JSON.stringify(Entrypoint.apps, null, 4), 'utf-8')
        return res.sendStatus(200);
    });

appRouter.route('/config')
    .get((req, res)=>{
        let relativePath = `${path.join("app/apps/", req.params.endpoint)}`;
        let serviceFile = `${process.cwd()}/${relativePath}/service.json`;
        return res.sendFile(serviceFile)
    });

appRouter.route('/about')
    .get((req, res)=>{
        let relativePath = `${path.join("app/apps/", req.params.endpoint)}`;
        let aboutFile = `${process.cwd()}/${relativePath}/about.html`;
        return res.sendFile(aboutFile)
    });

appRouter.route('/{:action}')
    .all(Authorizer.authRoute, async (req, res) => {
        let appName = req.params.endpoint;
        
            const appTitle = appName.charAt(0).toUpperCase() + appName.slice(1);
            let relativePath = `${path.join("app/apps/", req.params.endpoint)}`;
            const serviceFile = `${process.cwd()}/${relativePath}/service.json`;
            const service = JSON.parse(fs.readFileSync(serviceFile, 'utf-8'));
            if (service.type == 'daemon'
                && (Entrypoint.apps[appName].users.length==0 
                    || Entrypoint.apps[appName].users.includes(req.session.user.username))
            ) {
                
                if (req.params.action == 'pvt') {
                    /**
                     * TODO
                     * move to Tty.mjs and make it generic for any tty based service
                     */
                    pm2.connect(function(err) {
                        if (err) {
                            console.error(err);
                            return res.send('Error connecting to process manager');
                        }
                    console.log('Connected to process manager');
                        pm2.describe(appTitle, (err, app)=>{
                            if(err){
                                console.error(err);
                                return res.send('Service not running');
                            } else {
                                const ttyIframe = `
                                        <!DOCTYPE html>
                                        <html style="height:100%;" lang="en">
                                        <body style="height: 100%; margin:0; padding:0; overflow:hidden;">
                                            <iframe
                                                id="${appTitle}-tty"
                                                src="http://localhost:${service.ports.tty}" 
                                                style="
                                                    width:100%; 
                                                    height:100%; 
                                                    border:none; 
                                                    overflow: hidden;
                                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
                                            </iframe>
                                        </body>
                                        </html>
                                    `;
                                if (app.length == 0 || app[0].pm2_env.status != 'online') {

                                    const customTheme = [
                                        '-t', 'fontFamily=DejaVu Sans Mono, monospace', 
                                        '-t', 'fontSize=14', 
                                        '-t', 'scrollback=3000',
                                        '-t', 'cursorBlink=true',
                                        '-t', 'padding=10px',
                                        '-t', 'theme={"background": "black", "foreground": "#ffffff", "cursor": "#ffffff"}'
                                    ]
                                    const ttydArgs = [
                                        '-W', 
                                        '-p', service.ports.tty,
                                        ...customTheme
                                    ]
                                    const terminalArgs = (appName=='terminal')
                                                            ? [...ttydArgs, 'bash'] 
                                                            : [...ttydArgs, 'docker', 'exec', '-it', appName, 'bash']
                                    pm2.start({
                                        name: appTitle,
                                        script: 'ttyd',
                                        args: terminalArgs,
                                        exec_mode: 'fork',
                                    }, function(err, apps) {
                                        if (err) {
                                            console.error(err);
                                            pm2.disconnect();
                                            return res.send(`${appTitle} service is not running. Unable to connect`);
                                        }
                                        pm2.disconnect();
                                        return res.send(ttyIframe);
                                    });
                                } else {
                                    return res.send(ttyIframe);
                                }
                            }
                        });
                    });
                    return;
                }
            } else {
                if (req.params.action) {
                    if (req.params.action != 'pvt') {
                        let AppExecutorPath = `${process.cwd()}/app/helpers/Exe.mjs`;
                        if (fs.existsSync(AppExecutorPath)) {
                            let AppExecutorModule = await import(AppExecutorPath);
                            let param = JSON.stringify({ ...req.query, ...req.body});
                            let appExecutor = new AppExecutorModule.default(req.params, param)
                            let outp = await appExecutor.exe();
                            return res.send(outp)
                        } else {
                            return res.send("App executor is not present")
                        }
                    } // else fall to view/index.html
                }
            }
            // Default public view for published apps
            let appFolder = `${process.cwd()}/app/apps/${appName}/view`;
            return res.sendFile(`${appFolder}/index.html`);
        
    })

export default appRouter;