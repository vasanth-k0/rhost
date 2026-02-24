import bcrypt from 'bcrypt';
import { User } from '../../db/models/user.mjs';

class Authorizer {

    static async validateSession(req){
        if (req.session && req.session.user && req.session.user.username == "admin") {
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

}

export default Authorizer;