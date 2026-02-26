import express from 'express';
import session from 'express-session';
import Entrypoint from './helpers/Entrypoint.mjs';
import './helpers/globals.mjs';

import ApiRouter from './api/routers/ApiRouter.mjs';
import FilesRouter from './api/routers/FilesRouter.mjs';
import AppRouter from './api/routers/AppRouter.mjs';


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
app.use(express.static(Entrypoint.uiPath));

let knownRoutes = {
    "/api": ApiRouter,
    "/files": FilesRouter,
    '{/:endpoint}': AppRouter
}

Object.entries(knownRoutes).forEach(([route, router]) => {
    app.use(route, router);
});

app.listen(Entrypoint.port,()=>{
    log('Server running at http://localhost:' + Entrypoint.port);
})