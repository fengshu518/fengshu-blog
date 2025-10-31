# 登录问题详细排查与修复指南

## 问题描述
用户在登录页面输入用户名和密码后点击登录按钮，表单字段变为空白，页面不跳转。

## 问题分析
根据测试结果，登录接口 `/admin/login` 可以正常访问，但登录验证失败后会重新渲染登录页面，而不是跳转到管理后台。这表明用户名和密码验证可能存在问题。

## 可能原因

### 1. 登录凭据不匹配
尽管文档中说明默认凭据是 `admin`/`password`，但实际代码中的验证逻辑可能不同。

### 2. 会话配置问题
express-session 配置可能存在问题，导致会话无法正确创建。

### 3. 表单处理问题
POST 请求处理可能存在问题，导致表单数据未正确接收。

## 修复方案

### 方案一：检查环境变量配置
1. 打开项目根目录下的 `.env` 文件
2. 确认文件中没有覆盖默认的登录凭据配置
3. 如果存在相关配置，请暂时注释掉或删除

### 方案二：手动验证登录逻辑
1. 打开 `routes/admin.js` 文件
2. 在登录处理函数中添加调试日志：

```javascript
// 处理登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('登录尝试:', username, password); // 添加调试日志
  
  // 简单验证（实际应用中需要更安全的验证方式）
  if (username === 'admin' && password === 'password') {
    req.session = req.session || {};
    req.session.isAdmin = true;
    console.log('登录成功'); // 添加调试日志
    res.redirect('/admin');
  } else {
    console.log('登录失败: 用户名或密码错误'); // 添加调试日志
    res.render('admin/login', { error: '用户名或密码错误' });
  }
});
```

### 方案三：检查服务器日志
1. 查看终端中运行的服务器日志
2. 尝试登录时观察是否有相关错误信息输出
3. 特别注意是否有会话相关的警告或错误

### 方案四：清除浏览器数据
1. 清除浏览器缓存和Cookie
2. 使用无痕/隐私模式重新访问登录页面
3. 重新输入凭据尝试登录

## 测试步骤

1. 使用以下PowerShell命令测试登录接口：
   ```powershell
   Invoke-WebRequest -Uri http://localhost:8080/admin/login -Method POST -Body "username=admin&password=password" -ContentType "application/x-www-form-urlencoded"
   ```

2. 观察返回结果：
   - 如果返回状态码为302，表示登录成功并重定向
   - 如果返回状态码为200，表示登录失败并重新渲染登录页面

## 进一步诊断

如果以上方案都无法解决问题，请提供以下信息：
1. 服务器启动日志的完整输出
2. 尝试登录时服务器控制台的输出信息
3. 浏览器开发者工具中网络请求的详细信息
4. `.env` 文件的内容（请隐藏敏感信息）

## 临时解决方案

如果急需访问管理后台，可以临时修改登录验证逻辑：

1. 打开 `routes/admin.js` 文件
2. 找到登录处理函数
3. 修改验证逻辑为直接通过：

```javascript
// 处理登录（临时解决方案）
router.post('/login', (req, res) => {
  req.session = req.session || {};
  req.session.isAdmin = true;
  res.redirect('/admin');
});
```

登录后请记得恢复原始代码以确保安全性。