# 应用程序部署说明

## 为什么不能直接使用GitHub Pages

此项目是一个Node.js Express应用程序，需要服务器环境运行。GitHub Pages仅支持静态网站托管，因此不能直接部署此应用程序。

## 推荐的部署方案

### 方案一：使用Railway（推荐）

Railway是一个现代化的部署平台，特别适合Node.js应用程序。

1. 访问[Railway官网](https://railway.app/)并注册账号
2. 在Railway中创建新项目
3. 连接您的GitHub仓库
4. 配置环境变量：
   - DATABASE_URL（如果使用MongoDB）
   - SESSION_SECRET（用于会话安全）
5. Railway会自动检测这是Node.js应用并进行部署

### 方案二：使用Vercel

1. 访问[Vercel官网](https://vercel.com/)并注册账号
2. 导入您的GitHub仓库
3. 配置构建设置：
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 方案三：使用Heroku

1. 访问[Heroku官网](https://heroku.com/)并注册账号
2. 安装Heroku CLI
3. 登录Heroku CLI：`heroku login`
4. 创建应用：`heroku create`
5. 部署应用：`git push heroku main`

## 环境变量配置

无论选择哪种部署方案，都需要配置以下环境变量：

```
NODE_ENV=production
SESSION_SECRET=your_secret_key_here
DATABASE_URL=your_mongodb_connection_string
CUSTOM_DOMAIN=blog.15zhuan.com
ENABLE_HTTPS=true
```

## 本地开发

要本地运行应用程序：

```bash
npm install
npm start
```

或者使用开发模式（带热重载）：

```bash
npm run dev
```