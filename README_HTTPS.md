# HTTPS 配置说明

本项目支持HTTPS协议，以下是配置和使用说明。

## 自动生成SSL证书

项目包含一个自动生成SSL证书的脚本：

```bash
node generate-cert.js
```

该脚本会：
1. 首先检查系统是否安装了OpenSSL
2. 如果安装了OpenSSL，则使用OpenSSL生成自签名证书
3. 如果未安装OpenSSL，则使用Node.js的node-forge库生成自签名证书

生成的证书将保存在`certs`目录中：
- `server.key` - 私钥文件
- `server.crt` - 证书文件

## 启用HTTPS

要启用HTTPS，请在启动服务器时设置环境变量：

```bash
# 使用npm脚本启动HTTPS服务器
npm run start:https

# 或者直接设置环境变量启动
ENABLE_HTTPS=true node server.js
```

## 环境变量配置

在`.env.production`文件中可以配置以下HTTPS相关参数：

- `ENABLE_HTTPS` - 设置为true以启用HTTPS
- `HTTPS_PORT` - HTTPS服务器端口（默认8443）

## 注意事项

1. 自动生成的证书仅用于开发和测试环境，不应用于生产环境
2. 在生产环境中，建议使用权威机构签发的SSL证书
3. 浏览器可能会显示安全警告，这是因为使用了自签名证书
4. 要避免浏览器警告，可以在浏览器中添加安全例外，或者使用权威证书

## 生产环境部署

在生产环境中部署HTTPS网站时：

1. 获取权威机构签发的SSL证书
2. 将证书文件放置在`certs`目录中
3. 确保`.env.production`文件中配置了正确的环境变量
4. 启动服务器并验证HTTPS是否正常工作