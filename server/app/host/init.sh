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
sudo pm2 start index.mjs --name "rhost" // aws not letting to run on port 80 for non root users

NODE_ENV="production"
for peristant 
 nano ~/.bashrc
 export NODE_ENV="production"

install reverse proxy nginx and certbot for ssl
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y


nginx configuration

sudo nano /etc/nginx/sites-available/cloudpc.in

server {
    listen 80;
    server_name cloudpc.in www.cloudpc.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

start nginx

sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

sudo rm /etc/nginx/sites-enabled/default
remove default site

server configuration
----------------------
server {
    server_name cloudpc.in www.cloudpc.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/cloudpc.in/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/cloudpc.in/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = cloudpc.in) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name cloudpc.in www.cloudpc.in;
    return 301 https://$host$request_uri;

}
EOF
