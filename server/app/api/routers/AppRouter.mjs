import express from 'express';
import Entrypoint from '../../helpers/Entrypoint.mjs';
import fs from 'fs';
import {spawn} from 'child_process'
import path from 'path';

const appRouter = express.Router({ mergeParams: true });

appRouter.route('/list').get((req, res) => {
    let appsList = structuredClone(Entrypoint.apps);
    Object.keys(appsList).forEach((app)=>{
        delete appsList[app].router;
        delete appsList[app].users
    })
    res.json(appsList);
});

appRouter.route('/{:action}').get((req, res) => {
     let appName = req.params.endpoint;
     let file = Entrypoint.apps
    if (appName in file) {
        if (req.params.action) {
            let service = fs.readFileSync(`app/apps/${req.params.endpoint}/service.json`);
            service = JSON.parse(service);
            // let exe = spawn(service.executor, [ path.join(service.dir, service.actions[req.params.action]) ] );
            let exe = spawn ('docker',[
                'run', '--rm', '-v',
                `${process.cwd()}/${path.join(service.dir, service.actions[req.params.action])}:/app.py`,
                'python:3.12-slim',
                'python3',
                '/app.py'
            ]);

            exe.stdout.on('data', (data) => {
                res.send(`Output: ${data}`);
            });

            exe.stderr.on('data', (data) => {
                res.send(`Error: ${data}`);
            });

        } else {
            res.sendFile(file[appName].router.web, { root: Entrypoint.__dirname });
        }
    } else {
        Entrypoint.showIndex(req, res)
    }
})

export default appRouter;