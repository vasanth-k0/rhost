import { Router } from 'express';
import Authorizer from './auth.mjs';
const apiRouter = Router();

apiRouter.route('/login').get( async (req, res) => {
    if (await Authorizer.validateSession(req) === true) {
        res.json({ userDetails: req.session, login: true });
    } else {
        res.json({ login: devMode });
    }
});

apiRouter.route('/logout').get((req, res) => {
    req.session.destroy();
    res.json({ userDetails: req.session, logout: true });
})

export default apiRouter;