import express from 'express';
import { User } from '../db/models/user.mjs';
import bcrypt from 'bcrypt';
import session from 'express-session';
import apiRouter from './api/api.mjs';
import Entrypoint from './helpers/Entrypoint.mjs';
import './helpers/globals.mjs';
import filesRouter from './api/files.mjs';
import vhost from 'vhost';
import AppRouter from './api/app.mjs';

log("Initializing rhost");
const app = express();

/**
 * Subdomain routing
 */

app.use(vhost('docker.localhost', AppRouter));

app.use(session({
    secret : Entrypoint.secrets.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 60 * 60 * 1000 }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', Entrypoint.showIndex);

app.use("/api", apiRouter);
app.use('/files', filesRouter);

app.get('/register', async (req, res) =>{
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

app.use(express.static(Entrypoint.indexPath));
app.use(express.static(Entrypoint.userAppsPath));



app.listen(Entrypoint.port,()=>{
    log('Server running at http://localhost:' + Entrypoint.port);
})