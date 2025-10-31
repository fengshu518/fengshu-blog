# 部署指南

本文档介绍了如何将峰叔靠谱博客部署到不同的平台。

## 部署前准备

1. 确保已安装MongoDB数据库：
   - 访问 [MongoDB官网](https://www.mongodb.com/try/download/community) 下载并安装MongoDB Community Server
   - 启动MongoDB服务

2. 确保已安装所有依赖：
   ```
   npm install
   ```

3. 配置环境变量：
   - 复制 `.env.example` 文件并重命名为 `.env`
   - 根据部署环境修改相应的配置项
   - 特别注意设置强随机的 `SESSION_SECRET`
   - 设置正确的 `DATABASE_URL`

## 支持的部署平台

### Heroku

1. 在Heroku上创建新应用
2. 连接GitHub仓库或使用Heroku CLI部署
3. 设置环境变量：
   ```
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your-strong-random-secret
   ```
4. 部署应用

### Railway

1. 在Railway上创建新项目
2. 连接GitHub仓库或直接部署
3. 在项目设置中添加环境变量
4. 部署应用

### Vercel

1. 在Vercel上导入项目
2. 配置环境变量
3. 部署应用

### 传统服务器部署

1. 确保服务器已安装Node.js和npm
2. 克隆代码到服务器：
   ```
   git clone <项目地址>
   cd fengshu-blog
   ```
3. 安装依赖：
   ```
   npm install
   ```
4. 配置环境变量
5. 使用PM2启动应用：
   ```
   npm install -g pm2
   pm2 start server.js --name "fengshu-blog"
   pm2 startup
   pm2 save
   ```

## 环境变量配置

必须配置的环境变量：
- `NODE_ENV`: 运行环境，设置为 `production`
- `SESSION_SECRET`: 会话密钥，应为强随机字符串
- `PORT`: 服务器端口（可选，默认3000）
- `DATABASE_URL`: MongoDB数据库连接URL（如果使用数据库）

## 安全建议

1. 在生产环境中使用强随机的 `SESSION_SECRET`
2. 配置HTTPS证书
3. 定期更新依赖包
4. 不要将敏感信息提交到代码仓库