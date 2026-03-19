import fs from 'fs';
import {spawn} from 'child_process'
import path from 'path';

class AppRunner {

    static TIMEOUT = 300000 // 5 mins

    static container = Object.freeze({
        DOCKER : 'docker',
        PODMAN: 'podman'
    });

    constructor (app, endpoint = null, container = AppRunner.container.DOCKER) {
        let serviceFile = `app/apps/${app}/service.json`
        this.service = JSON.parse(fs.readFileSync(serviceFile));
        this.endpoint = endpoint;
        this.container = container;
    }

    getConfig() {
        return this.service;
    }

    async exe() {
        return new Promise((resolve, reject)=>{

            let exe;
            let cleanup;
            let output = "";
            switch(this.container) {

                case AppRunner.container.DOCKER:
                    let interpretter = this.service.actions[this.endpoint];
                    const sourceFile = `${process.cwd()}/${path.join(this.service.dir, interpretter.script)}`;
                    exe = spawn (this.container,[
                        'run', '--rm', '-v',
                        `${sourceFile}:${interpretter.script}`, // copy script file into container
                        interpretter.image,
                        interpretter.executor,
                        interpretter.script
                    ], {
                        timeout: AppRunner.TIMEOUT,
                        killSignal: 'SIGINT'
                    });

                    cleanup = spawn('docker', ['container', 'prune', '-f'], {
                        stdio: [ 'ignore'], 
                        detached: true
                    });
                    break;

                case AppRunner.container.PODMAN:
                    // podman exec
                    break;

            }

            exe.stdout.on('data', (data) => {
                output += data;
            });

            exe.stderr.on('data', (data) => {
                output += `Error: ${data}`;
            });

            exe.on('close', (code) => {
                if (code === 0) {
                    resolve(output);
                } else {
                    reject(`Process exited with code ${code}: ${output}`);
                }
            });

        })  
    }
}

export default AppRunner;