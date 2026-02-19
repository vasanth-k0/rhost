import {Router} from 'express';

const filesRouter = Router();

filesRouter.route('/').get((req, res)=>{
    res.json({
        'response': 'Root file system'
    });
})

export default filesRouter;