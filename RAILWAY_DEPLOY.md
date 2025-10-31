# Railway部署指南

本指南将帮助您将峰叔靠谱博客部署到Railway平台。

## 准备工作

1. 注册[Railway](https://railway.app/)账户
2. 准备一个MongoDB数据库（可以使用MongoDB Atlas免费套餐）

## 部署步骤

### 1. Fork项目（可选）
如果您想对项目进行自定义修改，建议先Fork本项目到您的GitHub账户。

### 2. 在Railway上创建新项目
1. 登录Railway控制台
2. 点击"New Project"
3. 选择"Deploy from GitHub repo"
4. 选择您的仓库（或原仓库）
5. 点击"Deploy"

### 3. 配置环境变量
1. 在Railway项目页面，点击"Settings"选项卡
2. 在"Environment"部分，添加以下环境变量：
   - `NODE_ENV`: `production`
   - `SESSION_SECRET`: `一个强随机字符串`（建议使用密码生成器生成）
   - `DATABASE_URL`: `您的MongoDB连接字符串`
   - `PORT`: `8080`（可选，默认为8080）

### 4. 配置MongoDB数据库
如果您还没有MongoDB数据库，可以使用MongoDB Atlas免费套餐：
1. 访问[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 注册账户并创建免费集群
3. 创建数据库用户并记录连接信息
4. 在网络访问设置中添加允许所有IP访问（或仅允许Railway的IP）
5. 获取连接字符串并设置到Railway的`DATABASE_URL`环境变量

### 5. 配置HTTPS（可选）
如果您希望启用HTTPS：
1. 在环境变量中添加：
   - `ENABLE_HTTPS`: `true`
   - `HTTPS_PORT`: `8443`（可选，默认为8443）

### 6. 重新部署
在设置完环境变量后，Railway会自动重新部署应用。

## 访问您的博客
部署完成后，Railway会为您提供一个默认的域名，您可以通过该域名访问您的博客。

## 自定义域名（可选）
如果您想使用自定义域名：
1. 在Railway项目设置中，找到"Custom Domain"部分
2. 添加您的域名
3. 按照提示在您的域名提供商处设置DNS记录

## 故障排除
如果遇到问题，请检查：
1. 环境变量是否正确设置
2. MongoDB连接字符串是否正确
3. MongoDB数据库是否允许来自Railway的连接

## 性能优化建议
1. 根据访问量调整Railway实例的规格
2. 启用Railway的自动扩缩容功能（如果可用）
3. 定期清理不必要的环境变量和配置