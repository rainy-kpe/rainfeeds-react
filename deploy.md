# Deployment

## Prerequirements

```
apt-get install nodejs npm
npm install -g forever
ln -s /usr/bin/nodejs /usr/bin/node

sudo adduser rainfeeds --disabled-password
mkdir /home/rainfeeds/.ssh
cp /root/.ssh/authorized_keys /home/rainfeeds/.ssh/
chown -R rainfeeds.rainfeeds /home/rainfeeds/.ssh/

ssh rainfeeds@rainclip.download "mkdir -p backend/dist"
ssh rainfeeds@rainclip.download "mkdir -p frontend/dist"
```

## Deploy Backend
```
scp backend/dist/* rainfeeds@rainclip.download:~/backend/dist/
```

## Deploy Frontend
```
scp frontend/dist/* rainfeeds@rainclip.download:~/frontend/dist/
```

## Restart the Server
```
ssh rainfeeds@rainclip.download "cd backend && forever restart dist/main.js"
```
