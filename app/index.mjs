import express from 'express';
import { User } from '../db/models/user.mjs';
import bcrypt from 'bcrypt';
import session from 'express-session';
import apiRouter from './api/api.mjs';
import Entrypoint from './helpers/Entrypoint.mjs';
import './helpers/globals.mjs';

log("Initializing rhost");
const app = express();

app.use(session({
    secret : Entrypoint.secrets.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 60 * 60 * 1000 }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', Entrypoint.showStartupApp);

app.get('/console', Entrypoint.showConsole);

app.use("/api", apiRouter);

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

app.use(express.static(Entrypoint.consolePath));
app.use(express.static(Entrypoint.userAppsPath));

app.listen(Entrypoint.port,()=>{
    log('Server running at http://localhost:' + Entrypoint.port);
})