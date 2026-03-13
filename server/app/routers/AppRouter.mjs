import express from 'express';
import Entrypoint from '../helpers/Entrypoint.mjs';
import AppRunner from '../helpers/AppRunner.mjs';

const appRouter = express.Router({ mergeParams: true });

appRouter.route('/list').get((req, res) => {
    let appsList = structuredClone(Entrypoint.apps);
    Object.keys(appsList).forEach((app)=>{
        delete appsList[app].router;
        delete appsList[app].users
    })
    res.json(appsList);
});

appRouter.route('/{:action}').get(async (req, res) => {
     let appName = req.params.endpoint;
     let file = Entrypoint.apps
    if (appName in file) {
        if (req.params.action) {
            let serviceFile = `app/apps/${req.params.endpoint}/service.json`
            let appExecutor = new AppRunner(serviceFile, req.params.action)
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