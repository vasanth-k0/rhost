import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

class Entrypoint{

    static __filename = fileURLToPath(import.meta.url);
    static __dirname = path.dirname(path.dirname(Entrypoint.__filename));
    
    static settings = JSON.parse(fs.readFileSync(path.join(Entrypoint.__dirname, 'system/settings.json')));
    static secrets = JSON.parse(fs.readFileSync(path.join(Entrypoint.__dirname, 'system/secrets.json')));

    static port = Entrypoint.settings.port;

    static userAppsPath = path.join(Entrypoint.__dirname, 'user/apps/');
    static systemAppsPath = path.join(Entrypoint.__dirname, 'system/apps/');
    static indexPath = path.join(Entrypoint.systemAppsPath, 'index/' + Entrypoint.settings.ui);
    static sitePath = path.join(Entrypoint.systemAppsPath, 'site/' + Entrypoint.settings.site);
    
    static showStartupApp(req, res) {
        if (Entrypoint.settings.startup === 'site') {
                res.sendFile(path.join(Entrypoint.sitePath, 'index.html'));
        } else {
                res.sendFile(path.join(Entrypoint.userAppsPath, Entrypoint.settings.startup + '/index.html'));
        }
    }

    static showIndex(req, res) {
        res.sendFile(path.join(Entrypoint.indexPath, 'index.html'));
    }
}

export default Entrypoint;