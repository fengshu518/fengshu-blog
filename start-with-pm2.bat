@echo off
echo 正在通过PM2启动博客应用...
cd /d D:\wwwroot\blog.15zhaun.com
pm2 start server.js --name "fengshu-blog"
pm2 startup
pm2 save
echo 博客应用已通过PM2启动
pm2 list
pause