import express from 'express';
import Entrypoint from '../helpers/Entrypoint.mjs';
import path from 'path';
import fs from 'fs';

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

appRouter.route('/config')
    .get((req, res)=>{
        res.json(new AppRunner(req.params.endpoint).getConfig());
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
        let file = Entrypoint.apps
        if (appName in file) {
            if (req.params.action) {
                let relativePath = `${path.join("app/apps/", req.params.endpoint)}`;
                let AppExecutorPath = `${process.cwd()}/${relativePath}/controller/exe.mjs`;
                if (fs.existsSync(AppExecutorPath)) {
                    let AppExecutorModule = await import(AppExecutorPath);
                    let appExecutor = new AppExecutorModule.default(req.params, JSON.stringify({ ...req.query, ...req.body}))
                    let outp = await appExecutor.exe();
                    res.send(outp)
                } else {
                    res.send("App executor is not present")
                }
            } else {
                let appFolder = `${process.cwd()}/app/apps/${appName}/view`;
                res.sendFile(`${appFolder}/index.html`);
            }
        } else {
            Entrypoint.showIndex(req, res)
        }
    })

export default appRouter;