import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

class Entrypoint{

    static __filename = fileURLToPath(import.meta.url);
    static __dirname = path.dirname(path.dirname(Entrypoint.__filename));
    
    static appsPath = path.join(Entrypoint.__dirname, 'apps/');
    static consolePath = path.join(Entrypoint.appsPath, 'console/');

    static settings = JSON.parse(fs.readFileSync(path.join(Entrypoint.consolePath, 'settings.json')));
    static secrets = JSON.parse(fs.readFileSync(path.join(Entrypoint.consolePath, 'secrets.json')));
    static apps = JSON.parse(fs.readFileSync(path.join(Entrypoint.appsPath, 'apps.json'), 'utf-8'));

    static uiPath = path.join(Entrypoint.consolePath, 'ui/' + Entrypoint.settings.ui);
    static port = Entrypoint.settings.port;

    static showIndex(req, res) {
        res.sendFile(path.join(Entrypoint.uiPath, 'index.html'));
    }
}

export default Entrypoint;