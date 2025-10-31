# MongoDB连接字符串配置说明

## 获取MongoDB Atlas连接字符串的完整步骤

### 1. 登录MongoDB Atlas
- 访问 [MongoDB Atlas](https://cloud.mongodb.com/)
- 使用您的账户登录

### 2. 获取连接字符串
1. 在Atlas控制台中，选择您的项目
2. 点击左侧导航栏的"Clusters"
3. 找到您的集群，点击"Connect"按钮
4. 选择"Connect your application"
5. 选择驱动程序版本（Node.js）
6. 复制连接字符串

### 3. 替换连接字符串中的占位符

复制的连接字符串通常看起来像这样：
```
mongodb+srv://<username>:<password>@cluster0.3ig5fk7.mongodb.net/?appName=Cluster0
```

您需要将其中的占位符替换为实际值：
- `<username>` → 您在MongoDB Atlas中创建的数据库用户名
- `<password>` → 该用户的密码

例如，如果您的用户名是 `fengshu_001`，密码是 `mysecretpassword123`，那么完整的连接字符串应该是：
```
mongodb+srv://fengshu_001:mysecretpassword123@cluster0.3ig5fk7.mongodb.net/?appName=Cluster0
```

### 4. 配置到项目中

您可以使用以下任一方法配置连接字符串：

#### 方法一：使用配置脚本（推荐）
```bash
npm run setup:mongodb
```
运行此命令后，按照提示输入完整的连接字符串。

#### 方法二：手动编辑配置文件
1. 编辑 `.env` 文件，将 `DATABASE_URL` 的值替换为完整的连接字符串
2. 编辑 `.env.production` 文件，将 `DATABASE_URL` 的值替换为完整的连接字符串

### 5. 测试连接

配置完成后，您可以使用以下命令测试连接：

```bash
# 启动开发服务器
npm run dev

# 或启动生产服务器
npm run start:prod

# 或启动HTTPS服务器
npm run start:https
```

## 常见问题

### 1. 连接字符串格式错误
确保您的连接字符串以 `mongodb://` 或 `mongodb+srv://` 开头。

### 2. 认证失败
- 检查用户名和密码是否正确
- 确保在MongoDB Atlas中已创建该用户
- 确保网络访问设置中已添加正确的IP白名单

### 3. 网络连接问题
- 在MongoDB Atlas的"Network Access"中添加 0.0.0.0/0 以允许所有IP访问
- 检查防火墙设置

## 安全建议

1. 不要在代码中硬编码密码
2. 使用环境变量存储敏感信息
3. 定期更换数据库密码
4. 限制IP访问范围（生产环境）