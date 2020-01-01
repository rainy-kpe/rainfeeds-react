# Deployment

## Prerequirements

At the server:

```
apt-get install nodejs npm
npm install -g forever

sudo adduser rainfeeds --disabled-password
mkdir /home/rainfeeds/.ssh
cp /root/.ssh/authorized_keys /home/rainfeeds/.ssh/
chown -R rainfeeds.rainfeeds /home/rainfeeds/.ssh/

sudo su rainfeeds
cd ~
mkdir -p backend/dist
mkdir -p frontend/dist
```

## Deploy Backend

```
scp backend/dist/* rainfeeds@rainclip:~/backend/dist/
```

## Deploy Frontend

```
scp frontend/dist/* rainfeeds@rainclip:~/frontend/dist/
```

## Start the Server

```
ssh rainfeeds@rainclip "cd backend && forever start dist/main.js"
```

## Restart the Server

```
ssh rainfeeds@rainclip "cd backend && forever restart dist/main.js"
```
