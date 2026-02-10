import express from 'express';
import { User } from '../db/models/user.mjs';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from 'fs';

const app = express();

var settings = JSON.parse(fs.readFileSync(path.join(__dirname, 'system/settings.json')));
let userAppsPath = path.join(__dirname, 'system/apps/');
let systemAppsPath = path.join(__dirname, 'system/apps/');
let consolePath = path.join(systemAppsPath, 'console/' + settings.ui);
let sitePath = path.join(systemAppsPath, 'site/' + settings.site);

app.get('/', (req, res)=>{
    if (settings.startup === 'site') {
            res.sendFile(path.join(sitePath, 'index.html'));
    } else {
            res.sendFile(path.join(appsPath, settings.startup + '/index.html'));
    }
});

app.get('/console', (req, res) => {
    console.log(consolePath);
    res.sendFile(path.join(consolePath, 'index.html'));
});

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

app.use(express.static(consolePath));
app.use(express.static(userAppsPath));

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})