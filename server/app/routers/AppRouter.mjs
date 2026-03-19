import express from 'express';
import Entrypoint from '../helpers/Entrypoint.mjs';
import AppRunner from '../helpers/AppRunner.mjs';
import path from 'path';

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
    .get(async (req, res) => {
        let appName = req.params.endpoint;
        let file = Entrypoint.apps
        if (appName in file) {
            if (req.params.action) {
                let appExecutor = new AppRunner(req.params.endpoint, req.params.action)
                let outp = await appExecutor.exe();
                res.send(outp)
            } else {
                res.sendFile(file[appName].router.web, { root: Entrypoint.__dirname });
            }
        } else {
            Entrypoint.showIndex(req, res)
        }
    })

export default appRouter;