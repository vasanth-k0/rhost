import fs from 'fs';
import {spawn} from 'child_process'
import path from 'path';

class AppRunner {
    static container = Object.freeze({
        DOCKER : 'docker',
        PODMAN: 'podman'
    });

    constructor(serviceFile, endpoint, container=AppRunner.container.DOCKER) {
        this.service = JSON.parse(fs.readFileSync(serviceFile));
        this.endpoint = endpoint;
        this.container = container;
    }

    async exe() {
        return new Promise((resolve, reject)=>{

            let exe;
            switch(this.container) {

                case AppRunner.container.DOCKER:
                    const sourceFile = `${process.cwd()}/${path.join(this.service.dir, this.service.actions[this.endpoint])}`;
                    exe = spawn (this.container,[
                        'run', '--rm', '-v',
                        `${sourceFile}:${this.service.target}`, // copy script file into container
                        this.service.image,
                        this.service.executor,
                        this.service.target
                    ]);
                    break;

                case AppRunner.container.PODMAN:
                    // podman exec
                    break;

            }

            exe.stdout.on('data', (data) => {
                resolve(`Output: ${data}`);
            });

            exe.stderr.on('data', (data) => {
                reject(`Error: ${data}`);
            });
        })  
    }
}

export default AppRunner;