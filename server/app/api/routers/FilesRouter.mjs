import {Router} from 'express';
import fs from "node:fs"

const FilesRouter = Router();

FilesRouter.route('/').get((req, res)=>{
    res.json({
        'response': 'Root file system'
    });
})

FilesRouter.route('/scandir').post((req, res)=>{
    let dir = req.body.dir;
    const basepath = "app/storage/";
    dir = basepath + dir;
    /**
     * check user for internal
     */


    /** */

    if (fs.existsSync(dir)) {
        fs.readdir(dir, (err, files) => {
            let msg;
            if (err) {
                msg = 'error'
            }
            let outp={};
             files.forEach((file, index)=>{ 
                            let path = dir.replace(basepath, '') + "/" + file;
                            outp[file] = [ path , fs.lstatSync(dir+"/"+file).isDirectory() ]  
                        });
            res.json({
                'response': outp
            });
        });
    } else {
        res.status(404).end();
    }
    
})

export default FilesRouter;