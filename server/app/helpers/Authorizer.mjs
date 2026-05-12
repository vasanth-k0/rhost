import bcrypt from 'bcrypt';
import { User } from '../db/models/user.mjs';
import Entrypoint from './Entrypoint.mjs';
import path from 'path';

class Authorizer {

    static async validateSession(req){
        if (req.session && req.session.user && req.session.user.username == "admin") {
            console.log("Authorize: " , req.session)
            return true; 
        } else if(req.query.username
            && req.query.password
            && req.query.username == "admin"
            && (await Authorizer.verifyCredentials(req.query.password) === true)) {
                req.session.user = {
                    username: 'admin'
                };
                return true;
        }
        return false;
    }

    static async verifyCredentials(password){
            let admin = await User.findOne({
                where: {
                    username: 'admin'
                }
             });
            if (admin
                && bcrypt.compareSync(password, admin.password) === true) {
                    return true;
                }
           return false;
    }

    static async authRoute(req, res, next){
        let appName = req.params.endpoint;

        if (appName in Entrypoint.apps ){
            if ( (req.session 
                    && req.session.user 
                    && Entrypoint.apps[appName].users.includes(req.session.user.username))
                || Entrypoint.apps[appName].users.length == 0 ){
                    return next();
            } else if ( Entrypoint.apps[appName].published === true ) {
                    res.sendFile(path.join(path.join(Entrypoint.appsPath,appName,'view', 'index.html')))
            } else {
            res.status(401).send('Unauthorized');
            }
                
        } else {
            res.status(401).send('Unauthorized');
        }
    }

}

export default Authorizer;