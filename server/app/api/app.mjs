import express from 'express';

const AppRouter = express.Router();

AppRouter.route('/').get((req, res) => {
    res.send(req.vhost[0] + " App page");
})

export default AppRouter;