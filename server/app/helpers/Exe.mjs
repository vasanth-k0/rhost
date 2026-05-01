import fs from 'fs';
import {spawn} from 'child_process'
import path from 'path';

class Exe {

    static TIMEOUT = 300000 // 5 mins

    static container = Object.freeze({
        DOCKER: 'docker',
        PODMAN: 'podman'
    });

    constructor (app, data, container = Exe.container.DOCKER) {
        let serviceFile = `app/apps/coderun-lite/service.json`
        this.service = JSON.parse(fs.readFileSync(serviceFile));
        this.endpoint = app.action;
        this.container = container;
        this.data = data;
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

                case Exe.container.DOCKER:
                    let interpretter = this.service.actions[this.endpoint];
                    const userScript = `${process.cwd()}/${path.join(this.service.dir, interpretter.script)}`;
                    const lang = {
                        'python': {
                            bin: 'python3',
                            ext: 'py',
                            image: 'python:3.12-slim',
                        },
                        'php': {
                            bin: 'php',
                            ext: 'php',
                            image: 'php:8.4.19-cli-alpine3.22'
                        },
                        'node': {
                            bin: 'node',
                            ext: 'js',
                            image: 'node:25.8-alpine'
                        }
                    }
                    interpretter.processor = `/run/process.${lang[interpretter.executor].ext}`;
                    const processorScript = `${process.cwd()}/app/helpers${interpretter.processor}`;
                   
                    exe = spawn (this.container,[
                        'run', '--rm', 
                        '-v', `${userScript}:${interpretter.script}`, // copy user script file into container
                        '-v', `${processorScript}:${interpretter.processor}`, // copy processor script into container
                        lang[interpretter.executor].image,
                        lang[interpretter.executor].bin,
                        interpretter.processor,
                        interpretter.script,
                        this.data
                    ], {
                        timeout: Exe.TIMEOUT,
                        killSignal: 'SIGINT'
                    });

                    cleanup = spawn('docker', ['container', 'prune', '-f'], {
                        stdio: [ 'ignore'], 
                        detached: true
                    });
                    break;

                case Exe.container.PODMAN:
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

export default Exe;