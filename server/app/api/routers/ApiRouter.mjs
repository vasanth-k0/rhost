import { Router } from 'express';
import Authorizer from '../auth.mjs';
import Entrypoint from '../../helpers/Entrypoint.mjs';
import fs from 'node:fs';
import { User } from '../../../db/models/user.mjs';
import bcrypt from 'bcrypt';

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

apiRouter.route('/theme')
    .get((req, res)=>{
        res.json(Entrypoint.settings.theme);
    })
    .post((req, res)=>{    
       const activeTheme = req.body.active;
        const availableThemes = Object.keys(Entrypoint.settings.theme.available)
        if (availableThemes.includes(activeTheme)) {
            Entrypoint.settings.theme.active = activeTheme;
            fs.writeFileSync('app/apps/console/settings.json', JSON.stringify(Entrypoint.settings, null, 4), 'utf-8');
            res.sendStatus(200);
        }
    });

apiRouter.get('/register', async (req, res) =>{
    const newUser = User.build({
        username: req.query.username,
        email: req.query.email,
        password: bcrypt.hashSync(req.query.password, 10)
    });
    try {
        await newUser.save();
    } catch (error) {
       console.error("Error: " + error.message);
    }
    res.json({
        'message': 'Registration successful',
        'user': newUser
    });
});

export default apiRouter;