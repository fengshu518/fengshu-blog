# GitHub Pages 自定义域名配置指南

本指南将帮助您为GitHub Pages配置自定义域名，包括DNS设置和HTTPS配置。

## 准备工作

1. 拥有一个GitHub账户
2. 拥有一个自定义域名
3. 拥有域名提供商的DNS管理权限

## 配置步骤

### 1. 在GitHub Pages仓库中设置自定义域名

1. 进入您的GitHub Pages仓库
2. 点击"Settings"选项卡
3. 在左侧菜单中找到"Pages"选项
4. 在"Custom domain"字段中输入您的自定义域名
5. 点击"Save"保存设置

### 2. 配置DNS记录

根据您的域名类型，需要配置不同的DNS记录：

#### 使用子域名（推荐）

如果您使用子域名（如blog.yourdomain.com）：

1. 在域名提供商的DNS管理面板中添加一条CNAME记录：
   - 类型：CNAME
   - 名称：您的子域名（如blog）
   - 值：<username>.github.io（将<username>替换为您的GitHub用户名）
   - TTL：300秒（或使用默认值）

#### 使用根域名

如果您想使用根域名（如yourdomain.com）：

1. 在域名提供商的DNS管理面板中添加以下A记录：
   - 类型：A
   - 名称：@
   - 值：185.199.108.153
   - TTL：300秒
   
   - 类型：A
   - 名称：@
   - 值：185.199.109.153
   - TTL：300秒
   
   - 类型：A
   - 名称：@
   - 值：185.199.110.153
   - TTL：300秒
   
   - 类型：A
   - 名称：@
   - 值：185.199.111.153
   - TTL：300秒

### 3. 验证配置

1. 回到GitHub仓库的Pages设置页面
2. 点击"Verify"按钮检查DNS配置是否正确
3. 等待DNS传播完成（通常需要几分钟到几小时）

## HTTPS配置

GitHub Pages会自动为自定义域名配置HTTPS证书：

1. 在Pages设置中启用"Enforce HTTPS"选项
2. GitHub会自动申请并配置Let's Encrypt证书
3. 证书会自动续期，无需手动操作

## 故障排除

### 常见问题

1. **域名无法访问**
   - 检查DNS记录是否正确
   - 确认DNS已传播完成（可使用nslookup命令检查）
   - 等待最多24小时让DNS完全传播

2. **HTTPS证书不生效**
   - 确保DNS配置正确
   - 等待证书自动配置完成（可能需要几分钟）
   - 检查是否启用了"Enforce HTTPS"选项

3. **重定向问题**
   - 检查是否存在多个CNAME记录指向不同目标
   - 确认只有一条CNAME记录指向<username>.github.io

### 调试步骤

1. 使用`nslookup yourdomain.com`检查DNS解析
2. 使用`ping yourdomain.com`检查网络连通性
3. 检查GitHub Pages构建状态是否成功

## 注意事项

1. GitHub Pages自定义域名完全免费
2. HTTPS证书由GitHub自动管理
3. DNS更改可能需要几分钟到几小时才能生效
4. 如果更改了自定义域名，旧域名将在7天后停止工作