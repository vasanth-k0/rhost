import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

class Entrypoint{

    static __filename = fileURLToPath(import.meta.url);
    static __dirname = path.dirname(path.dirname(Entrypoint.__filename));
    
    static appsPath = path.join(Entrypoint.__dirname, 'apps/');
    static consolePath = path.join(Entrypoint.__dirname, 'console/');

    static settings = JSON.parse(fs.readFileSync(path.join(Entrypoint.consolePath, 'settings.json')));
    static secrets = JSON.parse(fs.readFileSync(path.join(Entrypoint.consolePath, 'secrets.json')));
    static apps = JSON.parse(fs.readFileSync(path.join(Entrypoint.appsPath, 'apps.json'), 'utf-8'));

    static fePath = path.join(Entrypoint.consolePath, 'ui/' + Entrypoint.settings.fe);
    static port = Entrypoint.settings.port;

    static showIndex(req, res) {
        res.sendFile(path.join(Entrypoint.fePath, 'index.html'));
    }
}

export default Entrypoint;