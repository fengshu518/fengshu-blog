# MongoDB数据库配置说明

## 重要提醒

在使用本博客系统之前，您需要将环境配置文件中的MongoDB连接字符串替换为您自己的连接字符串。

## 配置步骤

### 1. 获取您的MongoDB连接字符串

如果您已经按照之前的指导完成了MongoDB Atlas的设置，您应该已经获得了类似以下格式的连接字符串：

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database-name>?retryWrites=true&w=majority
```

### 2. 替换环境配置文件中的连接字符串

您需要修改以下两个文件中的`DATABASE_URL`变量：

#### 文件1: `.env` (开发/测试环境)
路径: `fengshu-blog/.env`

找到以下行：
```bash
DATABASE_URL=mongodb+srv://bloguser:yourpassword@cluster0.xxxxx.mongodb.net/fengshublog?retryWrites=true&w=majority
```

将其替换为您的实际连接字符串。

#### 文件2: `.env.production` (生产环境)
路径: `fengshu-blog/.env.production`

找到以下行：
```bash
DATABASE_URL=mongodb+srv://bloguser:yourpassword@cluster0.xxxxx.mongodb.net/fengshublog?retryWrites=true&w=majority
```

将其替换为您的实际连接字符串。

### 3. 替换占位符

在您的连接字符串中，请确保替换以下占位符：

- `<username>`: 您在MongoDB Atlas中创建的数据库用户名
- `<password>`: 您的数据库用户密码
- `<database-name>`: 您想要使用的数据库名称（例如：fengshublog）

例如，如果您的用户名是`mybloguser`，密码是`mypassword123`，数据库名是`fengshublog`，那么连接字符串应该是：

```
mongodb+srv://mybloguser:mypassword123@cluster0.xxxxx.mongodb.net/fengshublog?retryWrites=true&w=majority
```

## 安全提醒

1. 请勿将包含真实凭据的配置文件提交到公共代码仓库
2. 定期更换数据库密码以确保安全
3. 在生产环境中，建议限制IP访问权限而不是使用"允许从任何地方访问"

## 测试连接

配置完成后，您可以启动博客应用来测试数据库连接是否正常：

```bash
# 开发环境测试
npm run dev

# 生产环境测试
npm run start:prod
```

如果连接成功，您应该能在应用启动日志中看到数据库连接成功的消息。

## Railway部署时的配置

当您在Railway上部署应用时，可以通过Railway的环境变量设置界面直接添加`DATABASE_URL`变量，而无需修改代码文件。