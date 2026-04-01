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
                                    && new_release > this_release ) 
                            {
                                exec("git stash && git restore . && git fetch --tags --force",(err, stdout, stderr)=>{
                                    if (err) {
                                        res.status(500).json({ message: 'Unable to pull updates', error: stderr });
                                        return;
                                    }
                                    exec(`git tag -l | grep ${new_release} | wc -l`, (err1, stdout1, stderr1)=>{
                                        if (err1) {
                                            res.status(500).json({ message: 'New release not available locally', error: stderr1 });
                                            return;
                                        }
                                        if (parseInt(stdout1.trim())==1) {
                                            console.log("New release available locally");
                                            exec(`npm install --prefix ../ && git checkout ${new_release} && sudo pm2 restart rhost`, (err3, stdout3, stderr3) => {
                                                if (err3) {
                                                    res.status(500).json({ message: 'Unable to switch to new version', error: stderr3 });
                                                    return;
                                                }
                                                Entrypoint.settings.rhost.release = new_release.toString();
                                                fs.writeFileSync('app/console/settings.json', JSON.stringify(Entrypoint.settings, null, 4), 'utf-8');
                                                res.status(200).json({ message: 'Update successful' });
                                                return;
                                            });
                                        } else {
                                            res.status(500).json({ message: 'New release not available locally' });
                                            return;
                                        }
                                    });
                                });   
                            } else {
                                res.status(200).json({ message: 'Already running on latest version' });
                                return;
                            }
                        } else {
                            res.status(500).json({ message: 'Failed to get latest version details' });
                            return;
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