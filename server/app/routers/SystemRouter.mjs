import { Router } from 'express';
import Authorizer from '../helpers/Authorizer.mjs';
import Entrypoint from '../helpers/Entrypoint.mjs';
import fs from 'node:fs';
import { User } from '../db/models/user.mjs';
import bcrypt from 'bcrypt';
import { exec } from 'child_process';
import axios from 'axios';

const SystemRouter = Router();

/**
 * @swagger
 * /system/login:
 *   get:
 *     summary: Check if user is logged in
 */
SystemRouter.route('/login').get( async (req, res) => {
    if (await Authorizer.validateSession(req) === true) {
        res.json({ userDetails: req.session, login: true });
    } else {
        res.json({ login: devMode });
    }
});

/**
 * @swagger
 * /system/logout:
 *  get:   
 *    summary: Logout the user and destroy the session
 */
SystemRouter.route('/logout').get((req, res) => {
    req.session.destroy();
    res.json({ userDetails: req.session, logout: true });
})

/**
 * @swagger
 * /system/theme:
 *  get:
 *      summary: Get the current active theme
 *      responses:
 *          200:
 *              description: Successfully retrieved the active theme
 *  post:
 *      summary: Set the active theme
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              active:
 *                                  type: string
 *                                  description: The name of the theme to set as active
 *                      examples:
 *                          default: 
 *                              value: |-
 *                                  {
 *                                      "active": "dark"
 *                                  }   
 *         
 *      responses:
 *          200:
 *              description: Successfully set the active theme
 */
SystemRouter.route('/theme')
    .get((req, res)=>{
        res.json(Entrypoint.settings.theme);
    })
    .post((req, res)=>{    
       const activeTheme = req.body.active;
        const availableThemes = Object.keys(Entrypoint.settings.theme.available)
        if (availableThemes.includes(activeTheme)) {
            Entrypoint.settings.theme.active = activeTheme;
            fs.writeFileSync('app/console/settings.json', JSON.stringify(Entrypoint.settings, null, 4), 'utf-8');
            res.sendStatus(200);
        }
    });

    SystemRouter.route('/settings')
        .get((req, res)=>{
            let result = { ...Entrypoint.settings };
            delete result.theme;
            res.json(result);
        });

    SystemRouter.route('/update')
        .get(( req, res )=>{
            axios.get(`https://api.github.com/repos/${Entrypoint.settings.rhost.github_repo}/releases/latest`)
                    .then((outp) => {
                        if (outp.status == 200) {
                            let release = outp.data;
                            let new_release = parseFloat(release.tag_name);
                            let this_release = parseFloat(Entrypoint.settings.rhost.release);
                            if (new Date(release.published_at) > new Date(Entrypoint.settings.rhost.last_update)
                                    && new_release > this_release ) {
                                res.sendStatus(200);
                                exec("git restore . && git pull",(err, stdout)=>{
                                    if (err) {
                                        res.sendStatus(400);
                                    }
                                    exec(`git tag -l | grep ${new_release} | wc -l`, (err, stdout)=>{
                                        console.log(stdout);
                                        if (stdout=='1') {
                                            res.sendStatus(200);
                                            exec('nohup bash -c "npm install --prefix ./server/ && sudo pm2 restart rhost" > /dev/null 2>&1 &', (error, stdout, stderr) => {
                                                if (error) {
                                                    res.sendStatus(400);
                                                }
                                                res.sendStatus(200);
                                            });
                                        }
                                    });
                                });

                                 exec('git tag -l | grep 1.1 | wc -l', (err, stdout)=>{console.log(stdout)});
   

                            }
                        }
                        
                    });
        });

    /**
     * @swagger
     * /system/register:
     *  get:
     *   summary: Register a new user with username, email and password as query parameters
     */
SystemRouter.get('/register', async (req, res) =>{
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

export default SystemRouter;