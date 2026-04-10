import express from 'express';
import Entrypoint from '../helpers/Entrypoint.mjs';
import path from 'path';
import fs from 'fs';
import pm2 from 'pm2';

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
        res.sendStatus(200);
    });

appRouter.route('/config')
    .get((req, res)=>{
        let relativePath = `${path.join("app/apps/", req.params.endpoint)}`;
        let serviceFile = `${process.cwd()}/${relativePath}/service.json`;
        res.sendFile(serviceFile)
    });

appRouter.route('/about')
    .get((req, res)=>{
        let relativePath = `${path.join("app/apps/", req.params.endpoint)}`;
        let aboutFile = `${process.cwd()}/${relativePath}/about.html`;
        res.sendFile(aboutFile)
    });

appRouter.route('/{:action}')
    .all(async (req, res) => {
        let appName = req.params.endpoint;
        if (appName in Entrypoint.apps) {
                    const appTitle = appName.charAt(0).toUpperCase() + appName.slice(1);
                    let relativePath = `${path.join("app/apps/", req.params.endpoint)}`;
                    const serviceFile = `${process.cwd()}/${relativePath}/service.json`;
                    const service = JSON.parse(fs.readFileSync(serviceFile, 'utf-8'));
                    if (service.type == 'daemon') {
                        /**
                         * TODO
                         * move to Tty.mjs and make it generic for any tty based service
                         */
                        pm2.connect(function(err) {
                            if (err) {
                                console.error(err);
                                res.send('Error connecting to process manager');
                                return;
                        }
                        console.log('Connected to process manager');
                            pm2.describe(appTitle, (err, app)=>{
                                if(err){
                                    console.error(err);
                                    res.send('Service not running');
                                } else {
                                    const ttyIframe = `
                                                    <!DOCTYPE html>
                                                    <html lang="en">
                                                        <iframe 
                                                            src="http://localhost:${service.ports.tty}" 
                                                            style="
                                                                width:100%; 
                                                                height:96vh; 
                                                                border:none; 
                                                                border-radius: 5px; 
                                                                overflow: hidden;
                                                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
                                                        </iframe>
                                                    </html>
                                                `;
                                    if (app.length == 0 || app[0].pm2_env.status != 'online') {

                                        const customTheme = [
                                                                                '-t', 'fontFamily=DejaVu Sans Mono, monospace', 
                                                                                '-t', 'fontSize=14', 
                                                                                '-t', 'scrollback=3000',
                                                                                '-t', 'theme={"background": "#193535", "foreground": "#ffffff", "cursor": "#ffffff"}'
                                                                            ]
                                        const terminalArgs = (appName=='shell')
                                                                                ? ['-p', service.ports.tty, ...customTheme, 'bash'] 
                                                                                : ['-p', service.ports.tty, ...customTheme, 'docker', 'exec', '-it', appName, 'bash']
                                        pm2.start({
                                                    name: appTitle,
                                                    script: 'ttyd',
                                                    args: terminalArgs,
                                                    exec_mode: 'fork',
                                                }, function(err, apps) {
                                                if (err) {
                                                    console.error(err);
                                                    res.send(`${appTitle} service is not running. Unable to connect`);
                                                    return pm2.disconnect();
                                                }

                                                pm2.disconnect();
                                                res.send(ttyIframe);
                                            });
                                    } else {
                                        res.send(ttyIframe);
                                    }
                                }
                            });
                        });
                        
                    } else {

                                if (req.params.action) {
                                    let AppExecutorPath = `${process.cwd()}/${relativePath}/controller/exe.mjs`;
                                    if (fs.existsSync(AppExecutorPath)) {
                                        let AppExecutorModule = await import(AppExecutorPath);
                                        let param = JSON.stringify({ ...req.query, ...req.body});
                                        let appExecutor = new AppExecutorModule.default(req.params, param)
                                        let outp = await appExecutor.exe();
                                        res.send(outp)
                                    } else {
                                        res.send("App executor is not present")
                                    }
                                } else {
                                    let appFolder = `${process.cwd()}/app/apps/${appName}/view`;
                                    res.sendFile(`${appFolder}/index.html`);
                                }
                    
                    }
                    } else {
                            Entrypoint.showIndex(req, res)
                    }
    })

export default appRouter;