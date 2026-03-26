sudo apt update
sudo apt install git


: <<'EOF'
    Create init script based on initial setup

    1  ssh-keygen -t ed25519 -C "vasanth.k08@gmail.com"
    2  eval "$(ssh-agent -s)"
    3  ssh-add ~/.ssh/id_ed25519
    4  cat ~/.ssh/id_ed25519.pub
    5  ssh -T github.com
    6  git status
    7  sudo apt-get install git
    8  sudo apt update
    9  sudo apt install git
   10  git status
   11  git --version


Install Docker

# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
filename: /etc/apt/sources.list.d/docker.sources

Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc

------------------
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

 sudo usermod -aG docker admin
exit and reconnect

clone repository
git clone git@github.com:vasanth-k0/rhost.git


initial docker pull for default images
   75  docker pull python:3.12-slim
   76  docker pull php:8.4.19-cli-alpine3.22
   77  docker pull node:25.8-alpine


install node and npm, pm2 and setup server
sudo apt install nodejs npm
sudo npm install -g pm2

cd rhost/server
npm install

create secrets.json file

npx sequelize-cli db:migrate

cd app
pm2 start index.mjs --name "rhost"

NODE_ENV="production"
for peristant 
 nano ~/.bashrc
 export NODE_ENV="production"

change port to 80 in settings

EOF
