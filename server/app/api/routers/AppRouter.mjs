import express from 'express';
import Entrypoint from '../../helpers/Entrypoint.mjs';

const appRouter = express.Router();

appRouter.route('/').get((req, res) => {
     let appName = req.baseUrl.split('/')[1];
     let file = Entrypoint.apps
    if (appName in file) {
        res.sendFile(file[appName].router.web, { root: Entrypoint.__dirname });
    } else {
        Entrypoint.showIndex(req, res)
    }
})

appRouter.route('/list').get((req, res) => {
    let appsList = structuredClone(Entrypoint.apps);
    Object.keys(appsList).forEach((app)=>{
        delete appsList[app].router;
        delete appsList[app].users
    })
    res.json(appsList);
});

export default appRouter;