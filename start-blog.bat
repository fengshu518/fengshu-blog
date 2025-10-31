@echo off
title 峰叔靠谱博客启动助手

echo ================================
echo   峰叔靠谱博客启动助手
echo ================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js版本: 
node --version
echo.

REM 显示启动选项
echo 请选择启动模式:
echo 1. 开发模式 (npm run dev)
echo 2. 生产模式 (npm run start:prod)
echo 3. HTTPS模式 (npm run start:https)
echo 4. 自定义域名模式 (npm run start:domain)
echo 5. 配置MongoDB (npm run setup:mongodb)
echo 6. 测试MongoDB连接 (npm run test:mongodb)
echo 0. 退出
echo.

REM 获取用户选择
set /p choice=请输入选项 (0-6): 

REM 根据用户选择执行相应命令
if "%choice%"=="1" (
    echo 启动开发模式...
    npm run dev
) else if "%choice%"=="2" (
    echo 启动生产模式...
    npm run start:prod
) else if "%choice%"=="3" (
    echo 启动HTTPS模式...
    npm run start:https
) else if "%choice%"=="4" (
    echo 启动自定义域名模式...
    npm run start:domain
) else if "%choice%"=="5" (
    echo 配置MongoDB连接字符串...
    npm run setup:mongodb
) else if "%choice%"=="6" (
    echo 测试MongoDB连接...
    npm run test:mongodb
) else if "%choice%"=="0" (
    echo 退出程序...
    exit /b 0
) else (
    echo 无效选项，请输入0-6之间的数字
    echo.
    pause
    goto :eof
)

echo.
pause