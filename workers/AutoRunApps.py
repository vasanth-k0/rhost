import json
import os
import subprocess

class AutoRunAppsMeta(type):

    appFolder = "server/app/apps/"
    appsFile = "apps.json"
        
    @classmethod
    def appList(cls):
        with open(f"{cls.appFolder}{cls.appsFile}",'r') as apps:
            apps = json.loads(apps.read())
            appList = apps.keys()
        return appList
    
    @classmethod
    def list(cls):
        appList = {};
        for app in cls.appList():
            with open(f"{cls.appFolder}{app}/service.json", "r") as service:
                service = json.loads(service.read())
                if service.get('autorun') and service.get('type') == "daemon":
                    appList[app] = service
        return appList
    
    @classmethod
    def run(cls):
        outp = {}
        for app, prop in cls.list().items():
            cmd = [
                            'docker', 
                            'run', 
                            '-d', 
                            '--name', 
                            app, 
                            '-p', 
                            f'{prop["ports"]["host"]}:{prop["ports"]["container"]}'
                        ]
            if prop.get("env"):
                for var, val in prop["env"].items():
                    cmd.extend(['-e', f'{var}={val}'])
            if prop.get("volumes"):
                for vname, vinfo in prop["volumes"].items():
                    cmd.extend(['-v', f'{vinfo["host"]}:{vinfo["container"]}'])
            cmd.append(prop["image"])
            try:
                print(f"Running AutoRunApps from {os.getcwd()}");
                res = subprocess.run(["docker", "container", "prune", "-f"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                print(f"Command on Shell: {cmd}")
                result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                outp[app] = result;
            except:
                print("Failed to start the Docker container.")
        return outp
            
                      
class AutoRunApps(metaclass=AutoRunAppsMeta):
    pass

print(AutoRunApps.run())