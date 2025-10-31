# 峰叔靠谱博客

这是一个使用Node.js和Express构建的个人博客网站。

## 功能特性

- 首页文章列表展示
- 文章详情页面（支持Markdown渲染）
- 关于页面
- 管理员后台系统
  - 管理员登录/登出
  - 文章管理（创建、编辑、删除）
  - 仪表板统计

## 技术栈

- Node.js
- Express.js
- EJS模板引擎
- Markdown渲染（marked + highlight.js）
- CSS3样式

## 管理后台默认凭据

- **用户名**: `admin`
- **密码**: `password`

> **重要提醒**: 首次登录后请立即修改默认密码以确保博客安全。详细安全建议请查看 [ADMIN_CREDENTIALS.md](ADMIN_CREDENTIALS.md) 文件。

## 本地开发

1. 克隆项目：
   ```
   git clone <项目地址>
   ```

2. 安装MongoDB数据库：
   - 访问 [MongoDB官网](https://www.mongodb.com/try/download/community) 下载并安装MongoDB Community Server
   - 启动MongoDB服务

3. 安装依赖：
   ```
   npm install
   ```

4. 启动开发服务器：
   ```
   npm run dev
   ```

5. 访问应用：
   打开浏览器访问 `http://localhost:3000`

## 环境配置

项目支持多种环境配置文件：

- `.env` - 默认环境配置
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

支持的环境变量包括：

- `NODE_ENV` - 运行环境 (development/production)
- `PORT` - 服务器端口
- `SESSION_SECRET` - 会话密钥
- `DATABASE_URL` - 数据库连接URL
- `ENABLE_HTTPS` - 是否启用HTTPS
- `HTTPS_PORT` - HTTPS端口
- `HOST` - 服务器主机地址
- `CUSTOM_DOMAIN` - 自定义域名

### MongoDB数据库配置

要使用MongoDB数据库，您需要：

1. 在MongoDB Atlas上创建一个集群
2. 获取连接字符串
3. 将连接字符串配置到环境变量中

#### 使用MongoDB Atlas（推荐）

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建一个免费的M0 Sandbox集群
3. 在数据库访问页面创建一个用户并设置密码
4. 在网络访问页面添加IP白名单（建议添加 0.0.0.0/0 以允许所有IP访问）
5. 在集群页面点击"Connect"，选择"Connect your application"
6. 复制连接字符串

#### 配置连接字符串

将获取的连接字符串配置到以下文件中：
- `.env` - 开发和生产环境的默认配置
- `.env.production` - 生产环境配置

连接字符串格式如下：
```
mongodb+srv://<用户名>:<密码>@<集群地址>/<数据库名>?retryWrites=true&w=majority
```

示例：
```
DATABASE_URL=mongodb+srv://bloguser:mypassword@cluster0.xxxxx.mongodb.net/fengshublog?retryWrites=true&w=majority
```

#### 使用配置脚本（推荐）

项目提供了一个交互式脚本来帮助您配置MongoDB连接字符串：

```bash
npm run setup:mongodb
```

运行此命令后，按照提示输入您的MongoDB连接字符串即可。

有关获取和配置MongoDB连接字符串的详细说明，请参阅 [MONGODB_CONFIG_INSTRUCTIONS.md](MONGODB_CONFIG_INSTRUCTIONS.md) 文件。

**重要**: 请同时参考 [MONGODB_CORRECT_CONFIG.md](../MONGODB_CORRECT_CONFIG.md) 以确保正确配置连接字符串。

### MongoDB数据库配置

本项目支持使用MongoDB作为数据存储。您可以选择使用本地MongoDB实例或MongoDB Atlas云服务。

#### 使用MongoDB Atlas（推荐）

1. 按照`MONGODB_SETUP.md`文件中的说明创建MongoDB Atlas账户和集群
2. 获取连接字符串并替换环境配置文件中的`DATABASE_URL`值
3. 详细配置说明请参考项目根目录下的`MONGODB_SETUP.md`文件

## 启动服务器

项目提供了多种启动方式以适应不同的部署环境：

### 命令行启动

```bash
# 开发模式启动
npm run dev

# 生产模式启动
npm run start:prod

# HTTPS模式启动
npm run start:https

# 自定义域名模式启动
npm run start:domain
```

### 启动助手

为了方便使用，项目还提供了启动助手：

- **Windows用户**: 双击运行 `start-blog.bat` 文件
- **其他系统用户**: 运行 `npm run start:helper` 命令

启动助手会引导您选择合适的启动模式，并提供配置选项。

## 部署

项目支持多种部署方式，包括GitHub Pages、Railway、Heroku等平台。

### GitHub Pages部署（静态网站）

本项目支持将博客转换为静态网站并部署到GitHub Pages，适合不需要动态功能的场景。

#### 自动部署（推荐）

1. 确保您的仓库已启用GitHub Actions（默认已启用）
2. 推送代码到main分支，GitHub Actions会自动构建并部署静态网站
3. 在仓库设置中启用GitHub Pages：
   - 进入仓库的Settings页面
   - 点击左侧的Pages选项
   - 在"Build and deployment"部分，选择"GitHub Actions"作为源
   - 保存设置

#### 手动部署

如果您想手动部署静态网站，可以按照以下步骤操作：

1. 生成静态网站文件：
   ```bash
   npm run build:static
   ```

2. 提交生成的文件到docs目录：
   ```bash
   git add docs
   git commit -m "Update static site"
   git push origin main
   ```

3. 在仓库设置中启用GitHub Pages：
   - 进入仓库的Settings页面
   - 点击左侧的Pages选项
   - 在"Build and deployment"部分，选择"Deploy from a branch"
   - 在"Branch"下拉菜单中选择main分支，docs文件夹
   - 保存设置

#### 自定义域名配置

要在GitHub Pages上使用自定义域名：

1. 在仓库根目录和docs目录中都放置CNAME文件，内容为您的域名（例如：blog.yourdomain.com）
2. 在您的域名提供商处添加DNS记录：
   - 添加CNAME记录指向：`<username>.github.io`
   - 或添加A记录指向GitHub Pages的IP地址：
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

### Railway部署

1. 在Railway平台上创建新项目
2. 连接您的Git仓库
3. Railway会自动检测并部署应用
4. 在项目设置中配置环境变量

### 自定义域名配置

项目支持自定义域名配置，可以通过以下环境变量进行设置：

- `HOST` - 服务器绑定的主机地址（默认为localhost）
- `ENABLE_HTTPS` - 是否启用HTTPS（设为true以启用HTTPS）
- `HTTPS_PORT` - HTTPS服务器端口（默认为8443）

#### 使用自定义域名启动

```bash
# 使用自定义主机地址启动（适用于局域网访问）
npm run start:host

# 使用自定义主机地址和HTTPS启动
npm run start:domain
```

#### 环境变量配置示例

在`.env.production`文件中添加以下配置：

```env
# 自定义域名配置
CUSTOM_DOMAIN=yourdomain.com
HOST=0.0.0.0
```

#### Nginx反向代理配置

如果在传统服务器上部署，可以使用Nginx作为反向代理。示例配置文件请参考`nginx.conf.example`。

## 管理员登录

访问 `/admin/login` 进入管理员登录页面：
- 用户名：admin
- 密码：password

> 注意：在生产环境中，请修改默认的管理员凭据。

如果遇到登录问题（如输入账号密码后点击登录时，账号密码输入框全部空白了，并且页面也不跳转），请参考以下文件中的排查指南：
- [LOGIN_TROUBLESHOOTING.md](LOGIN_TROUBLESHOOTING.md) - 基本排查指南
- [FIXED_LOGIN_TROUBLESHOOTING.md](FIXED_LOGIN_TROUBLESHOOTING.md) - 详细排查与修复指南

## 许可证

MIT