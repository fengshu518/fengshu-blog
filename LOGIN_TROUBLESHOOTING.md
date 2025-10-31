# 登录问题排查指南

> **注意**: 请查看 [FIXED_LOGIN_TROUBLESHOOTING.md](FIXED_LOGIN_TROUBLESHOOTING.md) 获取更详细的排查和修复方案。

## 问题描述
使用默认凭据（用户名: admin, 密码: password）无法登录博客管理后台，或者登录后表单字段变为空白且页面不跳转。

## 可能原因及解决方案

### 1. 会话配置问题
博客使用 express-session 中间件管理会话，如果 SESSION_SECRET 配置不当可能导致登录问题。

**解决方案：**
- 检查 `.env` 文件中的 SESSION_SECRET 配置
- 确保 SESSION_SECRET 不为空且为强随机字符串

### 2. 浏览器缓存或Cookie问题
浏览器可能缓存了旧的会话信息或Cookie。

**解决方案：**
- 清除浏览器缓存和Cookie
- 尝试使用无痕/隐私模式访问
- 或者使用不同的浏览器测试

### 3. 服务器重启导致会话丢失
如果服务器重启，内存中的会话数据会丢失。

**解决方案：**
- 重新登录
- 检查服务器是否稳定运行

### 4. 网络或代理问题
如果使用了反向代理或存在网络问题，可能导致POST请求失败。

**解决方案：**
- 检查网络连接
- 如果使用Nginx等反向代理，检查配置是否正确

## 手动测试登录接口

可以使用以下PowerShell命令测试登录接口：

```powershell
Invoke-WebRequest -Uri http://localhost:8080/admin/login -Method POST -Body "username=admin&password=password" -ContentType "application/x-www-form-urlencoded"
```

## 重置登录状态

如果遇到持续的登录问题，可以尝试以下方法：

1. 停止服务器
2. 清除浏览器缓存
3. 重新启动服务器
4. 再次尝试登录

## 修改默认凭据

为了安全起见，建议修改默认凭据：

1. 打开 `routes/admin.js` 文件
2. 找到以下代码段：
   ```javascript
   if (username === 'admin' && password === 'password') {
   ```
3. 将 'admin' 和 'password' 替换为您想要的用户名和密码

## 联系支持

如果以上方法都无法解决问题，请提供以下信息以便进一步排查：
1. 服务器启动日志
2. 浏览器开发者工具中的网络请求信息
3. 错误页面的截图或错误信息